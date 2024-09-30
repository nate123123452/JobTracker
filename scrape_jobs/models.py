from django.db import models

class JobListing(models.Model):
    title = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    location = models.CharField(max_length=100)
    description = models.TextField()
    date_posted = models.DateField()

    def __str__(self):
        return self.title
