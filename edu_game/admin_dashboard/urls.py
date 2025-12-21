from django.urls import path
from . import views
from .views_api import create_teacher_api, delete_teacher_api, block_teacher_api, delete_user_api

app_name = 'admin_dashboard'

urlpatterns = [
     path('', views.admin_dashboard_view, name='dashboard'),
     path('create-teacher/', views.create_teacher_view, name='create_teacher'),
     path('teachers/<int:teacher_id>/edit/', views.edit_teacher_view, name='edit_teacher'),
     path('users/<int:user_id>/assign-teacher/', views.assign_teacher_credentials_view, name='assign_teacher'),
     path('requests/', views.teacher_requests_view, name='teacher_requests'),
     path('teachers/', views.approved_teachers_view, name='approved_teachers'),
     path('teachers/<int:teacher_id>/generate-credentials/', views.generate_credentials_view, name='generate_credentials'),
     path('users/', views.users_view, name='users'),
     
     # API endpoints
     path('api/teacher-requests/', views.get_teacher_requests_api, name='api_teacher_requests'),
     path('api/approved-teachers/', views.get_approved_teachers_api, name='api_approved_teachers'),
     path('api/teacher/<int:teacher_id>/delete/', delete_teacher_api, name='delete_teacher_api'),
     path('api/teacher/<int:teacher_id>/block/', block_teacher_api, name='block_teacher_api'),
     path('api/user/<int:user_id>/delete/', delete_user_api, name='delete_user_api'),
     path('api/create-teacher/', create_teacher_api, name='create_teacher_api'),
]
