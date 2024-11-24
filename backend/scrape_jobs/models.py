from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

class Resume(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=1)
    title = models.TextField(max_length=255, default='N/A')
    upload_date = models.DateTimeField(default=timezone.now)
    description = models.TextField(blank=True, null=True, default='N/A')
    document = models.FileField(null = True, upload_to='resumes/')
    
    def __str__(self):
        return self.title

class Job(models.Model):
    STATUS_CHOICES = [
        ('Applied', 'Applied'),
        ('In Progress', 'In Progress'),
        ('Offered', 'Offered'),
        ('Rejected', 'Rejected'),
    ]

    LOCATION_CHOICES = [
        ('Remote', 'Remote'),
        ('Hybrid', 'Hybrid'),
        ('In Person', 'In Person'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, default=1)
    company = models.CharField(blank=True, null=True, max_length=255, default='N/A')
    title = models.CharField(blank=True, null=True, max_length=255, default='N/A')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='In Progress')
    site = models.URLField(blank=True, null=True)
    applied_date = models.DateField(null=True, blank=True)
    location = models.CharField(max_length=50, choices=LOCATION_CHOICES, default='In Person')
    notes = models.TextField(blank=True, null=True)
    interview_dates = models.JSONField(default=list, null=True)

    def __str__(self):
        return f"{self.company} - {self.title}"
