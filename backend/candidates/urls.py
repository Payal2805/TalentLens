from django.urls import path
from .views import CandidateProfileView, ResumeDeleteView, ResumeListView, ResumeUploadView

urlpatterns = [
    path("profile/", CandidateProfileView.as_view(), name="candidate-profile"),
    path("resume/upload/", ResumeUploadView.as_view(), name="resume-upload"),
    path("resumes/", ResumeListView.as_view(), name="resume-list"),
    path("resume/<int:pk>/", ResumeDeleteView.as_view(), name="resume-delete"),
]
