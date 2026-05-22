import json

from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse
from django.shortcuts import redirect, render
from django.utils import timezone
from django.views.decorators.http import require_http_methods
from django.views.generic import TemplateView

from .progression_constants import (
    VALID_CHALLENGE_IDS,
    VALID_GATE_KEYS,
    VALID_PICKUP_IDS,
    VALID_SHRINE_IDS,
)


# ---------------------------------------------------------------------------
# API: player state (Layer 9 - Chances persistence)
# ---------------------------------------------------------------------------

DEFAULT_GAME_STATE = {
    'version': 1,
    'solved_challenges': [],
    'open_gates': [],
    'completed_shrines': [],
    'boss_bug_defeated': False,
    'region_restored': False,
    'challenge_attempts': {},
    'collected_pickups': [],
    'code_shards': 0,
    'shop_purchases': {},
    'side_challenges_completed': [],
}



def _normalise_game_state(payload):
    """Validate and normalise incoming game-state payload."""
    payload = payload if isinstance(payload, dict) else {}

    def _clean_str_list(value):
        if not isinstance(value, list):
            return []
        return [str(v) for v in value if isinstance(v, (str, int, float))]

    try:
        code_shards = int(payload.get('code_shards', 0) or 0)
    except (TypeError, ValueError):
        code_shards = 0

    state = {
        'version': 1,
        'solved_challenges': _clean_str_list(payload.get('solved_challenges')),
        'open_gates': _clean_str_list(payload.get('open_gates')),
        'completed_shrines': _clean_str_list(payload.get('completed_shrines')),
        'boss_bug_defeated': bool(payload.get('boss_bug_defeated', False)),
        'region_restored': bool(payload.get('region_restored', False)),
        'challenge_attempts': {},
        'collected_pickups': _clean_str_list(payload.get('collected_pickups')),
        'code_shards': max(0, min(9999, code_shards)),
        'shop_purchases': payload.get('shop_purchases') if isinstance(payload.get('shop_purchases'), dict) else {},
        'side_challenges_completed': _clean_str_list(payload.get('side_challenges_completed')),
    }
    raw_attempts = payload.get('challenge_attempts', {})
    if isinstance(raw_attempts, dict):
        clean_attempts = {}
        for k, v in raw_attempts.items():
            if isinstance(k, str):
                try:
                    clean_attempts[k] = max(0, int(v))
                except (TypeError, ValueError):
                    continue
        state['challenge_attempts'] = clean_attempts
    return state


def _filter_and_heal_game_state(state):
    """
    Remove unknown IDs from persisted state to guard against tampered payloads
    and stale/legacy data drift.
    """
    filtered = _normalise_game_state(state)
    filtered['completed_shrines'] = sorted({
        s for s in filtered.get('completed_shrines', []) if s in VALID_SHRINE_IDS
    })
    filtered['solved_challenges'] = sorted({
        c for c in filtered.get('solved_challenges', []) if c in VALID_CHALLENGE_IDS
    })
    filtered['open_gates'] = sorted({
        g for g in filtered.get('open_gates', []) if g in VALID_GATE_KEYS
    })
    filtered['collected_pickups'] = sorted({
        p for p in filtered.get('collected_pickups', []) if p in VALID_PICKUP_IDS
    })
    filtered['side_challenges_completed'] = sorted(set(filtered.get('side_challenges_completed', [])))
    filtered['code_shards'] = max(0, min(9999, int(filtered.get('code_shards', 0) or 0)))
    filtered['shop_purchases'] = filtered.get('shop_purchases') if isinstance(filtered.get('shop_purchases'), dict) else {}
    attempts = filtered.get('challenge_attempts', {})
    filtered['challenge_attempts'] = {
        cid: count for cid, count in attempts.items() if cid in VALID_CHALLENGE_IDS
    }
    return filtered


def _save_profile_state(profile, state, set_region_if_restored=False):
    """Persist normalised state + version, optionally syncing current_region."""
    profile.game_state = _filter_and_heal_game_state(state)
    profile.game_state_version = DEFAULT_GAME_STATE['version']
    update_fields = ['game_state', 'game_state_version', 'updated_at']

    if set_region_if_restored and state.get('region_restored'):
        from game.models import Region
        try:
            region1 = Region.objects.get(order=1)
            if profile.current_region_id != region1.id:
                profile.current_region = region1
                update_fields.append('current_region')
        except Region.DoesNotExist:
            pass

    profile.save(update_fields=update_fields)


