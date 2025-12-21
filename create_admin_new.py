#!/usr/bin/env python
"""
Admin user yaratish scripti
Username: Ozodbek-0091
Password: ozodbek-0099
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'edu_game.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Eski adminlarni oʻchirish
print("🔄 Mavjud adminlarni tekshirilmoqda...")
old_admins = User.objects.filter(is_superuser=True)
if old_admins.exists():
    count = old_admins.count()
    old_admins.delete()
    print(f"✓ {count} ta eski admin o'chirildi")
else:
    print("✓ Eski admin topilmadi")

# Yangi admin yaratish
print("\n➕ Yangi admin yaratilmoqda...")
admin = User.objects.create_superuser(
    username='Ozodbek-0091',
    email='admin@edugame.uz',
    password='ozodbek-0099',
    first_name='Admin',
    last_name='Ozodbek'
)

print("\n✅ Admin muvaffaqiyatli yaratildi!")
print("=" * 50)
print(f"Username: Ozodbek-0091")
print(f"Password: ozodbek-0099")
print(f"Email: admin@edugame.uz")
print("=" * 50)
print("\nAdmin panel'ga kiring: http://localhost:3000/admin-dashboard")
