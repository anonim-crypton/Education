from django.urls import path
from . import views

urlpatterns = [
    # Status page
    path('status/', views.api_status, name='api_status'),
    path('admin/create/', views.admin_create_page, name='admin_create_page'),
    
    # API endpoints
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('profile/', views.user_profile_view, name='profile'),
    path('profile/avatar/delete/', views.delete_avatar_view, name='delete_avatar'),
    path('dashboard/', views.dashboard_view, name='dashboard'),
    path('google/', views.google_login_view, name='google_login'),
    path('google/complete/', views.complete_google_registration, name='complete_google_registration'),
    # Teacher application endpoints
    path('teachers/apply/', views.teacher_apply_view, name='teacher_apply'),
    path('teachers/status/', views.teacher_application_status_view, name='teacher_status'),
    # Course endpoints
    path('courses/', views.courses_list_view, name='courses_list'),
    path('courses/<int:course_id>/', views.course_detail_view, name='course_detail'),
    path('courses/<str:subject>/teachers/', views.get_teachers_by_subject, name='get_teachers_by_subject'),
    # Teacher course endpoints
    path('teacher/courses/', views.teacher_courses_view, name='teacher_courses'),
    path('teacher/students/', views.teacher_students_view, name='teacher_students'),
    # Lesson/Video endpoints
    path('lessons/', views.lessons_list_view, name='lessons_list'),
    path('lessons/<int:lesson_id>/delete/', views.delete_lesson_view, name='delete_lesson'),
    
    # Django Teacher Panel URLs
    path('teacher/login/', views.teacher_login_view, name='teacher_login'),
    path('teacher/dashboard/', views.teacher_dashboard, name='teacher_dashboard'),
    path('teacher/logout/', views.teacher_logout_view, name='teacher_logout'),
    path('teacher/add-course/', views.teacher_add_course, name='teacher_add_course'),
    path('teacher/course/<int:course_id>/delete/', views.teacher_delete_course, name='teacher_delete_course'),
    path('teacher/upload-lesson/', views.teacher_upload_lesson, name='teacher_upload_lesson'),
    
    # Admin Panel URLs (Django)
    path('admin/login/', views.admin_login_view, name='admin_login'),
    path('admin/dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('admin/logout/', views.admin_logout_view, name='admin_logout'),
    path('admin/teacher/<int:application_id>/approve/', views.approve_teacher_view, name='admin_approve_teacher'),
    path('admin/teacher/<int:application_id>/reject/', views.reject_teacher_view, name='admin_reject_teacher'),
    
    # Teacher API Endpoints
    path('teacher/api/login/', views.teacher_login_api, name='teacher_login_api'),
    
    # Admin API Endpoints
    path('admin/api/login/', views.admin_login_api, name='admin_login_api'),
    path('admin/api/logout/', views.admin_logout_api, name='admin_logout_api'),
    path('admin/api/create/', views.create_admin_user, name='create_admin_user'),
    path('admin/api/create-teacher/', views.create_teacher_user, name='create_teacher_user'),
    path('admin/teacher-requests/', views.admin_teacher_requests_view, name='admin_teacher_requests'),
    path('admin/teacher-requests/<int:request_id>/approve/', views.admin_approve_teacher_view, name='admin_approve_teacher_api'),
    path('admin/teacher-requests/<int:request_id>/reject/', views.admin_reject_teacher_view, name='admin_reject_teacher_api'),
    path('admin/teachers/', views.admin_teachers_list_view, name='admin_teachers_list'),
    path('admin/create-course/', views.admin_create_course_view, name='admin_create_course'),
    path('<int:user_id>/delete/', views.admin_delete_teacher, name='admin_delete_teacher'),
    
    # Notification endpoints
    path('notifications/send/', views.send_notification_view, name='send_notification'),
    path('notifications/', views.user_notifications_view, name='user_notifications'),
]
