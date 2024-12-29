from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponseRedirect
from django.conf import settings
from django.conf.urls.static import static

# Define the URL patterns for the project
urlpatterns = [
    # Admin site url
    path('admin/', admin.site.urls),

    # Redirect root path to /api/
    path('', lambda request: HttpResponseRedirect('/api/')),  

     # Include URLs from the job_management app
    path('api/', include('job_management.urls')), 
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)