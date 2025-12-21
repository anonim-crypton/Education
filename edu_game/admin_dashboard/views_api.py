# API endpoints qo'shimcha fayli
# Bu views.py-da qo'shiladi

from django.shortcuts import get_object_or_404
from django.contrib.auth.decorators import login_required, user_passes_test
from django.views.decorators.http import require_http_methods
from teachers.models import Teacher
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from django.http import JsonResponse
import json

User = get_user_model()

def is_admin(user):
    """Check if user is admin"""
    return user.is_authenticated and (user.is_staff or user.is_superuser)


@login_required(login_url='/users/admin/login/')
@user_passes_test(is_admin)
@require_http_methods(["POST"])
def delete_teacher_api(request, teacher_id):
    """Delete teacher and user"""
    try:
        teacher = get_object_or_404(Teacher, id=teacher_id)
        user = teacher.user
        username = user.username
        
        # Teacher o'chir
        teacher.delete()
        # User o'chir
        user.delete()
        
        return JsonResponse({
            'success': True,
            'message': f'{username} o\'qituvchisi va hisobi o\'chirildi'
        })
    except Exception as e:
        import traceback
        traceback.print_exc()
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=400)


@login_required(login_url='/users/admin/login/')
@user_passes_test(is_admin)
@require_http_methods(["POST"])
def block_teacher_api(request, teacher_id):
     """Block/Unblock teacher"""
     try:
         teacher = get_object_or_404(Teacher, id=teacher_id)
         user = teacher.user
         
         # Foydalanuvchini blok qil (is_active = False)
         user.is_active = not user.is_active
         user.save()
         
         status_text = "Blok qilindi" if not user.is_active else "Blok ochildi"
         
         return JsonResponse({
             'success': True,
             'message': f'{user.username} {status_text}',
             'is_blocked': not user.is_active
         })
     except Exception as e:
         import traceback
         traceback.print_exc()
         return JsonResponse({
             'success': False,
             'error': str(e)
         }, status=400)


@login_required(login_url='/users/admin/login/')
@user_passes_test(is_admin)
@require_http_methods(["POST"])
def delete_user_api(request, user_id):
     """Delete user"""
     try:
         user = get_object_or_404(User, id=user_id)
         username = user.username
         
         # User o'chir
         user.delete()
         
         return JsonResponse({
             'success': True,
             'message': f'{username} foydalanuvchisi o\'chirildi'
         })
     except Exception as e:
         import traceback
         traceback.print_exc()
         return JsonResponse({
             'success': False,
             'error': str(e)
         }, status=400)


@login_required(login_url='/users/admin/login/')
@user_passes_test(is_admin)
@require_http_methods(["POST"])
def create_teacher_api(request):
     """Create teacher via API (JSON)"""
     try:
         data = json.loads(request.body)
         
         username = data.get('username', '').strip()
         password = data.get('password', '').strip()
         subject = data.get('subject', '').strip()
         first_name = data.get('first_name', 'Teacher').strip()
         last_name = data.get('last_name', 'User').strip()
         
         # Validate required fields
         if not username:
             return JsonResponse({
                 'success': False,
                 'error': 'Username talab qilinadi'
             }, status=400)
         
         if not password:
             return JsonResponse({
                 'success': False,
                 'error': 'Parol talab qilinadi'
             }, status=400)
         
         # Check if username exists
         if User.objects.filter(username=username).exists():
             return JsonResponse({
                 'success': False,
                 'error': f'Username "{username}" allaqachon mavjud'
             }, status=400)
         
         # Check if subject is already assigned (only if subject is provided)
         if subject and subject != '' and Teacher.objects.filter(subject=subject).exists():
             return JsonResponse({
                 'success': False,
                 'error': f'Fan "{subject}" allaqachon boshqa o\'qituvchiga tayinlangan'
             }, status=400)
         
         # Create user
         user = User.objects.create_user(
             username=username,
             password=password,
             first_name=first_name,
             last_name=last_name
         )
         
         # Mark user as teacher (staff)
         user.is_staff = True
         user.save()
         
         # Create teacher profile
         teacher = Teacher.objects.create(
             user=user,
             subject=subject or 'Umum',
             bio=''
         )
         
         return JsonResponse({
             'success': True,
             'message': f'O\'qituvchi "{username}" muvaffaqiyatli yaratildi',
             'teacher': {
                 'id': teacher.id,
                 'username': user.username,
                 'first_name': user.first_name,
                 'last_name': user.last_name,
                 'subject': teacher.subject
             }
         })
         
     except json.JSONDecodeError:
         return JsonResponse({
             'success': False,
             'error': 'Noto\'g\'ri JSON format'
         }, status=400)
     except Exception as e:
         import traceback
         traceback.print_exc()
         return JsonResponse({
             'success': False,
             'error': str(e)
         }, status=400)
