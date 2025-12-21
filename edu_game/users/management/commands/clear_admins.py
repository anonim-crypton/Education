from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()


class Command(BaseCommand):
    help = 'Barcha eski admin hisoblari o\'chirib tashla'

    def handle(self, *args, **options):
        # Barcha superuser'larni topish
        admins = User.objects.filter(is_superuser=True, is_staff=True)
        count = admins.count()

        if count == 0:
            self.stdout.write(self.style.WARNING('Hech qanday admin topilmadi'))
            return

        # Tasdiqlash so'rash
        confirmation = input(f'{count} ta admin hisobini o\'chirib tashlamiz. Rostmi? (yes/no): ')
        
        if confirmation.lower() == 'yes':
            for admin in admins:
                self.stdout.write(f'O\'chirilmoqda: {admin.username} ({admin.email})')
                admin.delete()
            
            self.stdout.write(self.style.SUCCESS(f'{count} ta admin muvaffaqiyatli o\'chirildi'))
        else:
            self.stdout.write(self.style.WARNING('Bekor qilindi'))
