from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate

from accounts.permissions import IsAdmin

from accounts.models import User
from candidates.models import CandidateProfile
from recruiters.models import RecruiterProfile
from jobs.models import Job, Application


class AdminDashboardView(APIView):

    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):

        recent_applications = (
            Application.objects
            .select_related(
                "candidate__user",
                "job",
            )
            .order_by("-applied_at")[:5]
        )  
        
        recent_users = (
            User.objects
            .order_by("-date_joined")[:5]
        )

        data = {

            "username": request.user.username,

            # -------------------------
            # Platform Statistics
            # -------------------------

            "total_users": User.objects.count(),

            "total_candidates": CandidateProfile.objects.count(),

            "total_recruiters": RecruiterProfile.objects.count(),

            # -------------------------
            # Job Statistics
            # -------------------------

            "total_jobs": Job.objects.count(),

            "active_jobs": Job.objects.filter(
                is_active=True
            ).count(),

            "closed_jobs": Job.objects.filter(
                is_active=False
            ).count(),

            # -------------------------
            # Application Statistics
            # -------------------------

            "total_applications": Application.objects.count(),

            "applied": Application.objects.filter(
                status="APPLIED"
            ).count(),

            "under_review": Application.objects.filter(
                status="UNDER_REVIEW"
            ).count(),

            "shortlisted": Application.objects.filter(
                status="SHORTLISTED"
            ).count(),

            "rejected": Application.objects.filter(
                status="REJECTED"
            ).count(),

            "hired": Application.objects.filter(
                status="HIRED"
            ).count(),

            # -------------------------
            # Recent Applications
            # -------------------------

            "recent_applications": [

                {
                    "id": application.id,  # type: ignore

                    "candidate_name": (
                        application.candidate.user.get_full_name()
                        or application.candidate.user.username
                    ),

                    "job_title": application.job.title,

                    "status": application.status,

                    "applied_at": application.applied_at,
                }

                for application in recent_applications
            ],
            
            "recent_users": [
                {
                    "id": user.id,  # type: ignore
                    "username": user.username,
                    "email": user.email,
                    "role": user.role,
                    "date_joined": user.date_joined,
                }
                for user in recent_users
            ],
        }

        return Response(
            data
        )

class AdminUsersListView(APIView):

    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):

        users = (
            User.objects
            .all()
            .order_by("-date_joined")
        )

        data = [

            {
                "id": user.id,  # type: ignore
                "username": user.username,
                "email": user.email,
                "role": user.role,
                "is_active": user.is_active,
                "date_joined": user.date_joined,
            }

            for user in users
        ]

        return Response(
            {
                "total_users": len(data),
                "users": data,
            }
        )
        
class AdminCandidatesListView(APIView):

    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):

        candidates = (
            CandidateProfile.objects
            .select_related("user")
            .order_by("-user__date_joined")
        )

        candidate_list = []

        for candidate in candidates:

            applications_count = Application.objects.filter(
                candidate=candidate
            ).count()

            candidate_list.append({

                "id": candidate.id,  # type: ignore

                "user_id": candidate.user.id,  # type: ignore

                "username": candidate.user.username,

                "email": candidate.user.email,

                "full_name": (
                    candidate.user.get_full_name()
                    or candidate.user.username
                ),

                "is_active": candidate.user.is_active,

                "date_joined": candidate.user.date_joined,

                "applications_count": applications_count,

            })

        return Response({

            "total_candidates": len(candidate_list),

            "candidates": candidate_list,

        })
        
class AdminCandidateStatusView(APIView):

    permission_classes = [IsAuthenticated, IsAdmin]

    def patch(self, request, candidate_id):

        try:
            candidate = (
                CandidateProfile.objects
                .select_related("user")
                .get(id=candidate_id)
            )

        except CandidateProfile.DoesNotExist:

            return Response(
                {
                    "detail": "Candidate not found."
                },
                status=404
            )

        user = candidate.user

        user.is_active = not user.is_active

        user.save(update_fields=["is_active"])

        return Response(
            {
                "message": (
                    "Candidate activated successfully."
                    if user.is_active
                    else "Candidate deactivated successfully."
                ),

                "candidate": {
                    "id": candidate.id, # type: ignore
                    "user_id": user.id, # type: ignore
                    "username": user.username,
                    "is_active": user.is_active,
                }
            },
            status=200
        )
        
