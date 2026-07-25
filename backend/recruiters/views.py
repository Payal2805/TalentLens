from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count

from .models import RecruiterProfile
from jobs.models import Job, Application
from .serializers import RecruiterProfileSerializer

from accounts.permissions import IsRecruiter


class RecruiterProfileView(APIView):

    permission_classes = [IsAuthenticated, IsRecruiter]

    def get(self, request):

        try:
            profile = RecruiterProfile.objects.get(user=request.user)

        except RecruiterProfile.DoesNotExist:
            return Response(
                {"message": "Profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = RecruiterProfileSerializer(profile)

        return Response(serializer.data)

    def post(self, request):

        if RecruiterProfile.objects.filter(user=request.user).exists():

            return Response(
                {"message": "Profile already exists"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = RecruiterProfileSerializer(data=request.data)

        if serializer.is_valid():

            serializer.save(user=request.user)

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def put(self, request):

        try:
            profile = RecruiterProfile.objects.get(user=request.user)

        except RecruiterProfile.DoesNotExist:

            return Response(
                {"message": "Profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = RecruiterProfileSerializer(
            profile,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():

            serializer.save()

            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
        
class RecruiterDashboardStatsView(APIView):

    permission_classes = [IsAuthenticated, IsRecruiter]

    def get(self, request):

        try:
            recruiter = RecruiterProfile.objects.get(user=request.user)

        except RecruiterProfile.DoesNotExist:
            return Response(
                {
                    "message": "Recruiter profile not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        jobs = Job.objects.filter(recruiter=recruiter)
        
        top_jobs = jobs.annotate(
            total_applications=Count("applications")
        ).order_by("-total_applications")[:5]

        recent_jobs = jobs.order_by("-created_at")[:5]
        
        expiring_jobs = jobs.filter(
            is_active=True
        ).order_by("deadline")[:5]

        applications = Application.objects.filter(
            job__recruiter=recruiter
        )

        recent_applications = applications.select_related(
            "candidate",
            "candidate__user",
            "job"
        ).order_by("-applied_at")[:5]
        
        notifications = []
        
        # New Applications
        new_applications = applications.order_by("-applied_at")[:3]
        for app in new_applications:
            notifications.append({
                "type": "application",
                "message": f"{app.candidate.user.first_name or app.candidate.user.username} applied for {app.job.title}",
                "time": app.applied_at,
            })
        
        # Expiring Jobs
        for job in expiring_jobs:
            notifications.append({
                "type": "deadline",
                "message": f"{job.title} deadline is {job.deadline}",
                "time": job.deadline,
            })
        

        data = {
            "username": request.user.username,
            "company_name": recruiter.company_name,

            # Dashboard Stats
            "total_jobs": jobs.count(),
            "active_jobs": jobs.filter(is_active=True).count(),
            "inactive_jobs": jobs.filter(is_active=False).count(),

            "total_applications": applications.count(),

            "applied": applications.filter(
                status="APPLIED"
            ).count(),

            "under_review": applications.filter(
                status="UNDER_REVIEW"
            ).count(),

            "shortlisted": applications.filter(
                status="SHORTLISTED"
            ).count(),

            "hired": applications.filter(
                status="HIRED"
            ).count(),

            "rejected": applications.filter(
                status="REJECTED"
            ).count(),

            # Recent Jobs
            "recent_jobs": [
                {
                    "id": job.id, # type: ignore
                    "title": job.title,
                    "location": job.location,
                    "job_type": job.job_type,
                    "deadline": job.deadline,
                    "is_active": job.is_active,
                }
                for job in recent_jobs
            ],

            # Recent Applications
            "recent_applications": [
                {
                    "id": app.id, # type: ignore
                    "candidate": (
                        app.candidate.user.first_name
                        or app.candidate.user.username
                    ),
                    "job": app.job.title,
                    "status": app.status,
                    "applied_at": app.applied_at,
                }
                for app in recent_applications
            ],
            
            "expiring_jobs": [
                {
                    "id": job.id, # type: ignore
                    "title": job.title,
                    "deadline": job.deadline,
                    "location": job.location,
                }
                for job in expiring_jobs
            ],
            
            "top_jobs": [
                {
                    "id": job.id, # type: ignore
                    "title": job.title,
                    "applications": getattr(job, "total_applications", 0),
                }
                for job in top_jobs
            ],
            
            "notifications": notifications,
        }
        
        return Response(data, status=status.HTTP_200_OK)
    