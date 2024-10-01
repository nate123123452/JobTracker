from django.contrib import admin
from .models import JobListing

class JobListingAdmin(admin.ModelAdmin):
    # Define the fields to display in the admin list view
    list_display = ('title', 'company', 'location', 'salary', 'date_posted')

    # Add search fields to search for jobs based on these fields
    search_fields = ('title', 'company', 'location')

    # Add filters for quick filtering by company and date posted
    list_filter = ('company', 'location', 'date_posted')

# Register the model with the admin site
admin.site.register(JobListing, JobListingAdmin)
