"""
Management command to completely delete a teacher and all their data from the system
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from users.models import Course, Lesson
from teachers.models import Teacher
import os

User = get_user_model()


class Command(BaseCommand):
    help = "O'qituvchini va uning barcha ma'lumotlarini (videolar, kurslar) butunlay o'chirish"

    def add_arguments(self, parser):
        parser.add_argument(
            'username',
            type=str,
            help="O'qituvchi username'i"
        )
        parser.add_argument(
            '--force',
            action='store_true',
            help="Confirmation sorashmasdan o'chirish"
        )

    def handle(self, *args, **options):
        username = options['username']
        force = options.get('force', False)

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            self.stdout.write(
                self.style.ERROR(f"❌ Foydalanuvchi '{username}' topilmadi")
            )
            return

        # O'qituvchi profilini topish
        try:
            teacher = Teacher.objects.get(user=user)
        except Teacher.DoesNotExist:
            self.stdout.write(
                self.style.WARNING(f"⚠️  Bu foydalanuvchi o'qituvchi emas")
            )
            return

        # Ma'lumotlarni hisoblash
        courses = Course.objects.filter(teacher_user=user)
        total_lessons = Lesson.objects.filter(course__teacher_user=user).count()
        
        self.stdout.write(
            self.style.WARNING(
                f"\n⚠️  OGOHLANTIRISH: Bu operatsiya qaytarilib bo'lmaydi!\n"
                f"O'chiriladi:\n"
                f"  - O'qituvchi: {user.get_full_name() or username}\n"
                f"  - Kurslar: {courses.count()}\n"
                f"  - Videolar: {total_lessons}\n"
            )
        )

        if not force:
            confirm = input("\nBu amalni bajarishga rozisizmi? (HA/YO'Q): ").strip().lower()
            if confirm not in ['ha', 'yes', 'y', 'h']:
                self.stdout.write(self.style.WARNING("❌ Operatsiya bekor qilindi"))
                return

        # O'chirish boshlash
        deleted_lessons = 0
        deleted_courses = 0

        for course in courses:
            # Videolarni o'chirish
            lessons = course.videos.all()
            for lesson in lessons:
                if lesson.video_file and os.path.exists(lesson.video_file.path):
                    try:
                        os.remove(lesson.video_file.path)
                        self.stdout.write(f"  ✓ Video o'chirildi: {lesson.title}")
                    except Exception as e:
                        self.stdout.write(
                            self.style.WARNING(f"  ⚠️  Video o'chirishda xato: {lesson.title} - {e}")
                        )
                deleted_lessons += 1

            # Kurs rasmi o'chirish
            if course.teacher_image and os.path.exists(course.teacher_image.path):
                try:
                    os.remove(course.teacher_image.path)
                except Exception as e:
                    self.stdout.write(
                        self.style.WARNING(f"  ⚠️  Rasm o'chirishda xato: {e}")
                    )

            course.delete()
            deleted_courses += 1

        # Avatar o'chirish
        if user.avatar and os.path.exists(user.avatar.path):
            try:
                os.remove(user.avatar.path)
                self.stdout.write("  ✓ Avatar o'chirildi")
            except Exception as e:
                self.stdout.write(
                    self.style.WARNING(f"  ⚠️  Avatar o'chirishda xato: {e}")
                )

        # O'qituvchi profilini o'chirish
        teacher_name = user.get_full_name() or username
        teacher.delete()

        # CustomUser accountini o'chirish
        user.delete()

        # Success message
        self.stdout.write(
            self.style.SUCCESS(
                f"\n✅ OPERATSIYA MUVAFFAQIYATLI YAKUNLANDI\n"
                f"O'chirildi:\n"
                f"  - O'qituvchi: {teacher_name}\n"
                f"  - Kurslar: {deleted_courses}\n"
                f"  - Videolar: {deleted_lessons}\n"
            )
        )
