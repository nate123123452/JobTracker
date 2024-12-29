from django.contrib import admin
from .models import Resume, Job

class ResumeAdmin(admin.ModelAdmin):
    '''Admin View for Resume'''
    list_display = ('title', 'user', 'upload_date', 'description', 'document')
    search_fields = ('title', 'description') 
    list_filter = ('upload_date',)
    ordering = ('-upload_date',)

class JobAdmin(admin.ModelAdmin):
    '''Admin View for Job'''
    list_display = ('company', 'title', 'status', 'location', 'applied_date') 
    search_fields = ('company', 'title', 'status')  
    list_filter = ('status', 'location') 
    ordering = ('-applied_date',) 

# Register models to admin
admin.site.register(Resume, ResumeAdmin)
admin.site.register(Job, JobAdmin)
