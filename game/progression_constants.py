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
    # Gate 1 tabs (Variables)
    'ch1_t1', 'ch1_t2', 'ch1_t3',
    # Gate 2 tabs (Strings)
    'ch2_t1', 'ch2_t2', 'ch2_t3',
    # Gate 3 tabs (Integers/Floats)
    'ch3_t1', 'ch3_t2', 'ch3_t3',
    # Gate 4 tabs (Booleans)
    'ch4_t1', 'ch4_t2', 'ch4_t3',
    # Gate 5 tabs (Type Conversion)
    'ch5_t1', 'ch5_t2', 'ch5_t3',
    # Gate 6 tabs (f-strings)
    'ch6_gate_t1', 'ch6_gate_t2', 'ch6_gate_t3',
    # Roaming bug variants
    'ch6', 'ch6_v1', 'ch6_v2', 'ch6_v3',
    # Boss Bug
    'ch7',
    # Boss Chamber
    'ch8',
    # Side challenges
    'ch9', 'ch10', 'ch11',
}

VALID_GATE_KEYS = {
    '42,26', '64,27', '88,24', '106,27', '128,24', '148,27',
}

VALID_PICKUP_IDS = {
    'tablet', 'heart_01', 'heart_02', 'heart_03', 'heart_04', 'heart_05', 'heart_06',
}
