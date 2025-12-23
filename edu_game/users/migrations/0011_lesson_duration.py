# Generated migration for adding duration field to Lesson model

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0010_customuser_subject'),
    ]

    operations = [
        migrations.AddField(
            model_name='lesson',
            name='duration',
            field=models.PositiveIntegerField(
                default=0,
                help_text='Video duration in seconds'
            ),
        ),
    ]
