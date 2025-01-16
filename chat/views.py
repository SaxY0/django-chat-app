# chat/views.py
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import JsonResponse  # Add this import
from django.db.models import Q
from .forms import UserRegistrationForm
from .models import Message

def register(request):
    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')
    else:
        form = UserRegistrationForm()
    return render(request, 'chat/register.html', {'form': form})

@login_required
def chat_room(request):
    users = User.objects.exclude(username=request.user.username)
    return render(request, 'chat/chat.html', {
        'users': users,
    })

@login_required
def get_messages(request, user_id):
    other_user = User.objects.get(id=user_id)
    messages = Message.objects.filter(
        Q(sender=request.user, receiver=other_user) |
        Q(sender=other_user, receiver=request.user)
    ).order_by('timestamp')
    return JsonResponse([{
        'sender': msg.sender.username,
        'content': msg.content,
        'timestamp': msg.timestamp.strftime('%Y-%m-%d %H:%M:%S')
    } for msg in messages], safe=False)