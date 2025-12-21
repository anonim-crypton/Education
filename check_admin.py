#!/usr/bin/env python
"""Admin users ni tekshirish"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'edu_game.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

print("=" * 60)
print("ADMIN USERS")
print("=" * 60)

admins = User.objects.filter(is_superuser=True)
if admins.exists():
    for admin in admins:
        print(f"Username: {admin.username}")
        print(f"Email: {admin.email}")
        print(f"First Name: {admin.first_name}")
        print(f"Last Name: {admin.last_name}")
        print(f"Is Staff: {admin.is_staff}")
        print(f"Is Superuser: {admin.is_superuser}")
        print("-" * 60)
else:
    print("Hech qanday admin topilmadi!")

print("\n" + "=" * 60)
print("ALL USERS")
print("=" * 60)

all_users = User.objects.all()
print(f"Total Users: {all_users.count()}\n")

for user in all_users[:20]:
    print(f"{user.username} - Staff: {user.is_staff}, Superuser: {user.is_superuser}")

if all_users.count() > 20:
    print(f"... va {all_users.count() - 20} ta ko'p")
