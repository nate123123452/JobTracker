from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from .models import Job, Resume
from .serializers import JobSerializer, ResumeSerializer, UserSerializer

class JobViewSet(viewsets.ModelViewSet):
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]
    queryset = Job.objects.all()

    def get_queryset(self):
        return Job.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ResumeViewSet(viewsets.ModelViewSet):
    serializer_class = ResumeSerializer
    permission_classes = [IsAuthenticated]
    queryset = Resume.objects.all()

    def get_queryset(self):
        return Resume.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

@api_view(['POST'])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
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
        user=request.user,
        title=title,
        description=description,
        upload_date=timezone.now(),
        document=document
    )

    # Serialize and return saved data
    serializer = ResumeSerializer(resume)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def interview_dates(request):
    jobs = Job.objects.filter(user=request.user)
    interviews = []
    for job in jobs:
        for interview in job.interview_dates:
            interviews.append({
                'id': job.id,
                'company': job.company,
                'title': job.title,
                'date': interview.get('date'),
                'startTime': interview.get('startTime'),
                'endTime': interview.get('endTime'),   
                'description': interview.get('description'),
                'location': interview.get('location'),
            })
    return Response(interviews, status=status.HTTP_200_OK)
        