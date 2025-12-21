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
