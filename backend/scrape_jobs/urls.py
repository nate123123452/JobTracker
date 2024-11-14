from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static
from . import views

router = DefaultRouter()
router.register(r'jobs', views.JobViewSet)
router.register(r'resumes', views.ResumeViewSet)

urlpatterns = [
    path('', include(router.urls)),  # Base path for API should be set here
    path('upload_resume/', views.upload_resume, name='upload_resume')
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)