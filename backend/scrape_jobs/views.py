from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import login, logout 
from django.contrib.auth.forms import AuthenticationForm
from django.utils import timezone
from .models import Job, Resume
from .serializers import JobSerializer, ResumeSerializer, UserSerializer

class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer

class ResumeViewSet(viewsets.ModelViewSet):
    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer

@api_view(['POST'])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login_view(request):
    form = AuthenticationForm(request, data=request.data)
    if form.is_valid():
        user = form.get_user()
        login(request, user)
        return Response({"message": "User logged in successfully"}, status=status.HTTP_200_OK)
    return Response({"error": "Invalid Credentials"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def logout_view(request):
    logout(request)
    return Response({"message": "User logged out successfully"}, status=status.HTTP_200_OK)

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

@api_view(['GET'])
def interview_dates(request):
    jobs = Job.objects.all()
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
        