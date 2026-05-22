from django.urls import path

from . import views

app_name = 'game'

urlpatterns = [
    path('play/', views.GameView.as_view(), name='play'),

    # Layer 10 - Character creation (first-time setup before entering the game)
    path('character/', views.character_create, name='character_create'),

    # Layer 9 - Chances persistence API
    path('api/player-state/',  views.player_state, name='player_state'),
    path('api/chances/sync/',  views.sync_chances,  name='sync_chances'),
    path('api/game-state/sync/', views.sync_game_state, name='sync_game_state'),
    path('api/cinematic/seen/', views.mark_cinematic_seen, name='mark_cinematic_seen'),
    path('api/challenges/attempt/', views.record_challenge_attempt, name='record_challenge_attempt'),
    path('api/progress/shrine-complete/', views.progress_shrine_complete, name='progress_shrine_complete'),
    path('api/progress/challenge-solved/', views.progress_challenge_solved, name='progress_challenge_solved'),
    path('api/progress/gate-open/', views.progress_gate_open, name='progress_gate_open'),
    path('api/progress/region-restored/', views.progress_region_restored, name='progress_region_restored'),
]
