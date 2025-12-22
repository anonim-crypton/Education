# API endpoints qo'shimcha fayli - Deprecated (views.py ga ko'chirildi)
# Bu fayl backward compatibility uchun saqlanadi


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
