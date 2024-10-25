from django.db import models

class Keyword(models.Model):
    words = models.CharField(max_length=255)

    def __str__(self):
        return self.words

class JobListing(models.Model):
    title = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    date_posted = models.DateField()
    attributes = models.TextField()
    benefits = models.TextField(default = 'N/A')  # Add this field if it doesn't exist
    job_description = models.TextField( default = 'N/A')  # Ensure this field is present
    keywords = models.ManyToManyField(Keyword, related_name='job_listings')

    def __str__(self):
        return self.title
    
class ResumeListing(models.Model):
    text = models.TextField( default = 'N/A')
    keywords = models.ManyToManyField(Keyword, related_name='resume_listings')

    def __str__(self):
        return self.text[:50]