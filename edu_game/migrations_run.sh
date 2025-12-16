#!/bin/bash

echo "🔄 Django Migrations Jarayoni..."
echo "================================"

# Make migrations
echo "1. Migrations yaratilmoqda..."
python manage.py makemigrations

echo ""
echo "2. Migrations qo'llanilmoqda..."
python manage.py migrate

echo ""
echo "3. Teacher akkaunt yaratilmoqda..."
python create_teacher.py

echo ""
echo "4. Kurslar yaratilmoqda..."
python create_courses.py

echo ""
echo "✅ Hamma tayyor!"
echo "================================"
echo ""
echo "🌐 Avval Django servers shu buyruq bilan boshlang:"
echo "   python manage.py runserver"
echo ""
echo "🔐 Login qilish uchun:"
echo "   Teacher: teacher_demo / Teacher@123456"
echo "   Student: Har qanday student akkaunt"
echo ""
echo "📊 Django Admin: http://localhost:8000/admin/"
echo "📚 Dashboard: http://localhost:3000/dashboard"
