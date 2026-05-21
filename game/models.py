from django.db import models
from django.utils import timezone


# ---------------------------------------------------------------------------
# World structure
# ---------------------------------------------------------------------------

class Region(models.Model):
    """
    One of the 7 regions the player must restore.

    Regions are ordered 1–7. Only Region 1 (Origin Node) is unlocked by
    default. All others unlock when the previous region's Boss Challenge is
    completed.
    """

    name = models.CharField(max_length=100)          # "The Origin Node"
    slug = models.SlugField(unique=True)              # "origin-node"
    concept = models.CharField(max_length=100)        # "Variables and Data Types"
    order = models.PositiveSmallIntegerField()        # 1–7
    description = models.TextField(blank=True)
    aria_tagline = models.CharField(
        max_length=300,
        blank=True,
        help_text="ARIA's first line about this region. Shown on the map.",
    )
    visual_theme = models.CharField(
        max_length=50,
        blank=True,
        help_text="CSS theme identifier applied to this region's tiles/palette.",
    )

    # Region 1 starts unlocked. All others start locked.
    unlocked_by_default = models.BooleanField(default=False)

    class Meta:
        ordering = ['order']
        verbose_name = 'Region'
        verbose_name_plural = 'Regions'

    def __str__(self):
        return f'Region {self.order}: {self.name}'


# ---------------------------------------------------------------------------
# Learning content
# ---------------------------------------------------------------------------

class LearningShrine(models.Model):
    """
    An in-game building the player enters to study a concept.
    Each region has 1–2 shrines.
    """

    region = models.ForeignKey(Region, on_delete=models.CASCADE, related_name='shrines')
    name = models.CharField(max_length=100)
    order = models.PositiveSmallIntegerField(default=1)

    class Meta:
        ordering = ['region__order', 'order']
        verbose_name = 'Learning Shrine'
        verbose_name_plural = 'Learning Shrines'

    def __str__(self):
        return f'{self.region.name} — {self.name}'


class ShrineTopic(models.Model):
    """
    A single topic (lesson) inside a Learning Shrine.
    Content is stored as Markdown and rendered in the browser.
    Automatically added to the player's Tablet Code Library when the shrine is visited.
    """

    shrine = models.ForeignKey(LearningShrine, on_delete=models.CASCADE, related_name='topics')
    title = models.CharField(max_length=100)  # "Strings and string formatting"
    content = models.TextField(help_text='Lesson content in Markdown.')
    code_example = models.TextField(
        blank=True,
        help_text='A runnable code example shown alongside the lesson.',
    )
    order = models.PositiveSmallIntegerField(default=1)

    class Meta:
        ordering = ['order']
        verbose_name = 'Shrine Topic'
        verbose_name_plural = 'Shrine Topics'

    def __str__(self):
        return f'{self.shrine} — {self.title}'


# ---------------------------------------------------------------------------
# Challenges
# ---------------------------------------------------------------------------

