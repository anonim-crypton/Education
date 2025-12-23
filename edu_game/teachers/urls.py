from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TeacherRequestViewSet, 
    TeacherViewSet, 
    teacher_login_view, 
    teacher_dashboard_view, 
    teacher_logout_view, 
    all_teachers_view,
    teacher_upload_lesson_view,
    teacher_lessons_list_view,
    teacher_students_list_view
)

router = DefaultRouter()
router.register(r'teachers/requests', TeacherRequestViewSet, basename='teacher-request')
router.register(r'teachers', TeacherViewSet, basename='teacher')

urlpatterns = [
     path('login/', teacher_login_view, name='teacher_login'),
     path('dashboard/', teacher_dashboard_view, name='teacher_dashboard'),
     path('lessons/', teacher_lessons_list_view, name='teacher_lessons_list'),
     path('students/', teacher_students_list_view, name='teacher_students_list'),
     path('logout/', teacher_logout_view, name='teacher_logout'),
     path('list/', all_teachers_view, name='all_teachers'),
     path('upload-lesson/', teacher_upload_lesson_view, name='teacher_upload_lesson'),
     path('', include(router.urls)),
]
