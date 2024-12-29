from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Job, Resume

class JobSerializer(serializers.ModelSerializer):
    '''Serializer for Job Modal'''

    class Meta:
        model = Job
        fields = '__all__'

class ResumeSerializer(serializers.ModelSerializer):
    '''Serializer for Resume Modal'''

    class Meta:
        model = Resume
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    '''Serializer for User Modal with password confirmation'''
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'confirm_password']
    
    def validate(self, data):
        '''Ensure the passwords are the same'''
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match")
        return data
    
    def create(self, validated_data):
        '''Create a new user instance, removing the confirm_password field'''
        validated_data.pop('confirm_password')
        user = User.objects.create_user(**validated_data)
        return user