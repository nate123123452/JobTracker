from django.db import models

class JobListing(models.Model):
    title = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    date_posted = models.DateField()
    attributes = models.TextField()
    benefits = models.TextField(default = 'N/A')  # Add this field if it doesn't exist
    job_description = models.TextField( default = 'N/A')  # Ensure this field is present

    def __str__(self):
        return self.title
