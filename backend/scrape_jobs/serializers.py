from rest_framework import serializers
from .models import Job, Resume

class JobSerializer(serializers.ModelSerializer):

    class Meta:
        model = Job
        fields = '__all__'

class ResumeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Resume
        fields = '__all__'