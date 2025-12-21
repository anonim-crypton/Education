# Generated migration for Notification model

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0008_teacherapplication_assigned_courses_lesson'),
    ]

    operations = [
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(help_text='Notification title', max_length=255)),
                ('message', models.TextField(help_text='Notification message')),
                ('type', models.CharField(choices=[('approval', 'Tasdiqlash'), ('rejection', 'Rad etish'), ('course_created', 'Kurs yaratildi'), ('system', 'Tizim')], default='system', max_length=20)),
                ('is_read', models.BooleanField(default=False, help_text='Whether user has read the notification')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notifications', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Notification',
                'verbose_name_plural': 'Notifications',
                'db_table': 'users_notification',
                'ordering': ['-created_at'],
            },
        ),
    ]
