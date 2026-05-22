# ARIA: The Lost Code - Change Log

## 2026-05-22 - Code Shards / Shop / Side Challenge Pack

### Added

- Added Code Shards as the first strategic currency.
- Added Code Shards HUD display in the gameplay bar.
- Added Shop Terminal v1 inside the in-game menu.
- Added purchasable Extra Chance item for 20 Code Shards.
- Added persistent economy state fields inside `PlayerProfile.game_state`:
  - `code_shards`
  - `shop_purchases`
  - `side_challenges_completed`
- Added first-clear Code Shard rewards by challenge category.
- Added two optional Region 1 side challenge data entries:
  - `ch10` Output Prediction
  - `ch11` Type Repair
- Added `ch10` and `ch11` to backend progression validation constants.

### Changed

- Game-state sync now preserves economy fields if a partial state payload is posted.
- Boss Bug / Boss Chamber rewards now pay Code Shards once per solved challenge.
- Challenge rewards are protected by `AG.rewardedChallenges` so refreshes or duplicate events do not repeatedly pay the same solved challenge.

### Design Locked

- Code Shards buy support, not answers.
- Side challenges test already-learned concepts and should not block main progress.
- Bugs evolve from corruption into intentional/adaptive defenses.
- ARIA remains helpful and narrative, not secretly evil.

### Known Limits / Next Work

- Side challenge data exists, but side challenge map interactables still need to be placed and routed.
- Shop Terminal currently lives in the in-game menu; a world tile terminal should be added next.
- Economy values are currently simple constants in `main.js`; they should eventually move into a central balancing config.
- Cosmetic/lore purchases are planned but not implemented in this pack.
