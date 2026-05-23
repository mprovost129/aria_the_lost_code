"""
Canonical backend progression identifiers for Region 1 runtime validation.

These values mirror the live frontend Region 1 data files:
  - static/js/game/data/region1_shrines.js
  - static/js/game/data/region1_challenges.js
"""

VALID_SHRINE_IDS = {
    'shrine1', 'shrine2', 'shrine3', 'shrine4', 'shrine5', 'shrine6',
}

VALID_CHALLENGE_IDS = {
    'ch1', 'ch2', 'ch3', 'ch4', 'ch5', 'ch6', 'ch6_v1', 'ch6_v2', 'ch6_v3', 'ch7', 'ch8', 'ch9', 'ch10', 'ch11',
}

VALID_GATE_KEYS = {
    '16,19', '32,19', '50,19', '70,19', '86,19', '108,19',
}

VALID_PICKUP_IDS = {
    'tablet', 'heart_01', 'heart_02', 'heart_03', 'heart_04', 'heart_05', 'heart_06',
}