@login_required
def player_state(request):
    """
    GET /api/player-state/
    Returns the player's current chances count (and whether a profile exists).
    Used on page load to initialise the JS HUD with persisted data.
    """
    try:
        profile = request.user.profile
        normalised = _filter_and_heal_game_state(profile.game_state or DEFAULT_GAME_STATE)
        if (
            profile.game_state_version < DEFAULT_GAME_STATE['version']
            or normalised != (profile.game_state or {})
        ):
            profile.game_state = normalised
            profile.game_state_version = DEFAULT_GAME_STATE['version']
            profile.save(update_fields=['game_state', 'game_state_version', 'updated_at'])
        return JsonResponse({
            'chances':        profile.chances,
            'has_profile':    True,
            'display_name':   profile.display_name,
            'cinematic_seen': bool(profile.cinematic_seen),
            'game_state':     _filter_and_heal_game_state(profile.game_state or DEFAULT_GAME_STATE),
        })
    except ObjectDoesNotExist:
        # No profile yet - player has not started the game
        return JsonResponse({'chances': 3, 'has_profile': False})


@login_required
@require_http_methods(['POST'])
def sync_chances(request):
    """
    POST /api/chances/sync/   body: { "chances": N }
    Persists the JS-authoritative chances count to PlayerProfile.
    Fire-and-forget from the browser (no await); failures are non-fatal.
    """
    try:
        data  = json.loads(request.body)
        count = int(data.get('chances', 3))
        count = max(0, min(count, 99))   # sanity clamp
        try:
            profile = request.user.profile
            profile.chances = count
            profile.save(update_fields=['chances', 'updated_at'])
            return JsonResponse({'ok': True, 'chances': profile.chances})
        except ObjectDoesNotExist:
            # No profile yet - silently accept; profile created in Layer 10
            return JsonResponse({'ok': True, 'chances': count})
    except (json.JSONDecodeError, ValueError, TypeError) as exc:
        return JsonResponse({'ok': False, 'error': str(exc)}, status=400)


@login_required
@require_http_methods(['POST'])
def sync_game_state(request):
    """
    POST /api/game-state/sync/   body: { ...game state... }
    Persists frontend progression state (gate solves, shrine completions, boss flags).
    """
    try:
        profile = request.user.profile
    except ObjectDoesNotExist:
        return JsonResponse({'ok': False, 'error': 'No profile'}, status=400)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError as exc:
        return JsonResponse({'ok': False, 'error': str(exc)}, status=400)

    state = _normalise_game_state(data)
    if 'challenge_attempts' not in data:
        existing = _normalise_game_state(profile.game_state or DEFAULT_GAME_STATE)
        state['challenge_attempts'] = existing.get('challenge_attempts', {})
    existing = _normalise_game_state(profile.game_state or DEFAULT_GAME_STATE)
    if 'collected_pickups' not in data:
        state['collected_pickups'] = existing.get('collected_pickups', [])
    if 'code_shards' not in data:
        state['code_shards'] = existing.get('code_shards', 0)
    if 'shop_purchases' not in data:
        state['shop_purchases'] = existing.get('shop_purchases', {})
    if 'side_challenges_completed' not in data:
        state['side_challenges_completed'] = existing.get('side_challenges_completed', [])
    _save_profile_state(profile, state, set_region_if_restored=True)
    return JsonResponse({'ok': True, 'game_state': state})


@login_required
@require_http_methods(['POST'])
def mark_cinematic_seen(request):
    """POST /api/cinematic/seen/ marks account-level cinematic flag as seen."""
    try:
        profile = request.user.profile
    except ObjectDoesNotExist:
        return JsonResponse({'ok': False, 'error': 'No profile'}, status=400)

    if not profile.cinematic_seen:
        profile.cinematic_seen = True
        profile.save(update_fields=['cinematic_seen', 'updated_at'])
    return JsonResponse({'ok': True, 'cinematic_seen': True})


