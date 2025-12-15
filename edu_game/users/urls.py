from django.urls import path
from . import views

urlpatterns = [
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
]
