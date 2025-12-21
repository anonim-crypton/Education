#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'edu_game.settings')
django.setup()

from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token

User = get_user_model()

# Admin user ni tekshir
admin = User.objects.get(username='admin')
print(f"Admin user: {admin}")
print(f"  is_staff: {admin.is_staff}")
print(f"  is_superuser: {admin.is_superuser}")

# Token tekshir
token, created = Token.objects.get_or_create(user=admin)
print(f"\nToken: {token.key}")
print(f"Created: {created}")

# Barcha tokenlar
print(f"\nBarcha tokenlar:")
for t in Token.objects.all():
    print(f"  {t.user.username}: {t.key[:10]}...")
