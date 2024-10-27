from django.contrib import admin
from .models import JobListing, ResumeListing

# JobListing Admin
class JobListingAdmin(admin.ModelAdmin):
    list_display = ('job_name', 'website', 'text',)  # Display fields for JobListing
    search_fields = ('job_name', 'website', 'text',)  # Allow searching by these fields
    list_filter = ('job_name', 'website', 'keywords')  # Filter by job name, website, and keywords

# ResumeListing Admin
class ResumeListingAdmin(admin.ModelAdmin):
    list_display = ('text',)  # Display the text field
    search_fields = ('text',)  # Allow searching by text
    list_filter = ('keywords',)  # Allow filtering by keywords

# Register the models with the admin site
admin.site.register(JobListing, JobListingAdmin)
admin.site.register(ResumeListing, ResumeListingAdmin)
