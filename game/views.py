import json

from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse
from django.shortcuts import redirect, render
from django.utils import timezone
from django.views.decorators.http import require_http_methods
from django.views.generic import TemplateView


# ---------------------------------------------------------------------------
# API: player state (Layer 9 - Chances persistence)
# ---------------------------------------------------------------------------

@login_required
def player_state(request):
    """
    GET /api/player-state/
    Returns the player's current chances count (and whether a profile exists).
    Used on page load to initialise the JS HUD with persisted data.
    """
    try:
        profile = request.user.profile
        return JsonResponse({
            'chances':      profile.chances,
            'has_profile':  True,
            'display_name': profile.display_name,
        })
    except Exception:
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
        except Exception:
            # No profile yet - silently accept; profile created in Layer 10
            return JsonResponse({'ok': True, 'chances': count})
    except (json.JSONDecodeError, ValueError, TypeError) as exc:
        return JsonResponse({'ok': False, 'error': str(exc)}, status=400)


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
    except Exception:
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
        except Exception:
            return redirect('game:character_create')
        return super().get(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        try:
            ctx['profile'] = self.request.user.profile
            ctx['has_profile'] = True
        except Exception:
            ctx['profile'] = None
            ctx['has_profile'] = False
        return ctx
