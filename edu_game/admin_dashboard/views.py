from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.http import require_http_methods
from django.contrib.auth import get_user_model
from django.contrib import messages
from django.utils import timezone
from teachers.models import TeacherRequest, Teacher
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
import secrets
import string

User = get_user_model()


def is_admin(user):
    """Check if user is admin"""
    return user.is_authenticated and (user.is_staff or user.is_superuser)


@login_required(login_url='/users/admin/login/')
@user_passes_test(is_admin)
def admin_dashboard_view(request):
    """Admin dashboard - main page"""
    
    # GET request - Dashboard ko'rsatish
    pending_applications = TeacherRequest.objects.filter(status='pending').order_by('-created_at')
    approved_teachers = Teacher.objects.all()
    
    # Exclude admin and staff
    all_users = User.objects.exclude(is_staff=True).exclude(is_superuser=True)
    
    # Get all teachers and students
    teacher_ids = Teacher.objects.values_list('user_id', flat=True)
    
    # Get user IDs with pending teacher requests
    pending_teacher_request_ids = TeacherRequest.objects.filter(status='pending').values_list('user_id', flat=True)
    
    teachers = all_users.filter(id__in=teacher_ids)
    students = all_users.exclude(id__in=teacher_ids).exclude(id__in=pending_teacher_request_ids)
    
    # Calculate statistics
    total_users = all_users.count()
    teachers_count = teachers.count()
    students_count = students.count()
    approved_count = approved_teachers.count()
    pending_count = pending_applications.count()
    
    # Active teachers percentage (approved out of all teachers)
    active_percentage = int((approved_count / teachers_count * 100)) if teachers_count > 0 else 0
    
    context = {
        'pending_applications': pending_applications,
        'approved_teachers': approved_teachers,
        'pending_count': pending_count,
        'approved_count': approved_count,
        'user_count': total_users,
        'total_users': total_users,
        'teachers_count': teachers_count,
        'students_count': students_count,
        'active_percentage': active_percentage,
    }
    return render(request, 'admin_dashboard/dashboard.html', context)


@login_required(login_url='/users/admin/login/')
@user_passes_test(is_admin)
@require_http_methods(["GET", "POST"])
def edit_teacher_view(request, teacher_id):
    """Edit existing teacher profile"""
    teacher = get_object_or_404(Teacher, id=teacher_id)
    
    if request.method == 'POST':
        full_name = request.POST.get('full_name', '').strip()
        subject = request.POST.get('subject', '').strip()
        bio = request.POST.get('bio', '').strip()
        avatar = request.FILES.get('avatar')
        
        try:
            # Update user
            if full_name:
                teacher.user.first_name = full_name.split()[0]
                teacher.user.last_name = ' '.join(full_name.split()[1:]) if len(full_name.split()) > 1 else ''
                teacher.user.save()
            
            # Handle avatar upload if provided
            if avatar:
                teacher.user.avatar = avatar
                teacher.user.save()
            
            # Update teacher profile
            teacher.subject = subject or teacher.subject
            teacher.bio = bio or teacher.bio
            teacher.save()
            
            messages.success(request, f'O\'qituvchi "{teacher.user.get_full_name()}" muvaffaqiyatli tahrirlandi')
            return redirect('admin_dashboard:approved_teachers')
            
        except Exception as e:
            messages.error(request, f'Xatolik: {str(e)}')
    
    # GET request - Show form with current data
    context = {
        'teacher': teacher,
        'pending_count': TeacherRequest.objects.filter(status='pending').count(),
        'approved_count': Teacher.objects.all().count(),
    }
    return render(request, 'admin_dashboard/edit_teacher.html', context)


@login_required(login_url='/users/admin/login/')
@user_passes_test(is_admin)
@require_http_methods(["GET", "POST"])
def create_teacher_view(request):
    """Create teacher with manual username and password"""
    
    if request.method == 'POST':
         username = request.POST.get('username', '').strip()
         password = request.POST.get('password', '').strip()
         full_name = request.POST.get('full_name', '').strip()
         subject = request.POST.get('subject', '').strip()
         bio = request.POST.get('bio', '').strip()
         avatar = request.FILES.get('avatar')
         
         # Validate inputs
         if not all([username, password]):
              messages.error(request, 'Username va parolni to\'ldiring')
         elif User.objects.filter(username=username).exists():
              messages.error(request, f'Username "{username}" allaqachon mavjud')
         elif subject and subject != '' and Teacher.objects.filter(subject=subject).exists():
              # Check if subject is already assigned to another teacher
              messages.error(request, f'Fan "{subject}" allaqachon boshqa o\'qituvchiga tayinlangan. Faqat bitta o\'qituvchi bitta fan uchun tayinlanishi mumkin.')
         else:
              try:
                  # Create user
                  user = User.objects.create_user(
                      username=username,
                      password=password,
                      first_name=full_name.split()[0] if full_name else '',
                      last_name=' '.join(full_name.split()[1:]) if len(full_name.split()) > 1 else '',
                  )
                  
                  # Handle avatar upload if provided
                  if avatar:
                      user.avatar = avatar
                      user.save()
                  
                  # Create teacher profile
                  teacher = Teacher.objects.create(
                      user=user,
                      subject=subject or 'Umum',
                      bio=bio or '',
                  )
                  
                  # Show success message and redirect to dashboard
                  messages.success(request, f'O\'qituvchi "{username}" muvaffaqiyatli yaratildi')
                  return redirect('admin_dashboard:dashboard')
                  
              except Exception as e:
                  messages.error(request, f'Xatolik: {str(e)}')
    
    # GET request - Show form
    # Get all teachers with their assigned subjects
    assigned_teachers = Teacher.objects.filter(subject__isnull=False).exclude(subject='').values('subject')
    
    context = {
        'pending_count': TeacherRequest.objects.filter(status='pending').count(),
        'approved_count': Teacher.objects.all().count(),
        'assigned_teachers': assigned_teachers,
    }
    return render(request, 'admin_dashboard/create_teacher.html', context)


