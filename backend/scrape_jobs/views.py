from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone
from .models import Job, Resume
from .serializers import JobSerializer, ResumeSerializer

class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer

class ResumeViewSet(viewsets.ModelViewSet):
    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer

@api_view(['POST'])
def upload_resume(request):
    document = request.FILES.get('document')
    title = request.data.get('title')
    description = request.data.get('description')

    if not document:
        return Response({"error": "No File Provided"}, status=status.HTTP_400_BAD_REQUEST)
    
    if not title:
        return Response({"error": "Title is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check file type
    if not document.name.endswith('.pdf'):
        return Response({"error": "Unsupported File Type"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Set description to 'N/A' if not provided
    description = description or 'N/A'

    # Create and save new Resume object
    resume = Resume.objects.create(
        title=title,
        description=description,
        upload_date=timezone.now(),
        document=document
    )

    # Serialize and return saved data
    serializer = ResumeSerializer(resume)
    return Response(serializer.data, status=status.HTTP_201_CREATED)
