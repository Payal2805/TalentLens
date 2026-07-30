from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from django.core.mail import send_mail
from django.conf import settings
import csv
from django.http import HttpResponse

from .pagination import JobPagination
from .models import Job, Application, Interview
from .serializers import JobSerializer, ApplicationSerializer, RecruiterApplicationSerializer, ApplicationStatusSerializer, InterviewSerializer, RecruiterInterviewSerializer, InterviewStatusSerializer
from notifications.services import create_notification
from django.utils import timezone

from candidates.models import CandidateProfile, Resume
from recruiters.models import RecruiterProfile
from accounts.permissions import IsCandidate, IsRecruiter


class JobView(APIView):

    permission_classes = [IsAuthenticated]

    # -------------------------
    # Create Job
    # -------------------------
    def post(self, request):

        if request.user.role != "RECRUITER":
            return Response(
                {"message": "Only recruiters can create jobs."},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            recruiter = RecruiterProfile.objects.get(user=request.user)

        except RecruiterProfile.DoesNotExist:
            return Response(
                {"message": "Recruiter profile not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = JobSerializer(data=request.data)

        if serializer.is_valid():

            serializer.save(recruiter=recruiter)

            return Response(
                {
                    "message": "Job created successfully.",
                    "data": serializer.data
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    # -------------------------
    # Get Jobs
    # -------------------------
    def get(self, request, pk=None):

        # Get Single Job
        if pk:

            try:
                job = Job.objects.get(pk=pk)

            except Job.DoesNotExist:
                return Response(
                    {
                        "message": "Job not found."
                    },
                    status=status.HTTP_404_NOT_FOUND
                )

            serializer = JobSerializer(job)

            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )

        # Get Active Jobs
        jobs = Job.objects.filter(
            is_active=True
        )

        # -------------------------
        # Search
        # -------------------------
        search = request.query_params.get("search")

        if search:
            jobs = jobs.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(skills_required__icontains=search)
            )

        # -------------------------
        # Location Filter
        # -------------------------
        location = request.query_params.get("location")

        if location:
            jobs = jobs.filter(
                location__icontains=location
            )

        # -------------------------
        # Job Type Filter
        # -------------------------
        job_type = request.query_params.get("job_type")

        if job_type:
            jobs = jobs.filter(
                job_type=job_type
            )

        # -------------------------
        # Experience Filter
        # -------------------------
        experience = request.query_params.get("experience")

        if experience:
            jobs = jobs.filter(
                experience=experience
            )

        # Latest Jobs First
        jobs = jobs.order_by("-created_at")

        # -------------------------
        # Pagination
        # -------------------------
        paginator = JobPagination()

        paginated_jobs = paginator.paginate_queryset(
            jobs,
            request
        )

        serializer = JobSerializer(
            paginated_jobs,
            many=True
        )

        return paginator.get_paginated_response(
            serializer.data
        )


    # -------------------------
    # Update Job
    # -------------------------
    def put(self, request, pk):

        if request.user.role != "RECRUITER":
            return Response(
                {"message": "Only recruiters can update jobs."},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            recruiter = RecruiterProfile.objects.get(user=request.user)

        except RecruiterProfile.DoesNotExist:
            return Response(
                {"message": "Recruiter profile not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            job = Job.objects.get(
                pk=pk,
                recruiter=recruiter
            )

        except Job.DoesNotExist:
            return Response(
                {"message": "Job not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = JobSerializer(
            job,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():

            serializer.save()

            return Response(
                {
                    "message": "Job updated successfully.",
                    "data": serializer.data
                }
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    # -------------------------
    # Delete Job
    # -------------------------
    def delete(self, request, pk):

        if request.user.role != "RECRUITER":
            return Response(
                {"message": "Only recruiters can delete jobs."},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            recruiter = RecruiterProfile.objects.get(user=request.user)

        except RecruiterProfile.DoesNotExist:
            return Response(
                {"message": "Recruiter profile not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            job = Job.objects.get(
                pk=pk,
                recruiter=recruiter
            )

        except Job.DoesNotExist:
            return Response(
                {"message": "Job not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        job.delete()

        return Response(
            {"message": "Job deleted successfully."},
            status=status.HTTP_200_OK
        )
        
class ApplyJobView(APIView):

    permission_classes = [IsAuthenticated, IsCandidate]

    def post(self, request, job_id):

        # Step 1: Get Candidate Profile
        try:
            candidate = CandidateProfile.objects.get(user=request.user)
        except CandidateProfile.DoesNotExist:
            return Response(
                {"message": "Candidate profile not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Step 2: Get Job
        try:
            job = Job.objects.get(id=job_id)
        except Job.DoesNotExist:
            return Response(
                {"message": "Job not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Step 3: Check Job Status
        if not job.is_active:
            return Response(
                {"message": "This job is no longer active."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Step 4: Check Deadline
        if job.deadline < timezone.now().date():
            return Response(
                {"message": "Application deadline has passed."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Step 5: Resume Validation
        resume_id = request.data.get("resume")

        if not resume_id:
            return Response(
                {"message": "Resume is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            resume = Resume.objects.get(
                id=resume_id,
                candidate=candidate
            )
        except Resume.DoesNotExist:
            return Response(
                {"message": "Invalid resume selected."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Step 6: Duplicate Application Check
        if Application.objects.filter(
            job=job,
            candidate=candidate
        ).exists():
            return Response(
                {"message": "You have already applied for this job."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Step 7: Create Application
        serializer = ApplicationSerializer(data=request.data)

        if serializer.is_valid():

            application = serializer.save(
                candidate=candidate,
                job=job,
                resume=resume
            )

            create_notification(
                recipient=job.recruiter.user,
                title="New Job Application",
                message=f"{candidate.user.username} applied for '{job.title}'.",
                notification_type="APPLICATION"
            )

            return Response(
                {
                    "message": "Application submitted successfully.",
                    "data": serializer.data
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
                
class MyApplicationsView(APIView):

    permission_classes = [IsAuthenticated, IsCandidate]

    def get(self, request):

        try:
            candidate = CandidateProfile.objects.get(
                user=request.user
            )

        except CandidateProfile.DoesNotExist:

            return Response(
                {
                    "message": "Candidate profile not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        applications = Application.objects.filter(
            candidate=candidate
        ).select_related(
            "job",
            "job__recruiter",
            "resume"
        )

        serializer = ApplicationSerializer(
            applications,
            many=True
        )

        return Response(
            {
                "count": applications.count(),
                "applications": serializer.data
            },
            status=status.HTTP_200_OK
        )
   
class RecruiterApplicantsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, job_id):

        # Step 1: Recruiter Profile Check
        try:
            recruiter = RecruiterProfile.objects.get(user=request.user)

        except RecruiterProfile.DoesNotExist:
            return Response(
                {
                    "message": "Recruiter profile not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # Step 2: Job Check
        try:
            job = Job.objects.get(
                id=job_id,
                recruiter=recruiter
            )

        except Job.DoesNotExist:
            return Response(
                {
                    "message": "Job not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # Step 3: Get Applicants
        applications = Application.objects.filter(
            job=job
        ).select_related(
            "candidate__user",
            "resume"
        )

        serializer = RecruiterApplicationSerializer(
            applications,
            many=True
        )

        return Response(
            {
                "job": job.title,
                "total_applicants": applications.count(),
                "applications": serializer.data
            },
            status=status.HTTP_200_OK
        )     
        
class UpdateApplicationStatusView(APIView):

    permission_classes = [IsAuthenticated, IsRecruiter]

    def patch(self, request, application_id):

        try:
            recruiter = RecruiterProfile.objects.get(user=request.user)
        except RecruiterProfile.DoesNotExist:
            return Response(
                {"message": "Recruiter profile not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            application = Application.objects.get(
                id=application_id,
                job__recruiter=recruiter
            )
        except Application.DoesNotExist:
            return Response(
                {"message": "Application not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ApplicationStatusSerializer(
            application,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()

            # -------------------------
            # Create Candidate Notification
            # -------------------------

            status_messages = {
                "UNDER_REVIEW": (
                    "Application Under Review",
                    f"Your application for '{application.job.title}' is now under review."
                ),
                "SHORTLISTED": (
                    "Application Shortlisted",
                    f"Congratulations! You have been shortlisted for '{application.job.title}'."
                ),
                "REJECTED": (
                    "Application Rejected",
                    f"Your application for '{application.job.title}' has been rejected."
                ),
                "HIRED": (
                    "Congratulations!",
                    f"Congratulations! You have been selected for '{application.job.title}'."
                ),
            }

            if application.status in status_messages:

                title, message = status_messages[application.status]

                create_notification(
                    recipient=application.candidate.user,
                    title=title,
                    message=message,
                    notification_type=application.status
                )

            return Response(
                {
                    "message": "Application status updated successfully.",
                    "data": serializer.data
                },
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
        
class RecruiterJobsView(APIView):

    permission_classes = [IsAuthenticated, IsRecruiter]

    def get(self, request):

        try:
            recruiter = RecruiterProfile.objects.get(user=request.user)

        except RecruiterProfile.DoesNotExist:
            return Response(
                {"message": "Recruiter profile not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        jobs = Job.objects.filter(
            recruiter=recruiter
        ).order_by("-created_at")

        serializer = JobSerializer(
            jobs,
            many=True
        )

        return Response(serializer.data)
    
class RecruiterApplicantDetailView(APIView):

    permission_classes = [IsAuthenticated, IsRecruiter]

    def get(self, request, application_id):

        try:
            recruiter = RecruiterProfile.objects.get(user=request.user)
        except RecruiterProfile.DoesNotExist:
            return Response(
                {"message": "Recruiter profile not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            application = Application.objects.select_related(
                "candidate__user",
                "resume",
                "job"
            ).get(
                id=application_id,
                job__recruiter=recruiter
            )
        except Application.DoesNotExist:
            return Response(
                {"message": "Application not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        candidate = application.candidate

        return Response({
            "application_id": application.id, # type: ignore
            "job_id": application.job.id, # type: ignore
            "status": application.status,
            "applied_at": application.applied_at,

            "candidate": {
                "id": candidate.id, # type: ignore
                "name": candidate.user.get_full_name() or candidate.user.username,
                "email": candidate.user.email,
                "phone": candidate.phone_number,
                "address": candidate.address,
                "skills": candidate.skills,
                "education": candidate.highest_education,
                "experience": candidate.experience_years,
                "linkedin": candidate.linkedin_url,
                "github": candidate.github_url,
                "portfolio": candidate.portfolio_url,
            },

            "resume": {
                "id": application.resume.id, # type: ignore
                "title": application.resume.resume_title,
                "file": application.resume.resume_file.url,
            }
        })


class ScheduleInterviewAPIView(APIView):

    permission_classes = [IsAuthenticated, IsRecruiter]

    def post(self, request):

        application_id = request.data.get("application")

        try:
            application = Application.objects.get(id=application_id)

        except Application.DoesNotExist:
            return Response(
                {"error": "Application not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = InterviewSerializer(data=request.data)

        if serializer.is_valid():

            interview: Interview = serializer.save()  # type: ignore

            candidate = application.candidate.user
            job = application.job

            # -------------------------
            # Format Date & Time
            # -------------------------

            interview_date = interview.interview_date.strftime("%d %B %Y")
            interview_time = interview.interview_time.strftime("%I:%M %p")

            # -------------------------
            # Email Message
            # -------------------------

            message = f"""
Hello {candidate.get_full_name() or candidate.username},

Congratulations!

Your interview has been scheduled.

Job Title: {job.title}

Interview Date: {interview_date}

Interview Time: {interview_time}

Interview Mode: {interview.interview_mode}
"""

            # Online Interview
            if interview.interview_mode == "ONLINE":

                message += f"""

Meeting Link:
{interview.meeting_link}
"""

            # Offline Interview
            else:

                message += """

Interview Location:
Company Office
"""

            # Notes (Optional)
            if interview.notes:

                message += f"""

Interview Notes:
{interview.notes}
"""

            # Closing
            message += """

Best of Luck!

Recruitment Team
"""

            # -------------------------
            # Send Email
            # -------------------------

            send_mail(
                subject="Interview Scheduled",
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[candidate.email],
                fail_silently=False,
            )

            return Response(
                {
                    "message": "Interview scheduled successfully.",
                    "data": serializer.data,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )
    
class RecruiterInterviewListAPIView(APIView):

    permission_classes = [IsAuthenticated, IsRecruiter]

    def get(self, request):

        try:
            recruiter = RecruiterProfile.objects.get(user=request.user)

        except RecruiterProfile.DoesNotExist:
            return Response(
                {"message": "Recruiter profile not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        interviews = Interview.objects.filter(
            application__job__recruiter=recruiter
        ).select_related(
            "application__candidate__user",
            "application__job"
        ).order_by("-interview_date", "-interview_time")

        serializer = RecruiterInterviewSerializer(
            interviews,
            many=True
        )

        return Response(serializer.data)    
                 
class ExportInterviewCSVAPIView(APIView):

    permission_classes = [IsAuthenticated, IsRecruiter]

    def get(self, request):

        try:
            recruiter = RecruiterProfile.objects.get(user=request.user)
        except RecruiterProfile.DoesNotExist:
            return Response(
                {"message": "Recruiter not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        interviews = Interview.objects.filter(
            application__job__recruiter=recruiter
        ).select_related(
            "application__candidate__user",
            "application__job"
        )

        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = 'attachment; filename="interviews.csv"'

        writer = csv.writer(response)

        writer.writerow([
            "Candidate",
            "Email",
            "Job",
            "Date",
            "Time",
            "Mode",
            "Status"
        ])

        for interview in interviews:
            writer.writerow([
                interview.application.candidate.user.get_full_name()
                or interview.application.candidate.user.username,
                interview.application.candidate.user.email,
                interview.application.job.title,
                interview.interview_date,
                interview.interview_time,
                interview.interview_mode,
                interview.status,
            ])

        return response
    
class UpdateInterviewStatusAPIView(APIView):

    permission_classes = [IsAuthenticated, IsRecruiter]

    def patch(self, request, interview_id):

        try:
            recruiter = RecruiterProfile.objects.get(user=request.user)

        except RecruiterProfile.DoesNotExist:
            return Response(
                {"message": "Recruiter profile not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            interview = Interview.objects.get(
                id=interview_id,
                application__job__recruiter=recruiter
            )

        except Interview.DoesNotExist:
            return Response(
                {"message": "Interview not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = InterviewStatusSerializer(
            interview,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():

            serializer.save()

            create_notification(
                recipient=interview.application.candidate.user,
                title="Interview Status Updated",
                message=f"Your interview for '{interview.application.job.title}' is now {interview.status}.",
                notification_type="INTERVIEW"
            )

            return Response(
                {
                    "message": "Interview status updated successfully.",
                    "data": serializer.data
                }
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
        