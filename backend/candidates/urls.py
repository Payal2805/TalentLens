from django.urls import path
from .views import CandidateDashboardStatsView, CandidateProfileView, ResumeDeleteView, ResumeListView, ResumeUploadView, SetDefaultResumeView

urlpatterns = [
    path("profile/", CandidateProfileView.as_view(), name="candidate-profile"),
    path("resume/upload/", ResumeUploadView.as_view(), name="resume-upload"),
    path("resumes/", ResumeListView.as_view(), name="resume-list"),
    path("resume/<int:pk>/", ResumeDeleteView.as_view(), name="resume-delete"),
    path("resume/<int:pk>/default/", SetDefaultResumeView.as_view(), name="resume-default"),
    path("dashboard/", CandidateDashboardStatsView.as_view(), name="candidate-dashboard"),
]
