from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static
from . import views

router = DefaultRouter()
router.register(r'jobs', views.JobViewSet)
router.register(r'resumes', views.ResumeViewSet)

urlpatterns = [
    path('', include(router.urls)),  # Base path for API should be set here
    path('upload_resume/', views.upload_resume, name='upload_resume'),
    path('interview_dates/', views.interview_dates, name='interview_dates'),
    path('jobs/<int:job_id>/interview_dates/<int:interview_index>/', views.delete_interview_date, name='delete_interview_date'),
    path('register/', views.register, name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
] 

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)