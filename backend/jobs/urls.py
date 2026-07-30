from django.urls import path
from .views import ApplyJobView, JobView, MyApplicationsView, RecruiterApplicantsView, RecruiterJobsView, UpdateApplicationStatusView, RecruiterApplicantDetailView,ScheduleInterviewAPIView, RecruiterInterviewListAPIView, ExportInterviewCSVAPIView, UpdateInterviewStatusAPIView

urlpatterns = [

    path("",JobView.as_view(),name="job-list-create"),
    path("<int:pk>/",JobView.as_view(),name="job-detail"),
    path("apply/<int:job_id>/", ApplyJobView.as_view(), name="apply-job"),
    path("my-applications/", MyApplicationsView.as_view(), name="my-applications"),
    path("recruiter/my-jobs/", RecruiterJobsView.as_view(), name="recruiter-my-jobs"),
    path("recruiter/jobs/<int:job_id>/applicants/",RecruiterApplicantsView.as_view(),name="recruiter-applicants"),
    path("applications/<int:application_id>/status/", UpdateApplicationStatusView.as_view(), name="update-application-status"),
    path("applications/<int:application_id>/",RecruiterApplicantDetailView.as_view(),name="recruiter-application-detail"),
    path("interviews/schedule/",ScheduleInterviewAPIView.as_view()),
    path("recruiter/interviews/", RecruiterInterviewListAPIView.as_view(),name="recruiter-interviews"),
    path("recruiter/interviews/export/", ExportInterviewCSVAPIView.as_view(), name="export-interviews-csv"),
    path("interviews/<int:interview_id>/status/", UpdateInterviewStatusAPIView.as_view()),
]