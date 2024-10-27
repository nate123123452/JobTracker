from django.db import models

class JobListing(models.Model):
    job_name = models.CharField(max_length=255, default='N/A')
    website = models.URLField(default='N/A')
    text = models.TextField(default='N/A')
    keywords = models.TextField(default='')  # Change to a TextField to store keywords as a string
    
    def __str__(self):
        return self.job_name

class ResumeListing(models.Model):
    text = models.TextField(default='N/A')
    keywords = models.TextField(default='')  # Change to a TextField to store keywords as a string

    def __str__(self):
        return self.text[:50]