class Challenge(models.Model):
    """
    A single coding challenge. Used by:
      - Challenge Gates (block roads in the game world)
      - Boss Chamber (hardest challenge per region)
      - Roaming Bug Battles (wandering enemies)
      - Boss Bugs (guard the Boss Chamber entrance)
      - Practice Area (same data, different presentation)

    Validation is handled client-side by Pyodide (Python in the browser via
    WebAssembly). The server stores the expected_output; the client runs the
    player's code and compares stdout.
    """

    # --- Challenge type (presentation format) ---
    TYPE_FILL_BLANK = 'fill_blank'
    TYPE_BUG_FIX = 'bug_fix'
    TYPE_OPEN_CODE = 'open_code'
    TYPE_BOSS = 'boss'
    TYPE_CHOICES = [
        (TYPE_FILL_BLANK, 'Fill in the Blank'),
        (TYPE_BUG_FIX, 'Bug Fix'),
        (TYPE_OPEN_CODE, 'Open Code'),
        (TYPE_BOSS, 'Boss Challenge'),
    ]

    # --- Challenge category (game context) ---
    CATEGORY_GATE = 'gate'
    CATEGORY_BOSS_CHAMBER = 'boss_chamber'
    CATEGORY_ROAMING_BUG = 'roaming_bug'
    CATEGORY_BOSS_BUG = 'boss_bug'
    CATEGORY_CHOICES = [
        (CATEGORY_GATE, 'Challenge Gate'),
        (CATEGORY_BOSS_CHAMBER, 'Boss Chamber'),
        (CATEGORY_ROAMING_BUG, 'Roaming Bug Battle'),
        (CATEGORY_BOSS_BUG, 'Boss Bug'),
    ]

    # --- Difficulty ---
    DIFFICULTY_BEGINNER = 'beginner'
    DIFFICULTY_INTERMEDIATE = 'intermediate'
    DIFFICULTY_ADVANCED = 'advanced'
    DIFFICULTY_CHOICES = [
        (DIFFICULTY_BEGINNER, 'Beginner'),
        (DIFFICULTY_INTERMEDIATE, 'Intermediate'),
        (DIFFICULTY_ADVANCED, 'Advanced'),
    ]

    # Core identity
    region = models.ForeignKey(Region, on_delete=models.CASCADE, related_name='challenges')
    title = models.CharField(max_length=200)
    challenge_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default=DIFFICULTY_BEGINNER)
    order = models.PositiveSmallIntegerField(
        default=1,
        help_text='Display/encounter order within the region.',
    )

    # Code
    prompt_code = models.TextField(
        help_text='The code template shown to the player. Use ___ for fill-in-the-blank gaps.',
    )
    solution_code = models.TextField(
        help_text='The complete correct solution. Shown only after two failed attempts.',
    )
    expected_output = models.TextField(
        help_text=(
            'The exact stdout produced when solution_code runs correctly. '
            'Pyodide compares the player\'s output to this string.'
        ),
    )

    # Hints and references
    hint_text = models.TextField(
        help_text='Text hint shown after the first wrong answer.',
    )
    lesson_reference = models.CharField(
        max_length=200,
        blank=True,
        help_text='e.g. "Code Library: Strings and Variable Assignment"',
    )

    # ARIA dialogue — four moments in every challenge
    aria_intro = models.TextField(
        help_text='What ARIA says when the player approaches this challenge.',
    )
    aria_hint = models.TextField(
        help_text='What ARIA says as a hint after the first wrong answer.',
    )
    aria_success = models.TextField(
        help_text='What ARIA says when the player submits a correct solution.',
    )
    aria_fail = models.TextField(
        help_text='What ARIA says when the player submits a wrong answer (second+ attempt).',
    )

    # Visibility flags
    is_active = models.BooleanField(default=True)
    available_in_practice = models.BooleanField(
        default=True,
        help_text='If True, this challenge appears in the standalone Practice Area.',
    )

    class Meta:
        ordering = ['region__order', 'order']
        verbose_name = 'Challenge'
        verbose_name_plural = 'Challenges'

    def __str__(self):
        return f'[{self.region.name}] {self.title}'

    @property
    def is_boss_bug(self):
        return self.category == self.CATEGORY_BOSS_BUG

    @property
    def is_roaming_bug(self):
        return self.category == self.CATEGORY_ROAMING_BUG


# ---------------------------------------------------------------------------
# Player progress
# ---------------------------------------------------------------------------

class PlayerRegionProgress(models.Model):
    """
    Tracks which regions are unlocked and completed for each player.
    Created automatically when Region 1 is unlocked at game start,
    and for subsequent regions when their predecessor's Boss Challenge is solved.
    """

    player = models.ForeignKey(
        'accounts.PlayerProfile',
        on_delete=models.CASCADE,
        related_name='region_progress',
    )
    region = models.ForeignKey(Region, on_delete=models.CASCADE, related_name='player_progress')
    is_unlocked = models.BooleanField(default=False)
    is_completed = models.BooleanField(default=False)
    unlocked_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = [('player', 'region')]
        verbose_name = 'Player Region Progress'
        verbose_name_plural = 'Player Region Progress'

    def __str__(self):
        if self.is_completed:
            status = 'completed'
        elif self.is_unlocked:
            status = 'unlocked'
        else:
            status = 'locked'
        return f'{self.player} — {self.region} ({status})'

    def unlock(self):
        """Unlock this region for the player."""
        self.is_unlocked = True
        self.unlocked_at = timezone.now()
        self.save(update_fields=['is_unlocked', 'unlocked_at'])

    def complete(self):
        """Mark this region as completed (Boss Challenge solved)."""
        self.is_completed = True
        self.completed_at = timezone.now()
        self.save(update_fields=['is_completed', 'completed_at'])


