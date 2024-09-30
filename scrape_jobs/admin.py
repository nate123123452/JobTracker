# scrape_jobs/admin.py

from django.contrib import admin
from .models import JobListing  # Import your model

# Register your model with the admin site
@admin.register(JobListing)
class JobListingAdmin(admin.ModelAdmin):
    list_display = ('title', 'location', 'date_posted')  # Fields to display in the list view
