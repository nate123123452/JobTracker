from rest_framework import viewsets
from .models import Job
from .serializers import JobSerializer

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone
from .models import Resume
from 


class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer

@api_view(['POST'])
def upload_resume(request):
    file = request