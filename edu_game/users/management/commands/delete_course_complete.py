"""
Management command to completely delete a course and all its videos
"""
from django.core.management.base import BaseCommand
from users.models import Course, Lesson
import os


class Command(BaseCommand):
    help = "Kursni va uning barcha videolarini butunlay o'chirish"

    def add_arguments(self, parser):
        parser.add_argument(
            'course_id',
            type=int,
            help="Kurs ID'si (butun son)"
        )
        parser.add_argument(
            '--force',
            action='store_true',
            help="Confirmation sorashmasdan o'chirish"
        )

    def handle(self, *args, **options):
        course_id = options['course_id']
        force = options.get('force', False)

        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            self.stdout.write(
                self.style.ERROR(f"❌ Kurs (ID: {course_id}) topilmadi")
            )
            return

        # Videolarni hisoblash
        lessons = course.videos.all()
        total_lessons = lessons.count()

        self.stdout.write(
            self.style.WARNING(
                f"\n⚠️  OGOHLANTIRISH: Bu operatsiya qaytarilib bo'lmaydi!\n"
                f"O'chiriladi:\n"
                f"  - Kurs: {course.title}\n"
                f"  - O'qituvchi: {course.teacher}\n"
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
                self.stdout.write("  ✓ Kurs rasmi o'chirildi")
            except Exception as e:
                self.stdout.write(
                    self.style.WARNING(f"  ⚠️  Rasm o'chirishda xato: {e}")
                )

        # Kursni o'chirish
        course_title = course.title
        course.delete()

        # Success message
        self.stdout.write(
            self.style.SUCCESS(
                f"\n✅ OPERATSIYA MUVAFFAQIYATLI YAKUNLANDI\n"
                f"O'chirildi:\n"
                f"  - Kurs: {course_title}\n"
                f"  - Videolar: {deleted_lessons}\n"
            )
        )
