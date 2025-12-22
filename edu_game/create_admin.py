import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'edu_game.settings')
django.setup()

from django.contrib.auth.models import User

# Eski admin-ni o'chir
User.objects.filter(username='admin').delete()

# Yangi admin yaratish
admin = User.objects.create_superuser(
    username='admin',
    email='admin@test.com',
    password='admin123'
)

print(f"✓ Admin created successfully!")
print(f"  Username: {admin.username}")
print(f"  Email: {admin.email}")
print(f"  Is Staff: {admin.is_staff}")
print(f"  Is Superuser: {admin.is_superuser}")
