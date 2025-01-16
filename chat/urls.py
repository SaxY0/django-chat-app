# chat/urls.py
from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', views.chat_room, name='chat'),
    path('register/', views.register, name='register'),
    path('login/', auth_views.LoginView.as_view(template_name='chat/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='login'), name='logout'),
    path('messages/<int:user_id>/', views.get_messages, name='get_messages'),
]