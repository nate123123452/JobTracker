from django.db import models

class JobListing(models.Model):
    title = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    date_posted = models.DateField()
    company = models.CharField(max_length=255, default="N/A")  # New field for company name
    attributes = models.TextField(blank=True, default="N/A")  # New field for job attributes

    def __str__(self):
        return self.title