class AdminRecruitersListView(APIView):

    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):

        recruiters = (
            RecruiterProfile.objects
            .select_related("user")
            .order_by("-user__date_joined")
        )

        recruiter_list = []

        for recruiter in recruiters:

            jobs_count = Job.objects.filter(
                recruiter=recruiter
            ).count()

            active_jobs_count = Job.objects.filter(
                recruiter=recruiter,
                is_active=True
            ).count()

            recruiter_list.append({

                "id": recruiter.id,  # type: ignore

                "user_id": recruiter.user.id,  # type: ignore

                "username": recruiter.user.username,

                "email": recruiter.user.email,

                "full_name": (
                    recruiter.user.get_full_name()
                    or recruiter.user.username
                ),

                "company_name": recruiter.company_name,

                "is_active": recruiter.user.is_active,

                "date_joined": recruiter.user.date_joined,

                "jobs_count": jobs_count,

                "active_jobs_count": active_jobs_count,

            })

        return Response({

            "total_recruiters": len(recruiter_list),

            "recruiters": recruiter_list,

        })
        
class AdminRecruiterStatusView(APIView):

    permission_classes = [IsAuthenticated, IsAdmin]

    def patch(self, request, recruiter_id):

        try:
            recruiter = (
                RecruiterProfile.objects
                .select_related("user")
                .get(id=recruiter_id)
            )

        except RecruiterProfile.DoesNotExist:

            return Response(
                {
                    "detail": "Recruiter not found."
                },
                status=404
            )

        user = recruiter.user

        user.is_active = not user.is_active

        user.save(update_fields=["is_active"])

        return Response(
            {
                "message": (
                    "Recruiter activated successfully."
                    if user.is_active
                    else "Recruiter deactivated successfully."
                ),

                "recruiter": {

                    "id": recruiter.id,  # type: ignore

                    "user_id": user.id,  # type: ignore

                    "username": user.username,

                    "is_active": user.is_active,

                }
            },
            status=200
        )
               
class AdminJobsView(APIView):

    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):

        jobs = Job.objects.all().order_by("-id")

        job_list = []

        for job in jobs:

            applications_count = Application.objects.filter(
                job=job
            ).count()

            job_list.append({
                "id": job.id, # type: ignore
                "title": job.title,

                "recruiter": (
                    job.recruiter.user.username
                    if job.recruiter
                    else None
                ),

                "company": (
                    job.recruiter.company_name
                    if job.recruiter
                    else None
                ),

                "is_active": job.is_active,

                "applications_count": applications_count,

                "created_at": job.created_at,
            })

        data = {

            "total_jobs": jobs.count(),

            "active_jobs": jobs.filter(
                is_active=True
            ).count(),

            "closed_jobs": jobs.filter(
                is_active=False
            ).count(),

            "jobs": job_list,
        }

        return Response(
            data,
            status=200
        )
             
class AdminJobStatusView(APIView):
    
    permission_classes = [IsAuthenticated, IsAdmin]

    def patch(self, request, job_id):

        try:
            job = Job.objects.get(id=job_id)

        except Job.DoesNotExist:
            return Response(
                {
                    "detail": "Job not found."
                },
                status=404
            )

        # Toggle job status
        job.is_active = not job.is_active
        job.save(update_fields=["is_active"])

        return Response(
            {
                "message": (
                    "Job activated successfully."
                    if job.is_active
                    else "Job closed successfully."
                ),
                "job": {
                    "id": job.id, # type: ignore
                    "title": job.title,
                    "is_active": job.is_active,
                }
            },
            status=200
        )
 
