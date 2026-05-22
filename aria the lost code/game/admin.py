from django.contrib import admin
from .models import (
    Region,
    LearningShrine,
    ShrineTopic,
    Challenge,
    PlayerRegionProgress,
    PlayerChallengeProgress,
    MemoryFragment,
    PlayerMemoryFragment,
    PlayerTool,
)


# ---------------------------------------------------------------------------
# Inlines
# ---------------------------------------------------------------------------

class ShrineTopicInline(admin.TabularInline):
    model = ShrineTopic
    extra = 1
    fields = ('order', 'title', 'code_example')


class LearningShrinedInline(admin.TabularInline):
    model = LearningShrine
    extra = 0
    fields = ('order', 'name')
    show_change_link = True


class ChallengeInline(admin.TabularInline):
    model = Challenge
    extra = 0
    fields = ('order', 'title', 'challenge_type', 'category', 'difficulty', 'is_active')
    show_change_link = True


class MemoryFragmentInline(admin.TabularInline):
    model = MemoryFragment
    extra = 0
    fields = ('order', 'title', 'reward_description')
    show_change_link = True


# ---------------------------------------------------------------------------
# Region
# ---------------------------------------------------------------------------

@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ('order', 'name', 'concept', 'unlocked_by_default')
    list_display_links = ('name',)
    ordering = ('order',)
    prepopulated_fields = {'slug': ('name',)}
    inlines = [LearningShrinedInline, ChallengeInline, MemoryFragmentInline]
    fieldsets = (
        (None, {
            'fields': ('order', 'name', 'slug', 'concept', 'unlocked_by_default'),
        }),
        ('Presentation', {
            'fields': ('description', 'aria_tagline', 'visual_theme'),
        }),
    )


# ---------------------------------------------------------------------------
# Learning content
# ---------------------------------------------------------------------------

@admin.register(LearningShrine)
class LearningShrineAdmin(admin.ModelAdmin):
    list_display = ('name', 'region', 'order')
    list_filter = ('region',)
    ordering = ('region__order', 'order')
    inlines = [ShrineTopicInline]


@admin.register(ShrineTopic)
class ShrineTopicAdmin(admin.ModelAdmin):
    list_display = ('title', 'shrine', 'order')
    list_filter = ('shrine__region',)
    ordering = ('shrine__region__order', 'order')


# ---------------------------------------------------------------------------
# Challenges
# ---------------------------------------------------------------------------

@admin.register(Challenge)
class ChallengeAdmin(admin.ModelAdmin):
    list_display = ('title', 'region', 'challenge_type', 'category', 'difficulty', 'order', 'is_active', 'available_in_practice')
    list_filter = ('region', 'challenge_type', 'category', 'difficulty', 'is_active')
    search_fields = ('title', 'aria_intro', 'hint_text')
    ordering = ('region__order', 'order')
    fieldsets = (
        ('Identity', {
            'fields': ('region', 'title', 'challenge_type', 'category', 'difficulty', 'order'),
        }),
        ('Code', {
            'fields': ('prompt_code', 'solution_code', 'expected_output'),
        }),
        ('Hints & References', {
            'fields': ('hint_text', 'lesson_reference'),
        }),
        ('ARIA Dialogue', {
            'fields': ('aria_intro', 'aria_hint', 'aria_success', 'aria_fail'),
        }),
        ('Visibility', {
            'fields': ('is_active', 'available_in_practice'),
        }),
    )


# ---------------------------------------------------------------------------
# Player progress (read-only views for debugging)
# ---------------------------------------------------------------------------

@admin.register(PlayerRegionProgress)
class PlayerRegionProgressAdmin(admin.ModelAdmin):
    list_display = ('player', 'region', 'is_unlocked', 'is_completed', 'unlocked_at', 'completed_at')
    list_filter = ('region', 'is_unlocked', 'is_completed')
    search_fields = ('player__display_name', 'player__user__username')
    readonly_fields = ('unlocked_at', 'completed_at')


@admin.register(PlayerChallengeProgress)
class PlayerChallengeProgressAdmin(admin.ModelAdmin):
    list_display = ('player', 'challenge', 'attempts', 'solved', 'solved_at')
    list_filter = ('solved', 'challenge__region')
    search_fields = ('player__display_name', 'challenge__title')
    readonly_fields = ('solved_at',)


# ---------------------------------------------------------------------------
# Collectibles & Tools
# ---------------------------------------------------------------------------

@admin.register(MemoryFragment)
class MemoryFragmentAdmin(admin.ModelAdmin):
    list_display = ('title', 'region', 'order', 'reward_description')
    list_filter = ('region',)
    ordering = ('region__order', 'order')


@admin.register(PlayerMemoryFragment)
class PlayerMemoryFragmentAdmin(admin.ModelAdmin):
    list_display = ('player', 'fragment', 'collected_at')
    list_filter = ('fragment__region',)
    search_fields = ('player__display_name',)
    readonly_fields = ('collected_at',)


@admin.register(PlayerTool)
class PlayerToolAdmin(admin.ModelAdmin):
    list_display = ('player', 'tool_type', 'uses_remaining')
    list_filter = ('tool_type',)
    search_fields = ('player__display_name',)
