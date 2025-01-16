# Django Real-Time Chat Application

A real-time chat application built with Django and Django Channels, featuring user authentication and real-time message updates.

## Features
- Real-time messaging using WebSocket connections
- User authentication (login/register)
- Persistent chat history
- Responsive design

## Project Structure
```
chat_project/
│
├── chat/
│   ├── __init__.py
│   ├── models.py
│   ├── consumers.py
│   ├── routing.py
│   ├── views.py
│   ├── urls.py
│   ├── forms.py
│   └── templates/
│       ├── chat/
│       │   ├── base.html
│       │   ├── login.html
│       │   ├── register.html
│       │   └── chat.html
│       └── static/
│           ├── css/
│           │   └── style.css
│           └── js/
│               └── chat.js
│
├── chat_project/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
│
└── requirements.txt
```

## Prerequisites
- Python 3.8 or higher
- Redis server (for Django Channels)
- pip (Python package manager)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/chat_project.git
cd chat_project
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows, use: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Install and start Redis server:
- For Ubuntu/Debian:
  ```bash
  sudo apt-get install redis-server
  sudo service redis-server start
  ```
- For macOS:
  ```bash
  brew install redis
  brew services start redis
  ```
- For Windows, download the Redis installer from the official website

5. Create environment variables file (.env) in the root directory:
```
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
REDIS_URL=redis://localhost:6379
```

6. Apply database migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

7. Create a superuser (admin):
```bash
python manage.py createsuperuser
```

## Running the Application

1. Start the development server:
```bash
python manage.py runserver
```

2. Access the application:
- Main application: `http://localhost:8000`
- Admin interface: `http://localhost:8000/admin`

