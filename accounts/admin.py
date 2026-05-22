from django.contrib import admin
from .models import PlayerProfile, Subscription, WaitlistEntry


@admin.register(PlayerProfile)
class PlayerProfileAdmin(admin.ModelAdmin):
    list_display = ('display_name', 'user', 'gender', 'chances', 'current_region', 'cinematic_seen', 'created_at')
    list_filter = ('gender', 'cinematic_seen', 'current_region')
    search_fields = ('display_name', 'user__username', 'user__email')
    readonly_fields = ('created_at', 'updated_at')
    raw_id_fields = ('user',)


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display  = ('player', 'plan', 'is_active', 'started_at', 'expires_at')
    list_filter   = ('plan', 'is_active')
    search_fields = ('player__display_name', 'player__user__username',
                     'stripe_customer_id', 'stripe_subscription_id')
    readonly_fields = ('created_at', 'updated_at')
    raw_id_fields   = ('player',)
    actions = ['activate', 'deactivate']

    @admin.action(description='Activate selected subscriptions')
    def activate(self, request, queryset):
        queryset.update(is_active=True)

    @admin.action(description='Deactivate selected subscriptions')
    def deactivate(self, request, queryset):
        queryset.update(is_active=False)


@admin.register(WaitlistEntry)
class WaitlistEntryAdmin(admin.ModelAdmin):
    list_display  = ('email', 'user', 'created_at')
    search_fields = ('email', 'user__username')
    readonly_fields = ('created_at',)
    raw_id_fields   = ('user',)
