from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
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
@permission_classes([AllowAny])
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
        for index, interview in enumerate(job.interview_dates):
            # Generate a compound ID if none exists
            interview_id = interview.get('id') or f"{job.id}_{index}"
            interviews.append({
                'id': interview_id,  # Ensure unique ID exists
                'job_id': job.id,
                'company': job.company,
                'title': job.title,
                'date': interview.get('date'),
                'startTime': interview.get('startTime'),
                'endTime': interview.get('endTime'),   
                'description': interview.get('description'),
                'location': interview.get('location', 'TBD'),
            })
            
            # Update the interview in job.interview_dates with the ID if it was missing
            if not interview.get('id'):
                interview['id'] = interview_id
                job.save(update_fields=['interview_dates'])
                
    return Response(interviews, status=status.HTTP_200_OK)


from django.http import JsonResponse
from django.shortcuts import get_object_or_404

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_interview_date(request, job_id, interview_index):
    # Access the request object to avoid compile error
    user = request.user
    # Get the job object
    job = get_object_or_404(Job, pk=job_id)
    
    # Check if the interview index is within the bounds of the list
    if interview_index < len(job.interview_dates):
        # Remove the interview date at the specified index
        del job.interview_dates[interview_index]
        
        # Save the updated job object
        job.save()
        
        return JsonResponse({"message": "Interview date deleted successfully"})
    else:
        return JsonResponse({"error": "Interview date not found"}, status=400)
