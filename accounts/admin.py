from django.contrib import admin
from .models import PlayerProfile


@admin.register(PlayerProfile)
class PlayerProfileAdmin(admin.ModelAdmin):
    list_display = ('display_name', 'user', 'gender', 'chances', 'current_region', 'cinematic_seen', 'created_at')
    list_filter = ('gender', 'cinematic_seen', 'current_region')
    search_fields = ('display_name', 'user__username', 'user__email')
    readonly_fields = ('created_at', 'updated_at')
    raw_id_fields = ('user',)
