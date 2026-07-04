from django.urls import path
from .views import LoginView, RegisterView, CandidateDashboardView, RecruiterDashboardView, AdminDashboardView

urlpatterns = [
    path('register/', RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("candidate/dashboard/", CandidateDashboardView.as_view(), name="candidate-dashboard"),
    path("recruiter/dashboard/", RecruiterDashboardView.as_view(), name="recruiter-dashboard"),
    path("admin/dashboard/", AdminDashboardView.as_view(), name="admin-dashboard"),
]