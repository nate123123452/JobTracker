from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'jobs', views.JobViewSet)

urlpatterns = [
    path('', include(router.urls)),  # Base path for API should be set here
]
