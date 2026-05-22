from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class PlayerProfile(models.Model):
    """
    One-to-one extension of Django's User model.

    Created during character creation (not at registration).
    The player enters their display name and picks a gender before
    the profile record is written — so a User can exist without a
    profile until they start the game for the first time.
    """

    GENDER_MALE = 'male'
    GENDER_FEMALE = 'female'
    GENDER_CHOICES = [
        (GENDER_MALE, 'Male'),
        (GENDER_FEMALE, 'Female'),
    ]

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile',
    )
    display_name = models.CharField(max_length=50)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)

    # Chances are the player's lives at Challenge Gates / Boss Chambers.
    # Start at 3, can increase through collectibles and boss completions.
    chances = models.PositiveSmallIntegerField(default=3)

    # The region the player is currently in. NULL = has not entered the world yet.
    current_region = models.ForeignKey(
        'game.Region',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+',
    )

    # Once the opening cinematic has played once, this is set so it can be skipped.
    cinematic_seen = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Player Profile'
        verbose_name_plural = 'Player Profiles'

    def __str__(self):
        return f'{self.display_name} ({self.user.username})'

    def restore_chances(self):
        """Restore chances to full (3). Called on boss challenge completion."""
        self.chances = 3
        self.save(update_fields=['chances', 'updated_at'])

    def lose_chance(self):
        """Deduct one chance. Returns True if the player still has chances left."""
        if self.chances > 0:
            self.chances -= 1
            self.save(update_fields=['chances', 'updated_at'])
        return self.chances > 0

    @property
    def has_full_access(self):
        """
        True if the player has a paid subscription (or is staff).
        Region 1 is always free. Regions 2-7 require full access.
        """
        if self.user.is_staff:
            return True
        try:
            return self.subscription.is_active
        except Subscription.DoesNotExist:
            return False


class Subscription(models.Model):
    """
    Tracks paid access for a player.
    Created by Stripe webhook on successful payment (Phase 2).
    For now, staff can manually create/activate subscriptions.
    """

    PLAN_MONTHLY = 'monthly'
    PLAN_ANNUAL  = 'annual'
    PLAN_CHOICES = [
        (PLAN_MONTHLY, 'Monthly'),
        (PLAN_ANNUAL,  'Annual'),
    ]

    player     = models.OneToOneField(
        PlayerProfile,
        on_delete=models.CASCADE,
        related_name='subscription',
    )
    plan       = models.CharField(max_length=20, choices=PLAN_CHOICES, default=PLAN_MONTHLY)
    is_active  = models.BooleanField(default=False)
    started_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    # Stripe identifiers (populated in Phase 2 when Stripe is integrated)
    stripe_customer_id      = models.CharField(max_length=100, blank=True)
    stripe_subscription_id  = models.CharField(max_length=100, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Subscription'
        verbose_name_plural = 'Subscriptions'

    def __str__(self):
        status = 'active' if self.is_active else 'inactive'
        return f'{self.player} — {self.get_plan_display()} ({status})'


class WaitlistEntry(models.Model):
    """
    Captures email addresses from players who hit the paywall.
    Shown when they try to advance past Region 1 without a subscription.
    Used to gauge demand and notify when paid plans launch.
    """

    email      = models.EmailField(unique=True)
    user       = models.ForeignKey(
        User,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='waitlist_entries',
        help_text='The logged-in user who submitted the form, if any.',
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Waitlist Entry'
        verbose_name_plural = 'Waitlist Entries'
        ordering = ['-created_at']

    def __str__(self):
        return self.email
