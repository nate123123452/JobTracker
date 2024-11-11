from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponseRedirect

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', lambda request: HttpResponseRedirect('/api/')),  # Redirect root path to /api/
    path('api/', include('scrape_jobs.urls')),  # Include URLs from the scrape_jobs app
]
