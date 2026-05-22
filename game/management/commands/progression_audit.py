"""
Management command: progression_audit

Audits backend progression constants against the live Region 1 frontend data:
  - static/js/game/data/region1_challenges.js
  - static/js/game/data/region1_shrines.js

Usage:
    python manage.py progression_audit
    python manage.py progression_audit --strict

--strict exits with non-zero status when any mismatch is found.
"""

import re
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError

from game.progression_constants import (
    VALID_CHALLENGE_IDS,
    VALID_GATE_KEYS,
    VALID_SHRINE_IDS,
)


class Command(BaseCommand):
    help = 'Audit backend progression constants against Region 1 frontend data files.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--strict',
            action='store_true',
            help='Exit with non-zero status if any mismatch is found.',
        )

    def handle(self, *args, **options):
        strict = options.get('strict', False)
        base = Path(settings.BASE_DIR)
        ch_file = base / 'static' / 'js' / 'game' / 'data' / 'region1_challenges.js'
        sh_file = base / 'static' / 'js' / 'game' / 'data' / 'region1_shrines.js'

        if not ch_file.exists() or not sh_file.exists():
            raise CommandError('Region 1 frontend data files not found.')

        challenge_src = ch_file.read_text(encoding='utf-8')
        shrine_src = sh_file.read_text(encoding='utf-8')

        js_challenges = set(re.findall(r'^\s*(ch[0-9]+(?:_v[0-9]+)?)\s*:\s*\{', challenge_src, flags=re.MULTILINE))

        gate_block_start = challenge_src.find('window.ARIA_GAME.GATE_CHALLENGES')
        if gate_block_start == -1:
            raise CommandError('GATE_CHALLENGES block not found in region1_challenges.js')
        gate_block = challenge_src[gate_block_start:gate_block_start + 2500]
        js_gates = set(re.findall(r"'(\d+,\d+)'\s*:", gate_block))

        js_shrines = set(re.findall(r'^\s*(shrine[1-6])\s*:\s*\{', shrine_src, flags=re.MULTILINE))

        checks = [
            ('Challenge IDs', js_challenges, VALID_CHALLENGE_IDS),
            ('Gate Keys', js_gates, VALID_GATE_KEYS),
            ('Shrine IDs', js_shrines, VALID_SHRINE_IDS),
        ]

        mismatches = []
        self.stdout.write(self.style.HTTP_INFO('Progression Audit (Region 1)'))
        for label, actual, expected in checks:
            missing = sorted(expected - actual)
            extra = sorted(actual - expected)
            if not missing and not extra:
                self.stdout.write(self.style.SUCCESS(f'  [OK] {label}'))
                continue

            mismatches.append(label)
            self.stdout.write(self.style.ERROR(f'  [MISMATCH] {label}'))
            if missing:
                self.stdout.write(f'    Missing in JS: {", ".join(missing)}')
            if extra:
                self.stdout.write(f'    Extra in JS:   {", ".join(extra)}')

        if mismatches:
            msg = f'Audit failed: {", ".join(mismatches)}'
            if strict:
                raise CommandError(msg)
            self.stdout.write(self.style.WARNING(msg))
        else:
            self.stdout.write(self.style.SUCCESS('Audit passed: backend constants match frontend Region 1 data.'))