@login_required(login_url='/users/admin/login/')
@user_passes_test(is_admin)
def teacher_requests_view(request):
    """Teacher requests tab"""
    pending_applications = TeacherRequest.objects.filter(status='pending').order_by('-created_at')
    approved_requests = TeacherRequest.objects.filter(status='approved')
    all_requests = TeacherRequest.objects.all()
    
    context = {
        'pending_applications': pending_applications,
        'pending_count': pending_applications.count(),
        'approved_count': approved_requests.count(),
        'all_requests_count': all_requests.count(),
    }
    return render(request, 'admin_dashboard/teacher_requests.html', context)


@login_required(login_url='/users/admin/login/')
@user_passes_test(is_admin)
def approved_teachers_view(request):
    """View approved teacher requests (not actual teacher accounts)"""
    # Show TeacherRequest with status="approved" (not Teacher model)
    approved_requests = TeacherRequest.objects.filter(status='approved').select_related('user').order_by('-approved_at')
    pending_applications = TeacherRequest.objects.filter(status='pending').order_by('-created_at')
    
    # Get all users that are NOT teachers and NOT pending teacher requests
    teacher_ids = Teacher.objects.values_list('user_id', flat=True)
    pending_teacher_request_ids = TeacherRequest.objects.filter(status='pending').values_list('user_id', flat=True)
    total_students = User.objects.exclude(id__in=teacher_ids).exclude(id__in=pending_teacher_request_ids).exclude(is_staff=True).exclude(is_superuser=True).count()
    
    context = {
        'approved_teachers': approved_requests,  # TeacherRequest objects with status='approved'
        'pending_count': pending_applications.count(),
        'approved_count': approved_requests.count(),
        'total_students': total_students,
    }
    return render(request, 'admin_dashboard/approved_teachers.html', context)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_teacher_requests_api(request):
    """Get pending teacher requests for AJAX"""
    if not (request.user.is_staff or request.user.is_superuser):
        return Response({'error': 'Admin huquqlari kerak'}, status=status.HTTP_403_FORBIDDEN)
    
    pending = TeacherRequest.objects.filter(status='pending').order_by('-created_at').values(
        'id', 'full_name', 'subject', 'experience_years', 'phone', 'qualifications', 'bio', 'status'
    )
    
    return Response(list(pending))


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_approved_teachers_api(request):
    """Get approved teachers for AJAX"""
    if not (request.user.is_staff or request.user.is_superuser):
        return Response({'error': 'Admin huquqlari kerak'}, status=status.HTTP_403_FORBIDDEN)
    
    teachers = Teacher.objects.select_related('user').values(
        'id', 'user__id', 'user__username', 'user__email', 'full_name', 'subject'
    )
    
    return Response(list(teachers))


@login_required(login_url='/users/admin/login/')
@user_passes_test(is_admin)
def teachers_view(request):
    """Yangi yaratilgan o'qituvchilar - Teachers model"""
    new_teachers = Teacher.objects.select_related('user').order_by('-created_at')
    pending_applications = TeacherRequest.objects.filter(status='pending').order_by('-created_at')
    
    context = {
        'new_teachers': new_teachers,
        'new_teachers_count': new_teachers.count(),
        'pending_count': pending_applications.count(),
        'approved_count': Teacher.objects.all().count(),
    }
    return render(request, 'admin_dashboard/teachers.html', context)