@login_required
@require_http_methods(['POST'])
def record_challenge_attempt(request):
    """
    POST /api/challenges/attempt/
    body: { challenge_id: str, correct: bool, category?: str }

    Server-authoritative attempt/chances bookkeeping:
      - first wrong attempt on a challenge is free
      - second+ wrong attempts deduct 1 chance
      - boss_bug success restores chances to full (3)
    """
    try:
        profile = request.user.profile
    except ObjectDoesNotExist:
        return JsonResponse({'ok': False, 'error': 'No profile'}, status=400)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError as exc:
        return JsonResponse({'ok': False, 'error': str(exc)}, status=400)

    challenge_id = str(data.get('challenge_id', '')).strip()
    if not challenge_id:
        return JsonResponse({'ok': False, 'error': 'challenge_id required'}, status=400)
    if challenge_id not in VALID_CHALLENGE_IDS:
        return JsonResponse({'ok': False, 'error': 'invalid challenge_id'}, status=400)

    correct = bool(data.get('correct', False))
    category = str(data.get('category', '')).strip()

    state = _normalise_game_state(profile.game_state or DEFAULT_GAME_STATE)
    attempts = state.get('challenge_attempts', {})
    prev_attempts = attempts.get(challenge_id, 0)
    new_attempts = prev_attempts + 1
    attempts[challenge_id] = new_attempts

    chance_lost = False
    first_wrong_free = False

    if correct:
        solved = set(state.get('solved_challenges', []))
        solved.add(challenge_id)
        state['solved_challenges'] = sorted(solved)
        if category == 'boss_bug':
            profile.chances = 3
    else:
        if prev_attempts == 0:
            first_wrong_free = True
        else:
            if profile.chances > 0:
                profile.chances -= 1
                chance_lost = True

    state['challenge_attempts'] = attempts
    _save_profile_state(profile, state)
    profile.save(update_fields=['chances', 'updated_at'])

    return JsonResponse({
        'ok': True,
        'challenge_id': challenge_id,
        'correct': correct,
        'attempts': new_attempts,
        'first_wrong_free': first_wrong_free,
        'chance_lost': chance_lost,
        'chances': profile.chances,
        'out_of_chances': profile.chances <= 0,
    })


@login_required
@require_http_methods(['POST'])
def progress_shrine_complete(request):
    """POST /api/progress/shrine-complete/ body:{ shrine_id }"""
    try:
        profile = request.user.profile
    except ObjectDoesNotExist:
        return JsonResponse({'ok': False, 'error': 'No profile'}, status=400)
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError as exc:
        return JsonResponse({'ok': False, 'error': str(exc)}, status=400)

    shrine_id = str(data.get('shrine_id', '')).strip()
    if not shrine_id:
        return JsonResponse({'ok': False, 'error': 'shrine_id required'}, status=400)
    if shrine_id not in VALID_SHRINE_IDS:
        return JsonResponse({'ok': False, 'error': 'invalid shrine_id'}, status=400)

    state = _normalise_game_state(profile.game_state or DEFAULT_GAME_STATE)
    completed = set(state.get('completed_shrines', []))
    completed.add(shrine_id)
    state['completed_shrines'] = sorted(completed)
    _save_profile_state(profile, state)
    return JsonResponse({'ok': True, 'game_state': state})


@login_required
@require_http_methods(['POST'])
def progress_challenge_solved(request):
    """POST /api/progress/challenge-solved/ body:{ challenge_id }"""
    try:
        profile = request.user.profile
    except ObjectDoesNotExist:
        return JsonResponse({'ok': False, 'error': 'No profile'}, status=400)
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError as exc:
        return JsonResponse({'ok': False, 'error': str(exc)}, status=400)

    challenge_id = str(data.get('challenge_id', '')).strip()
    if not challenge_id:
        return JsonResponse({'ok': False, 'error': 'challenge_id required'}, status=400)
    if challenge_id not in VALID_CHALLENGE_IDS:
        return JsonResponse({'ok': False, 'error': 'invalid challenge_id'}, status=400)

    state = _normalise_game_state(profile.game_state or DEFAULT_GAME_STATE)
    solved = set(state.get('solved_challenges', []))
    solved.add(challenge_id)
    state['solved_challenges'] = sorted(solved)
    _save_profile_state(profile, state)
    return JsonResponse({'ok': True, 'game_state': state})


@login_required
@require_http_methods(['POST'])
def progress_gate_open(request):
    """POST /api/progress/gate-open/ body:{ gate_key }"""
    try:
        profile = request.user.profile
    except ObjectDoesNotExist:
        return JsonResponse({'ok': False, 'error': 'No profile'}, status=400)
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError as exc:
        return JsonResponse({'ok': False, 'error': str(exc)}, status=400)

    gate_key = str(data.get('gate_key', '')).strip()
    if not gate_key:
        return JsonResponse({'ok': False, 'error': 'gate_key required'}, status=400)
    if gate_key not in VALID_GATE_KEYS:
        return JsonResponse({'ok': False, 'error': 'invalid gate_key'}, status=400)

    state = _normalise_game_state(profile.game_state or DEFAULT_GAME_STATE)
    gates = set(state.get('open_gates', []))
    gates.add(gate_key)
    state['open_gates'] = sorted(gates)
    _save_profile_state(profile, state)
    return JsonResponse({'ok': True, 'game_state': state})


