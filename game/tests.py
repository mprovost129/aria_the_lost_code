import json
import re
from pathlib import Path

from django.contrib.auth import get_user_model
from django.conf import settings
from django.test import TestCase
from django.urls import reverse

from accounts.models import PlayerProfile
from game.models import Region
from game.progression_constants import (
    VALID_CHALLENGE_IDS,
    VALID_GATE_KEYS,
    VALID_PICKUP_IDS,
    VALID_SHRINE_IDS,
)


User = get_user_model()


class ChallengeAttemptApiTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='tester', password='pw123456')
        self.profile = PlayerProfile.objects.create(
            user=self.user,
            display_name='Tester',
            gender='male',
            chances=3,
        )
        self.client.force_login(self.user)
        self.url = reverse('game:record_challenge_attempt')

    def _post_attempt(self, challenge_id='ch1', correct=False, category='gate'):
        return self.client.post(
            self.url,
            data=json.dumps({
                'challenge_id': challenge_id,
                'correct': correct,
                'category': category,
            }),
            content_type='application/json',
        )

    def test_first_wrong_attempt_is_free(self):
        res = self._post_attempt(challenge_id='ch1', correct=False)
        self.assertEqual(res.status_code, 200)
        payload = res.json()
        self.assertTrue(payload['ok'])
        self.assertTrue(payload['first_wrong_free'])
        self.assertFalse(payload['chance_lost'])
        self.assertEqual(payload['chances'], 3)

    def test_second_wrong_attempt_loses_one_chance(self):
        self._post_attempt(challenge_id='ch1', correct=False)
        res = self._post_attempt(challenge_id='ch1', correct=False)
        payload = res.json()
        self.assertFalse(payload['first_wrong_free'])
        self.assertTrue(payload['chance_lost'])
        self.assertEqual(payload['chances'], 2)

    def test_chances_never_go_below_zero(self):
        self.profile.chances = 1
        self.profile.save(update_fields=['chances'])
        self._post_attempt(challenge_id='ch1', correct=False)  # free
        self._post_attempt(challenge_id='ch1', correct=False)  # -> 0
        res = self._post_attempt(challenge_id='ch1', correct=False)  # stays 0
        payload = res.json()
        self.assertEqual(payload['chances'], 0)
        self.profile.refresh_from_db()
        self.assertEqual(self.profile.chances, 0)

    def test_boss_bug_success_restores_chances_to_three(self):
        self.profile.chances = 0
        self.profile.save(update_fields=['chances'])
        res = self._post_attempt(challenge_id='ch7', correct=True, category='boss_bug')
        payload = res.json()
        self.assertEqual(payload['chances'], 3)
        self.profile.refresh_from_db()
        self.assertEqual(self.profile.chances, 3)


class GameStateSyncTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='syncer', password='pw123456')
        self.profile = PlayerProfile.objects.create(
            user=self.user,
            display_name='Syncer',
            gender='female',
            chances=3,
            game_state={'challenge_attempts': {'ch1': 2}},
            game_state_version=0,
        )
        self.client.force_login(self.user)
        self.player_state_url = reverse('game:player_state')
        self.sync_url = reverse('game:sync_game_state')
        self.shrine_complete_url = reverse('game:progress_shrine_complete')
        self.challenge_solved_url = reverse('game:progress_challenge_solved')
        self.gate_open_url = reverse('game:progress_gate_open')
        self.region_restored_url = reverse('game:progress_region_restored')
        self.pickup_collected_url = reverse('game:progress_pickup_collected')
        self.region1 = Region.objects.create(
            name='The Origin Node',
            slug='origin-node-tests',
            concept='Variables and Data Types',
            order=1,
            unlocked_by_default=True,
        )

    def test_player_state_upgrades_legacy_game_state_version(self):
        self.assertEqual(self.profile.game_state_version, 0)
        res = self.client.get(self.player_state_url)
        self.assertEqual(res.status_code, 200)
        self.profile.refresh_from_db()
        self.assertEqual(self.profile.game_state_version, 1)
        self.assertIn('version', res.json()['game_state'])

    def test_sync_game_state_preserves_challenge_attempts_when_missing(self):
        res = self.client.post(
            self.sync_url,
            data=json.dumps({
                'solved_challenges': ['ch1'],
                'open_gates': ['42,26'],
                'completed_shrines': ['shrine1'],
                'boss_bug_defeated': False,
                'region_restored': False,
            }),
            content_type='application/json',
        )
        self.assertEqual(res.status_code, 200)
        self.profile.refresh_from_db()
        attempts = self.profile.game_state.get('challenge_attempts', {})
        self.assertEqual(attempts.get('ch1'), 2)

    def test_sync_game_state_sets_current_region_on_region_restored(self):
        self.assertIsNone(self.profile.current_region)
        res = self.client.post(
            self.sync_url,
            data=json.dumps({
                'solved_challenges': ['ch8'],
                'open_gates': ['42,26', '64,27', '88,24', '106,27', '128,24', '148,27'],
                'completed_shrines': ['shrine1', 'shrine2', 'shrine3', 'shrine4', 'shrine5', 'shrine6'],
                'boss_bug_defeated': True,
                'region_restored': True,
            }),
            content_type='application/json',
        )
        self.assertEqual(res.status_code, 200)
        self.profile.refresh_from_db()
        self.assertEqual(self.profile.current_region_id, self.region1.id)

    def test_progress_shrine_complete_adds_unique_shrine(self):
        res1 = self.client.post(
            self.shrine_complete_url,
            data=json.dumps({'shrine_id': 'shrine1'}),
            content_type='application/json',
        )
        res2 = self.client.post(
            self.shrine_complete_url,
            data=json.dumps({'shrine_id': 'shrine1'}),
            content_type='application/json',
        )
        self.assertEqual(res1.status_code, 200)
        self.assertEqual(res2.status_code, 200)
        self.profile.refresh_from_db()
        shrines = self.profile.game_state.get('completed_shrines', [])
        self.assertEqual(shrines, ['shrine1'])

    def test_progress_gate_open_and_challenge_solved(self):
        self.client.post(
            self.challenge_solved_url,
            data=json.dumps({'challenge_id': 'ch2'}),
            content_type='application/json',
        )
        self.client.post(
            self.gate_open_url,
            data=json.dumps({'gate_key': '42,26'}),
            content_type='application/json',
        )
        self.profile.refresh_from_db()
        state = self.profile.game_state
        self.assertIn('ch2', state.get('solved_challenges', []))
        self.assertIn('42,26', state.get('open_gates', []))

    def test_progress_region_restored_marks_region_and_current_region(self):
        res = self.client.post(
            self.region_restored_url,
            data=json.dumps({'restored': True}),
            content_type='application/json',
        )
        self.assertEqual(res.status_code, 200)
        self.profile.refresh_from_db()
        self.assertTrue(self.profile.game_state.get('region_restored'))
        self.assertEqual(self.profile.current_region_id, self.region1.id)

    def test_invalid_progress_ids_are_rejected(self):
        res1 = self.client.post(
            self.shrine_complete_url,
            data=json.dumps({'shrine_id': 'shrine999'}),
            content_type='application/json',
        )
        res2 = self.client.post(
            self.challenge_solved_url,
            data=json.dumps({'challenge_id': 'evil_ch'}),
            content_type='application/json',
        )
        res3 = self.client.post(
            self.gate_open_url,
            data=json.dumps({'gate_key': '999,999'}),
            content_type='application/json',
        )
        res4 = self.client.post(
            self.pickup_collected_url,
            data=json.dumps({'pickup_id': 'fake_heart'}),
            content_type='application/json',
        )
        self.assertEqual(res1.status_code, 400)
        self.assertEqual(res2.status_code, 400)
        self.assertEqual(res3.status_code, 400)
        self.assertEqual(res4.status_code, 400)

    def test_progress_pickup_collected_adds_unique_pickup(self):
        first = sorted(VALID_PICKUP_IDS)[0]
        self.client.post(
            self.pickup_collected_url,
            data=json.dumps({'pickup_id': first}),
            content_type='application/json',
        )
        self.client.post(
            self.pickup_collected_url,
            data=json.dumps({'pickup_id': first}),
            content_type='application/json',
        )
        self.profile.refresh_from_db()
        pickups = self.profile.game_state.get('collected_pickups', [])
        self.assertEqual(pickups, [first])

    def test_player_state_heals_invalid_saved_entries(self):
        self.profile.game_state = {
            'version': 1,
            'solved_challenges': ['ch1', 'fake_ch'],
            'open_gates': ['42,26', '1,1'],
            'completed_shrines': ['shrine1', 'shrineX'],
            'boss_bug_defeated': False,
            'region_restored': False,
            'challenge_attempts': {'ch1': 2, 'bad_ch': 9},
            'collected_pickups': [sorted(VALID_PICKUP_IDS)[0], 'heart_fake'],
        }
        self.profile.save(update_fields=['game_state'])

        res = self.client.get(self.player_state_url)
        self.assertEqual(res.status_code, 200)
        gs = res.json()['game_state']
        self.assertEqual(gs['solved_challenges'], ['ch1'])
        self.assertEqual(gs['open_gates'], ['42,26'])
        self.assertEqual(gs['completed_shrines'], ['shrine1'])
        self.assertEqual(gs['challenge_attempts'], {'ch1': 2})
        self.assertEqual(gs['collected_pickups'], [sorted(VALID_PICKUP_IDS)[0]])


class ProgressionConstantParityTests(TestCase):
    """
    Guardrail: backend progression constants must stay in sync with
    Region 1 frontend runtime data files.
    """

    def _read_repo_file(self, relative_path):
        base = Path(settings.BASE_DIR)
        return (base / relative_path).read_text(encoding='utf-8')

    def test_challenge_ids_match_frontend_region1_data(self):
        src = self._read_repo_file('static/js/game/data/region1_challenges.js')
        js_ids = set(re.findall(r'^\s*(ch[0-9]+(?:_v[0-9]+)?)\s*:\s*\{', src, flags=re.MULTILINE))
        self.assertEqual(js_ids, VALID_CHALLENGE_IDS)

    def test_gate_keys_match_frontend_region1_data(self):
        src = self._read_repo_file('static/js/game/data/region1_challenges.js')
        # Narrow to GATE_CHALLENGES object to avoid unrelated coordinate-like strings.
        start = src.find('window.ARIA_GAME.GATE_CHALLENGES')
        self.assertNotEqual(start, -1, 'GATE_CHALLENGES block not found in region1_challenges.js')
        block = src[start:start + 2000]
        js_gates = set(re.findall(r"'(\d+,\d+)'\s*:", block))
        self.assertEqual(js_gates, VALID_GATE_KEYS)

    def test_shrine_ids_match_frontend_region1_data(self):
        src = self._read_repo_file('static/js/game/data/region1_shrines.js')
        js_shrines = set(re.findall(r'^\s*(shrine[1-6])\s*:\s*\{', src, flags=re.MULTILINE))
        self.assertEqual(js_shrines, VALID_SHRINE_IDS)

    def test_pickup_ids_match_frontend_map_data(self):
        src = self._read_repo_file('static/js/game/maps/origin_node.js')
        js_pickups = set(re.findall(r"id:\s*'([^']+)'", src))
        self.assertEqual(js_pickups, VALID_PICKUP_IDS)
