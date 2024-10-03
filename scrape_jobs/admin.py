from django.contrib import admin
from .models import JobListing

class JobListingAdmin(admin.ModelAdmin):
    # Define the fields to display in the admin list view
    list_display = ('title', 'company', 'location', 'attributes', 'date_posted', 'job_description')

    # Add search fields to search for jobs based on these fields
    search_fields = ('title', 'company', 'location', 'attributes', 'date_posted', 'job_description')

    # Add filters for quick filtering by company and date posted
    list_filters = ('title', 'company', 'location', 'attributes', 'date_posted', 'job_description')

# Register the model with the admin site
admin.site.register(JobListing, JobListingAdmin)