@login_required(login_url='/users/admin/login/')
@user_passes_test(is_admin)
def users_view(request):
     """All registered users from the website"""
     # Exclude admin and staff
     all_users = User.objects.exclude(is_staff=True).exclude(is_superuser=True).order_by('-date_joined')
     
     # Get teacher user IDs
     teacher_user_ids = Teacher.objects.values_list('user_id', flat=True)
     
     # O'quvchilar - foydalanuvchilar teacher bo'lmagan
     students = all_users.exclude(id__in=teacher_user_ids)
     
     # O'qituvchilar - Teacher profile bo'lgan foydalanuvchilar
     teachers = all_users.filter(id__in=teacher_user_ids)
     
     pending_applications = TeacherRequest.objects.filter(status='pending').order_by('-created_at')
     approved_teachers = Teacher.objects.all()
     
     context = {
         'users': all_users,
         'users_count': all_users.count(),
         'total_users': all_users.count(),
         'students_count': students.count(),
         'teachers_count': teachers.count(),
         'pending_count': pending_applications.count(),
         'approved_count': approved_teachers.count(),
     }
     return render(request, 'admin_dashboard/users.html', context)


@login_required(login_url='/users/admin/login/')
@user_passes_test(is_admin)
def generate_credentials_view(request, teacher_id):
    """Generate login credentials for a teacher"""
    teacher = get_object_or_404(Teacher, id=teacher_id)
    
    # Generate secure password
    password = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(12))
    
    # Set the password
    teacher.user.set_password(password)
    teacher.user.save()
    
    context = {
        'teacher': teacher,
        'username': teacher.user.username,
        'password': password,
        'pending_count': TeacherRequest.objects.filter(status='pending').count(),
        'approved_count': Teacher.objects.all().count(),
    }
    
    return render(request, 'admin_dashboard/credentials.html', context)


@login_required(login_url='/users/admin/login/')
@user_passes_test(is_admin)
def assign_teacher_credentials_view(request, user_id):
    """Assign teacher credentials to a user"""
    user = get_object_or_404(User, id=user_id)
    
    # Check if user already has teacher profile
    if hasattr(user, 'teacher_profile'):
        messages.warning(request, f'{user.get_full_name()} allaqachon o\'qituvchi profiliga ega')
        return redirect('admin_dashboard:create_teacher')
    
    # Generate username (base on email or full name)
    base = user.email.split('@')[0].lower() if user.email else user.get_full_name().lower().replace(' ', '_')
    username = base
    counter = 1
    while User.objects.filter(username=username).exists():
        username = f"{base}{counter}"
        counter += 1
    
    # Generate secure password
    password = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(12))
    
    # Assign username and password
    user.username = username
    user.set_password(password)
    user.save()
    
    # Create teacher profile with default values
    teacher = Teacher.objects.create(
        user=user,
        subject='Umum',  # Default subject
        bio='',
    )
    
    context = {
        'teacher': teacher,
        'username': username,
        'password': password,
        'pending_count': TeacherRequest.objects.filter(status='pending').count(),
        'approved_count': Teacher.objects.all().count(),
    }
    
    return render(request, 'admin_dashboard/credentials.html', context)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def block_teacher_api(request, teacher_id):
    """Block a teacher"""
    if not (request.user.is_staff or request.user.is_superuser):
        return Response({'error': 'Admin huquqlari kerak'}, status=status.HTTP_403_FORBIDDEN)
    
    teacher = get_object_or_404(Teacher, id=teacher_id)
    teacher.is_blocked = True
    teacher.blocked_at = timezone.now()
    teacher.save()
    
    return Response({'success': True, 'message': f'{teacher.user.get_full_name()} blokirovka qilindi'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def unblock_teacher_api(request, teacher_id):
    """Unblock a teacher"""
    if not (request.user.is_staff or request.user.is_superuser):
        return Response({'error': 'Admin huquqlari kerak'}, status=status.HTTP_403_FORBIDDEN)
    
    teacher = get_object_or_404(Teacher, id=teacher_id)
    teacher.is_blocked = False
    teacher.blocked_at = None
    teacher.save()
    
    return Response({'success': True, 'message': f'{teacher.user.get_full_name()} blokirovkasi ochildi'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_teacher_api(request, teacher_id):
    """Delete a teacher"""
    if not (request.user.is_staff or request.user.is_superuser):
        return Response({'error': 'Admin huquqlari kerak'}, status=status.HTTP_403_FORBIDDEN)
    
    teacher = get_object_or_404(Teacher, id=teacher_id)
    teacher_name = teacher.user.get_full_name()
    teacher.is_deleted = True
    teacher.deleted_at = timezone.now()
    teacher.save()
    
    return Response({'success': True, 'message': f'{teacher_name} o\'chirildi'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_user_api(request, user_id):
    """Delete a user"""
    if not (request.user.is_staff or request.user.is_superuser):
        return Response({'error': 'Admin huquqlari kerak'}, status=status.HTTP_403_FORBIDDEN)
    
    user = get_object_or_404(User, id=user_id)
    user_name = user.get_full_name() or user.username
    user.delete()
    
    return Response({'success': True, 'message': f'{user_name} foydalanuvchisi o\'chirildi'})
