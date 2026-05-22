"""
Management command: ensure_superuser

Creates a Django superuser from environment variables if one with that
username does not already exist.  Safe to run on every deploy - idempotent.

Required env vars (set in Render → Environment):
    DJANGO_SUPERUSER_USERNAME   default: admin
    DJANGO_SUPERUSER_EMAIL      default: (empty)
    DJANGO_SUPERUSER_PASSWORD   required - command is a no-op if missing

Usage (called automatically by render.yaml buildCommand):
    python manage.py ensure_superuser
"""

import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Create a superuser from env vars if one does not already exist."

    def handle(self, *args, **options):
        User     = get_user_model()
        username = os.environ.get("DJANGO_SUPERUSER_USERNAME", "admin")
        email    = os.environ.get("DJANGO_SUPERUSER_EMAIL", "")
        password = os.environ.get("DJANGO_SUPERUSER_PASSWORD", "")

        if not password:
            self.stdout.write(
                self.style.WARNING(
                    "DJANGO_SUPERUSER_PASSWORD not set - skipping superuser creation."
                )
            )
            return

        if User.objects.filter(username=username).exists():
            self.stdout.write(
                self.style.SUCCESS(
                    f'Superuser "{username}" already exists - nothing to do.'
                )
            )
            return

        User.objects.create_superuser(
            username=username,
            email=email,
            password=password,
        )
        self.stdout.write(
            self.style.SUCCESS(f'Superuser "{username}" created successfully.')
        )
