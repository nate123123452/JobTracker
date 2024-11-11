from django.db import models

class JobListing(models.Model):
    job_name = models.CharField(max_length=255, default='N/A')
    website = models.URLField(default='N/A')
    text = models.TextField(default='N/A')
    keywords = models.TextField(default='')  # TextField to store keywords as a string

    def __str__(self):
        return self.job_name

class ResumeListing(models.Model):
    text = models.TextField(default='N/A')
    keywords = models.TextField(default='')  # TextField to store keywords as a string

    def __str__(self):
        return self.text[:50]

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

    company = models.CharField(max_length=255)
    title = models.CharField(max_length=255)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES)
    site = models.URLField(blank=True, null=True)
    applied_date = models.DateField(null=True, blank=True)
    location = models.CharField(max_length=50, choices=LOCATION_CHOICES)
    notes = models.TextField(blank=True, null=True)
    interview_dates = models.JSONField(default=list, null=True)

    def __str__(self):
        return f"{self.company} - {self.title}"
