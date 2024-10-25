from django.contrib import admin
from .models import JobListing, ResumeListing, Keyword

# JobListing Admin
class JobListingAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'location', 'attributes', 'date_posted', 'job_description')
    search_fields = ('title', 'company', 'location', 'attributes', 'date_posted', 'job_description')
    list_filter = ('title', 'company', 'location', 'date_posted')  # Removed job_description and attributes from filter

# ResumeListing Admin
class ResumeListingAdmin(admin.ModelAdmin):
    list_display = ('text',)
    search_fields = ('text',)
    list_filter = ('keywords',)  # Assuming you want to filter by keywords

# Keyword Admin
class KeywordAdmin(admin.ModelAdmin):
    list_display = ('words',)
    search_fields = ('words',)
    list_filter = ('words',)  # You can filter by keywords

# Register the models with the admin site
admin.site.register(JobListing, JobListingAdmin)
admin.site.register(ResumeListing, ResumeListingAdmin)
admin.site.register(Keyword, KeywordAdmin)
