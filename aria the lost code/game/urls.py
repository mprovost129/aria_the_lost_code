from django.urls import path

from . import views

app_name = 'game'

urlpatterns = [
    path('play/', views.GameView.as_view(), name='play'),

    # Layer 10 — Character creation (first-time setup before entering the game)
    path('character/', views.character_create, name='character_create'),

    # Layer 9 — Chances persistence API
    path('api/player-state/',  views.player_state, name='player_state'),
    path('api/chances/sync/',  views.sync_chances,  name='sync_chances'),
]
