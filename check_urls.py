#!/usr/bin/env python
"""URL patterns tekshirish"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'edu_game.settings')
django.setup()

from django.urls import get_resolver

resolver = get_resolver()

print("\n" + "=" * 80)
print("DASHBOARD RELATED URLS")
print("=" * 80 + "\n")

for pattern in resolver.url_patterns:
    pattern_str = str(pattern.pattern)
    if 'dashboard' in pattern_str or 'admin' in pattern_str:
        print(f"Pattern: {pattern_str}")
        if hasattr(pattern, 'callback'):
            print(f"  View: {pattern.callback}")
        print()

print("\n" + "=" * 80)
print("API ENDPOINTS")
print("=" * 80 + "\n")

for pattern in resolver.url_patterns:
    pattern_str = str(pattern.pattern)
    if 'api' in pattern_str and 'dashboard' in pattern_str:
        print(f"Pattern: {pattern_str}")
        if hasattr(pattern, 'callback'):
            print(f"  View: {pattern.callback}")
        print()
