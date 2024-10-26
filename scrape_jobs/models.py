from django.db import models

class Keyword(models.Model):
    words = models.CharField(max_length=255)

    def __str__(self):
        return self.words

class JobListing(models.Model):
    job_name = models.CharField(max_length=255, default = 'N/A')
    website = models.URLField( default = 'N/A')
    text = models.TextField( default = 'N/A')
    keywords = models.ManyToManyField(Keyword, related_name='job_listings')   
    def __str__(self):
        return self.job_name

class ResumeListing(models.Model):
    text = models.TextField( default = 'N/A')
    keywords = models.ManyToManyField(Keyword, related_name='resume_listings')

    def __str__(self):
        return self.text[:50]