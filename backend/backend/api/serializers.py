from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Messages

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=["id","username","email","password"]

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model=Messages
        fields=['sender','receiver','message']