@login_required
@require_http_methods(['POST'])
def progress_region_restored(request):
    """POST /api/progress/region-restored/ body:{ restored: true }"""
    try:
        profile = request.user.profile
    except ObjectDoesNotExist:
        return JsonResponse({'ok': False, 'error': 'No profile'}, status=400)

    state = _normalise_game_state(profile.game_state or DEFAULT_GAME_STATE)
    state['region_restored'] = True
    _save_profile_state(profile, state, set_region_if_restored=True)
    return JsonResponse({'ok': True, 'game_state': state})


@login_required
@require_http_methods(['POST'])
def progress_pickup_collected(request):
    """POST /api/progress/pickup-collected/ body:{ pickup_id }"""
    try:
        profile = request.user.profile
    except ObjectDoesNotExist:
        return JsonResponse({'ok': False, 'error': 'No profile'}, status=400)
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError as exc:
        return JsonResponse({'ok': False, 'error': str(exc)}, status=400)

    pickup_id = str(data.get('pickup_id', '')).strip()
    if not pickup_id:
        return JsonResponse({'ok': False, 'error': 'pickup_id required'}, status=400)
    if pickup_id not in VALID_PICKUP_IDS:
        return JsonResponse({'ok': False, 'error': 'invalid pickup_id'}, status=400)

    state = _normalise_game_state(profile.game_state or DEFAULT_GAME_STATE)
    pickups = set(state.get('collected_pickups', []))
    pickups.add(pickup_id)
    state['collected_pickups'] = sorted(pickups)
    _save_profile_state(profile, state)
    return JsonResponse({'ok': True, 'game_state': state})


# ---------------------------------------------------------------------------
# Character creation (Layer 10)
# ---------------------------------------------------------------------------

@login_required
def character_create(request):
    """
    GET  /character/  - show the character creation form.
    POST /character/  - create PlayerProfile + unlock Region 1 → redirect to game.

    If the player already has a profile, redirect straight to the game.
    """
    # Already has a profile - skip creation
    try:
        _ = request.user.profile
        return redirect('game:play')
    except ObjectDoesNotExist:
        pass

    errors = {}

    if request.method == 'POST':
        display_name = request.POST.get('display_name', '').strip()
        gender       = request.POST.get('gender', '').strip()

        if not display_name:
            errors['display_name'] = 'Choose a display name.'
        elif len(display_name) > 50:
            errors['display_name'] = 'Display name must be 50 characters or fewer.'

        if gender not in ('male', 'female'):
            errors['gender'] = 'Select a character.'

        if not errors:
            from accounts.models import PlayerProfile
            from game.models import PlayerRegionProgress, Region

            profile = PlayerProfile.objects.create(
                user=request.user,
                display_name=display_name,
                gender=gender,
            )

            # Unlock Region 1 (if the management command has been run)
            try:
                region1 = Region.objects.get(order=1)
                PlayerRegionProgress.objects.get_or_create(
                    player=profile,
                    region=region1,
                    defaults={
                        'is_unlocked': True,
                        'unlocked_at': timezone.now(),
                    },
                )
            except Region.DoesNotExist:
                pass   # Management command not yet run - non-fatal

            return redirect('game:play')

    return render(request, 'game/character_creation.html', {'errors': errors})


# ---------------------------------------------------------------------------
# Game page (Layer 10 - redirects to character creation if no profile)
# ---------------------------------------------------------------------------

class GameView(LoginRequiredMixin, TemplateView):
    """
    Serves the main game page.

    Requires login. If the player has no PlayerProfile yet (first visit),
    redirects to character creation before the game renders.
    """
    template_name = 'game/game.html'

    def get(self, request, *args, **kwargs):
        try:
            _ = request.user.profile
        except ObjectDoesNotExist:
            return redirect('game:character_create')
        return super().get(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        try:
            ctx['profile'] = self.request.user.profile
            ctx['has_profile'] = True
        except ObjectDoesNotExist:
            ctx['profile'] = None
            ctx['has_profile'] = False
        return ctx
