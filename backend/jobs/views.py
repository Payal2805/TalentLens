from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import Job, Application
from .serializers import JobSerializer, ApplicationSerializer, RecruiterApplicationSerializer, ApplicationStatusSerializer
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

        if pk:

            try:
                job = Job.objects.get(pk=pk)

            except Job.DoesNotExist:
                return Response(
                    {"message": "Job not found."},
                    status=status.HTTP_404_NOT_FOUND
                )

            serializer = JobSerializer(job)

            return Response(serializer.data)

        jobs = Job.objects.filter(is_active=True)

        serializer = JobSerializer(
            jobs,
            many=True
        )

        return Response(serializer.data)

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
            serializer.save(
                candidate=candidate,
                job=job,
                resume=resume
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
        