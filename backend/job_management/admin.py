from django.contrib import admin
from .models import Resume, Job

# Resume Admin
class ResumeAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'upload_date', 'description', 'document')  # Columns to display
    search_fields = ('title', 'description')  # Fields to search by
    list_filter = ('upload_date',)  # Add filters on the right sidebar
    ordering = ('-upload_date',)  # Order by upload date, newest first

# Job Admin
class JobAdmin(admin.ModelAdmin):
    list_display = ('company', 'title', 'status', 'location', 'applied_date')  # Columns to display
    search_fields = ('company', 'title', 'status')  # Fields to search by
    list_filter = ('status', 'location')  # Add filters on the right sidebar
    ordering = ('-applied_date',)  # Order by applied date, newest first

# Register models to admin
admin.site.register(Resume, ResumeAdmin)
admin.site.register(Job, JobAdmin)
