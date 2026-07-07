from django.urls import path
from .views import JobApplicantsMatchView, JobParserView, MatchResumeJobView, ParsedResumeDetailView, ResumeTextExtractionView

urlpatterns = [
    path("extract-text/<int:resume_id>/", ResumeTextExtractionView.as_view(), name="extract-text"),
    path("parsed-resume/<int:resume_id>/", ParsedResumeDetailView.as_view(), name="parsed-resume"),
    path("parse-job/<int:job_id>/", JobParserView.as_view(), name="parse-job"),
    path("match/<int:resume_id>/<int:job_id>/", MatchResumeJobView.as_view(), name="match-resume-job"),
    path("job/<int:job_id>/matches/", JobApplicantsMatchView.as_view(), name="job-applicants-match"),
]