from django.urls import path
from .views import RecruiterDashboardStatsView, RecruiterProfileView

urlpatterns = [
    path("profile/", RecruiterProfileView.as_view(), name="recruiter-profile"),
    path("dashboard/", RecruiterDashboardStatsView.as_view(), name="recruiter-dashboard"),
]