class PlayerChallengeProgress(models.Model):
    """
    Tracks attempt count and solve status for each player/challenge pair.
    One row is created on first attempt; attempts increments on each submission.
    The Chances penalty logic lives in the view and uses this record to know
    whether this is the player's first attempt (no Chance lost) or second+ (lose 1).
    """

    player = models.ForeignKey(
        'accounts.PlayerProfile',
        on_delete=models.CASCADE,
        related_name='challenge_progress',
    )
    challenge = models.ForeignKey(
        Challenge,
        on_delete=models.CASCADE,
        related_name='player_progress',
    )
    attempts = models.PositiveSmallIntegerField(default=0)
    solved = models.BooleanField(default=False)
    solved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = [('player', 'challenge')]
        verbose_name = 'Player Challenge Progress'
        verbose_name_plural = 'Player Challenge Progress'

    def __str__(self):
        status = 'solved' if self.solved else f'{self.attempts} attempt(s)'
        return f'{self.player} — {self.challenge.title} ({status})'

    def record_attempt(self, correct: bool):
        """
        Increment attempts and optionally mark as solved.
        Returns True if this was the first attempt (no Chance should be deducted).
        """
        is_first_attempt = self.attempts == 0
        self.attempts += 1
        if correct:
            self.solved = True
            self.solved_at = timezone.now()
        self.save(update_fields=['attempts', 'solved', 'solved_at'])
        return is_first_attempt


# ---------------------------------------------------------------------------
# Collectibles
# ---------------------------------------------------------------------------

class MemoryFragment(models.Model):
    """
    A hidden collectible scattered through each region.
    Finding one reveals a piece of ARIA's backstory and may unlock a Tool.
    """

    region = models.ForeignKey(Region, on_delete=models.CASCADE, related_name='memory_fragments')
    title = models.CharField(max_length=100)
    aria_memory_text = models.TextField(
        help_text="A piece of ARIA's backstory revealed when this fragment is collected.",
    )
    reward_description = models.CharField(
        max_length=200,
        blank=True,
        help_text='Describe any Tool or bonus unlocked by collecting this fragment.',
    )
    order = models.PositiveSmallIntegerField(default=1)

    class Meta:
        ordering = ['region__order', 'order']
        verbose_name = 'Memory Fragment'
        verbose_name_plural = 'Memory Fragments'

    def __str__(self):
        return f'{self.region.name} — {self.title}'


class PlayerMemoryFragment(models.Model):
    """Join table: which memory fragments has this player collected."""

    player = models.ForeignKey(
        'accounts.PlayerProfile',
        on_delete=models.CASCADE,
        related_name='collected_fragments',
    )
    fragment = models.ForeignKey(
        MemoryFragment,
        on_delete=models.CASCADE,
        related_name='collected_by',
    )
    collected_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = [('player', 'fragment')]
        verbose_name = 'Player Memory Fragment'
        verbose_name_plural = 'Player Memory Fragments'

    def __str__(self):
        return f'{self.player} collected "{self.fragment.title}"'


# ---------------------------------------------------------------------------
# Tools
# ---------------------------------------------------------------------------

class PlayerTool(models.Model):
    """
    A tool the player has earned. Each tool type is stored once per player;
    uses_remaining tracks how many charges are left.

    V1 only includes the ARIA Hint tool. The rest are post-V1.
    """

    TOOL_LINE_REVEAL = 'line_reveal'
    TOOL_SYNTAX_CHECK = 'syntax_check'
    TOOL_ARIA_HINT = 'aria_hint'
    TOOL_REGION_REVIEW = 'region_review'
    TOOL_CHOICES = [
        (TOOL_LINE_REVEAL, 'Line Reveal'),
        (TOOL_SYNTAX_CHECK, 'Syntax Check'),
        (TOOL_ARIA_HINT, 'ARIA Hint'),
        (TOOL_REGION_REVIEW, 'Region Review'),
    ]

    player = models.ForeignKey(
        'accounts.PlayerProfile',
        on_delete=models.CASCADE,
        related_name='tools',
    )
    tool_type = models.CharField(max_length=20, choices=TOOL_CHOICES)
    uses_remaining = models.PositiveSmallIntegerField(default=1)

    class Meta:
        unique_together = [('player', 'tool_type')]
        verbose_name = 'Player Tool'
        verbose_name_plural = 'Player Tools'

    def __str__(self):
        return f'{self.player} — {self.get_tool_type_display()} ×{self.uses_remaining}'

    def use(self):
        """Consume one charge. Returns True if a charge was available."""
        if self.uses_remaining > 0:
            self.uses_remaining -= 1
            self.save(update_fields=['uses_remaining'])
            return True
        return False
