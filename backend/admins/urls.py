from django.urls import path

from .views import (
    AdminChangePasswordView,
    AdminDashboardView,
    AdminUsersListView,
    AdminCandidatesListView,
    AdminCandidateStatusView,
    AdminRecruitersListView,
    AdminRecruiterStatusView,
    AdminJobsView,
    AdminJobStatusView,
    AdminApplicationsView,
    AdminProfileView
)

urlpatterns = [

    path(
        "dashboard/",
        AdminDashboardView.as_view(),
        name="admin-dashboard"
    ),

    path(
        "users/",
        AdminUsersListView.as_view(),
        name="admin-users"
    ),
    
    path(
        "candidates/",
        AdminCandidatesListView.as_view(),
        name="admin-candidates"
    ),
    
    path(
        "candidates/<int:candidate_id>/status/",
        AdminCandidateStatusView.as_view(),
        name="admin-candidate-status"
    ),
    
    path(
        "recruiters/",
        AdminRecruitersListView.as_view(),
        name="admin-recruiters"
    ),

    path(
        "recruiters/<int:recruiter_id>/status/",
        AdminRecruiterStatusView.as_view(),
        name="admin-recruiter-status"
    ),
    
    path(
        "jobs/",
        AdminJobsView.as_view(),
        name="admin-jobs"
    ),

    path(
        "jobs/<int:job_id>/status/",
        AdminJobStatusView.as_view(),
        name="admin-job-status"
    ),

    path(
        "applications/",
        AdminApplicationsView.as_view(),
        name="admin-applications"
    ),
    
    path(
        "profile/",
        AdminProfileView.as_view(),
        name="admin-profile"
    ),
    
    path(
        "change-password/",
        AdminChangePasswordView.as_view(),
        name="admin-change-password",
    ),
]