from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
import json

User = get_user_model()


class UserAuthenticationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = '/api/auth/register/'
        self.login_url = '/api/auth/login/'
        self.profile_url = '/api/auth/profile/'
        
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'TestPass123!',
            'password_confirm': 'TestPass123!',
            'school_name': 'Test School'
        }
    
    def test_user_registration(self):
        """Test user registration"""
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.data['success'])
        self.assertIn('access', response.data)
    
    def test_user_registration_duplicate_username(self):
        """Test registration with duplicate username"""
        self.client.post(self.register_url, self.user_data, format='json')
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertFalse(response.data['success'])
    
    def test_user_registration_weak_password(self):
        """Test registration with weak password"""
        weak_data = self.user_data.copy()
        weak_data['password'] = 'weak'
        weak_data['password_confirm'] = 'weak'
        
        response = self.client.post(self.register_url, weak_data, format='json')
        self.assertEqual(response.status_code, 400)
    
    def test_user_login(self):
        """Test user login"""
        # First register
        self.client.post(self.register_url, self.user_data, format='json')
        
        # Then login
        login_data = {
            'username': self.user_data['username'],
            'password': self.user_data['password']
        }
        response = self.client.post(self.login_url, login_data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['success'])
        self.assertIn('access', response.data)
    
    def test_user_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        login_data = {
            'username': 'nonexistent',
            'password': 'wrongpassword'
        }
        response = self.client.post(self.login_url, login_data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertFalse(response.data['success'])
    
    def test_user_profile_authenticated(self):
        """Test getting user profile when authenticated"""
        # Register user
        self.client.post(self.register_url, self.user_data, format='json')
        
        # Login and get token
        login_data = {
            'username': self.user_data['username'],
            'password': self.user_data['password']
        }
        login_response = self.client.post(self.login_url, login_data, format='json')
        token = login_response.data['access']
        
        # Get profile with token
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')
        response = self.client.get(self.profile_url, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['user']['username'], self.user_data['username'])
    
    def test_user_profile_unauthenticated(self):
        """Test getting user profile without authentication"""
        response = self.client.get(self.profile_url, format='json')
        self.assertEqual(response.status_code, 401)
    
    def test_school_name_stored(self):
        """Test that school name is stored during registration"""
        self.client.post(self.register_url, self.user_data, format='json')
        user = User.objects.get(username=self.user_data['username'])
        self.assertEqual(user.school_name, self.user_data['school_name'])
