import json

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from accounts.models import PlayerProfile
from game.models import Region


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
                'open_gates': ['7,5'],
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
                'open_gates': ['7,5', '12,5', '17,5', '18,11', '13,11', '8,11'],
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
            data=json.dumps({'gate_key': '7,5'}),
            content_type='application/json',
        )
        self.profile.refresh_from_db()
        state = self.profile.game_state
        self.assertIn('ch2', state.get('solved_challenges', []))
        self.assertIn('7,5', state.get('open_gates', []))

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
