from django.contrib import admin
from .models import JobListing, ResumeListing, Job  # Import Job model

# JobListing Admin
class JobListingAdmin(admin.ModelAdmin):
    list_display = ('job_name', 'website', 'text',)
    search_fields = ('job_name', 'website', 'text',)
    list_filter = ('job_name', 'website', 'keywords')

# ResumeListing Admin
class ResumeListingAdmin(admin.ModelAdmin):
    list_display = ('text',)
    search_fields = ('text',)
    list_filter = ('keywords',)

# Job Admin
class JobAdmin(admin.ModelAdmin):
    list_display = ('company', 'title', 'status', 'location', 'applied_date')  # Display relevant fields
    search_fields = ('company', 'title', 'status')  # Allow searching by company, title, status
    list_filter = ('status', 'location')  # Filter by status and location
    ordering = ('-applied_date',)  # Sort by applied date, newest first

# Register the models with the admin site
admin.site.register(JobListing, JobListingAdmin)
admin.site.register(ResumeListing, ResumeListingAdmin)
admin.site.register(Job, JobAdmin)  # Register the Job model
