from django.db import models

class JobListing(models.Model):
    title = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    description = models.TextField()
    date_posted = models.DateField()
    salary = models.CharField(max_length=100)
    company = models.CharField(max_length=255, default = "N/A")  # New field for company name
    

    def __str__(self):
        return self.title
