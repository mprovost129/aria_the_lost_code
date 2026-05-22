import os
from .base import *

DEBUG = False

# Support both explicit ALLOWED_HOSTS env var and Render's auto hostname
_allowed = os.environ.get('ALLOWED_HOSTS', '').split(',')
_render_hostname = os.environ.get('RENDER_EXTERNAL_HOSTNAME')
if _render_hostname:
    _allowed.append(_render_hostname)
ALLOWED_HOSTS = [h for h in _allowed if h]

# Whitenoise - insert after SecurityMiddleware
MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')

STORAGES = {
    'default': {
        'BACKEND': 'django.core.files.storage.FileSystemStorage',
    },
    'staticfiles': {
        'BACKEND': 'whitenoise.storage.CompressedStaticFilesStorage',
    },
}

# Persistent DB connections
CONN_MAX_AGE = 60

# Support Render's external hostname in CSRF trusted origins automatically
_csrf = os.environ.get('CSRF_TRUSTED_ORIGINS', '').split(',')
if _render_hostname:
    _csrf.append(f'https://{_render_hostname}')
CSRF_TRUSTED_ORIGINS = [h for h in _csrf if h]

CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': os.environ.get('REDIS_URL', 'redis://127.0.0.1:6379/1'),
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        },
    }
}

# HTTPS / security
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
