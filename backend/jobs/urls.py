from django.urls import path
from .views import ApplyJobView, JobView, MyApplicationsView, RecruiterApplicantsView, UpdateApplicationStatusView

urlpatterns = [

    path("",JobView.as_view(),name="job-list-create"),
    path("<int:pk>/",JobView.as_view(),name="job-detail"),
    path("apply/<int:job_id>/", ApplyJobView.as_view(), name="apply-job"),
    path("my-applications/", MyApplicationsView.as_view(), name="my-applications"),
    path("recruiter/jobs/<int:job_id>/applicants/",RecruiterApplicantsView.as_view(),name="recruiter-applicants"),
    path("applications/<int:application_id>/status/", UpdateApplicationStatusView.as_view(), name="update-application-status"),
]