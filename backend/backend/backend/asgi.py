"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os

from channels.routing import ProtocolTypeRouter,URLRouter
from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack
from api.custommiddeware import JWTAuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

import django
django.setup()

from api.routing import websocket_urlpatterns

django_asgi_application = get_asgi_application()

application=ProtocolTypeRouter({
    'http':django_asgi_application,
    'websocket': AllowedHostsOriginValidator(JWTAuthMiddlewareStack(URLRouter(websocket_urlpatterns)))
})