class AdminApplicationsView(APIView):

    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):

        applications = (
            Application.objects
            .select_related(
                "candidate__user",
                "job__recruiter__user",
            )
            .order_by("-applied_at")
        )

        application_list = []

        for application in applications:

            candidate_name = (
                application.candidate.user.get_full_name()
                or application.candidate.user.username
            )

            recruiter = None
            company = None

            if application.job.recruiter:

                recruiter = (
                    application.job.recruiter.user.username
                )

                company = (
                    application.job.recruiter.company_name
                )

            application_list.append({

                "id": application.id, # type: ignore

                "candidate_name": candidate_name,

                "candidate_email": (
                    application.candidate.user.email
                ),

                "job_title": application.job.title,

                "recruiter": recruiter,

                "company": company,

                "status": application.status,

                "applied_at": application.applied_at,
            })

        return Response({

            "total_applications": len(
                application_list
            ),

            "applications": application_list,

        })   
        
class AdminProfileView(APIView):

    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):

        user = request.user

        return Response({
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,

            # Account Information
            "role": user.role,
            "is_active": user.is_active,
            "is_staff": user.is_staff,
            "is_superuser": user.is_superuser,

            # Security / Login Information
            "last_login": user.last_login,
            "date_joined": user.date_joined,
        })

    def patch(self, request):

        user = request.user

        username = request.data.get("username")
        email = request.data.get("email")
        first_name = request.data.get("first_name")
        last_name = request.data.get("last_name")

        # -----------------------------------------
        # Username
        # -----------------------------------------

        if username is not None:

            username = username.strip()

            if not username:
                return Response(
                    {
                        "detail": "Username cannot be empty."
                    },
                    status=400
                )

            if User.objects.filter(
                username=username
            ).exclude(id=user.id).exists():

                return Response(
                    {
                        "detail": "Username already exists."
                    },
                    status=400
                )

            user.username = username

        # -----------------------------------------
        # Email
        # -----------------------------------------

        if email is not None:

            email = email.strip()

            if not email:
                return Response(
                    {
                        "detail": "Email cannot be empty."
                    },
                    status=400
                )

            if User.objects.filter(
                email=email
            ).exclude(id=user.id).exists():

                return Response(
                    {
                        "detail": "Email already exists."
                    },
                    status=400
                )

            user.email = email

        # -----------------------------------------
        # First Name
        # -----------------------------------------

        if first_name is not None:

            user.first_name = first_name.strip()

        # -----------------------------------------
        # Last Name
        # -----------------------------------------

        if last_name is not None:

            user.last_name = last_name.strip()

        # -----------------------------------------
        # Save
        # -----------------------------------------

        user.save()

        return Response({

            "message": "Profile updated successfully.",

            "username": user.username,

            "email": user.email,

            "first_name": user.first_name,

            "last_name": user.last_name,

            "role": user.role,

            "is_active": user.is_active,

            "is_staff": user.is_staff,

            "is_superuser": user.is_superuser,

            "last_login": user.last_login,

            "date_joined": user.date_joined,
        })
                           
class AdminChangePasswordView(APIView):

    permission_classes = [IsAuthenticated, IsAdmin]

    def patch(self, request):

        current_password = request.data.get(
            "current_password"
        )

        new_password = request.data.get(
            "new_password"
        )

        if not current_password:
            return Response(
                {
                    "detail": "Current password is required."
                },
                status=400
            )

        if not new_password:
            return Response(
                {
                    "detail": "New password is required."
                },
                status=400
            )

        user = request.user

        # Check current password

        if not user.check_password(current_password):
            return Response(
                {
                    "detail": "Current password is incorrect."
                },
                status=400
            )

        # Prevent same password

        if user.check_password(new_password):
            return Response(
                {
                    "detail": (
                        "New password must be different "
                        "from the current password."
                    )
                },
                status=400
            )

        # Set new password securely

        user.set_password(new_password)

        user.save(
            update_fields=["password"]
        )

        return Response(
            {
                "message": (
                    "Password changed successfully."
                )
            },
            status=200
        )
        