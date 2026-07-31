from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

from .models import CandidateProfile, Resume
from jobs.models import Application, Interview
from ai_engine.models import ParsedResume
from .serializers import CandidateProfileSerializer, ResumeSerializer

from accounts.permissions import IsCandidate

class CandidateProfileView(APIView):

    permission_classes = [IsAuthenticated, IsCandidate]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        try:
            profile = CandidateProfile.objects.get(user=request.user)
            serializer = CandidateProfileSerializer(profile)
            return Response(serializer.data)

        except CandidateProfile.DoesNotExist:
            return Response(
                {"message": "Profile not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

    def post(self, request):

        if CandidateProfile.objects.filter(user=request.user).exists():
            return Response(
                {"message": "Profile already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = CandidateProfileSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user)

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

    def put(self, request):

        try:
            profile = CandidateProfile.objects.get(user=request.user)

        except CandidateProfile.DoesNotExist:
            return Response(
                {"message": "Profile not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = CandidateProfileSerializer(
            profile,
            data=request.data,
            partial=True,
        )

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )
        
class ResumeUploadView(APIView):

    permission_classes = [IsAuthenticated, IsCandidate]

    def post(self, request):

        try:
            candidate = CandidateProfile.objects.get(user=request.user)

        except CandidateProfile.DoesNotExist:
            return Response(
                {"message": "Please create your profile first."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ResumeSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(candidate=candidate)

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
        
class ResumeListView(APIView):

    permission_classes = [IsAuthenticated, IsCandidate]

    def get(self, request):

        try:
            candidate = CandidateProfile.objects.get(user=request.user)

        except CandidateProfile.DoesNotExist:
            return Response(
                {"message": "Candidate profile not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        resumes = Resume.objects.filter(candidate=candidate)

        serializer = ResumeSerializer(
            resumes,
            many=True
        )

        return Response(serializer.data)
    
class ResumeDeleteView(APIView):

    permission_classes = [IsAuthenticated, IsCandidate]

    def delete(self, request, pk):

        try:
            candidate = CandidateProfile.objects.get(user=request.user)

        except CandidateProfile.DoesNotExist:
            return Response(
                {"message": "Candidate profile not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            resume = Resume.objects.get(
                id=pk,
                candidate=candidate
            )

        except Resume.DoesNotExist:
            return Response(
                {"message": "Resume not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        resume.delete()

        return Response(
            {"message": "Resume deleted successfully."},
            status=status.HTTP_200_OK
        )
        
class SetDefaultResumeView(APIView):

    permission_classes = [IsAuthenticated, IsCandidate]

    def patch(self, request, pk):

        try:
            candidate = CandidateProfile.objects.get(user=request.user)

        except CandidateProfile.DoesNotExist:
            return Response(
                {"message": "Candidate profile not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            resume = Resume.objects.get(
                id=pk,
                candidate=candidate
            )

        except Resume.DoesNotExist:
            return Response(
                {"message": "Resume not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        Resume.objects.filter(
            candidate=candidate
        ).update(is_default=False)

        resume.is_default = True
        resume.save()

        return Response(
            {"message": "Default resume updated successfully."},
            status=status.HTTP_200_OK
        )

def calculate_ats_score(candidate, parsed_resume):

    score = 0

    # Skills (40)
    score += min(len(parsed_resume.skills) * 5, 40)

    # Education (15)
    if parsed_resume.education:
        score += 15

    # Experience (20)
    if parsed_resume.experience:
        score += 20

    # LinkedIn (5)
    if candidate.linkedin_url:
        score += 5

    # GitHub / Portfolio (5)
    if candidate.github_url or candidate.portfolio_url:
        score += 5

    # Resume Parsed (5)
    if parsed_resume.raw_text:
        score += 5

    # Contact Details (10)
    if candidate.phone_number:
        score += 5

    if candidate.city:
        score += 5

    return min(score, 100)

class CandidateDashboardStatsView(APIView):

    permission_classes = [IsAuthenticated, IsCandidate]

    def get(self, request):

        try:
            candidate = CandidateProfile.objects.get(user=request.user)

        except CandidateProfile.DoesNotExist:
            return Response(
                {
                    "message": "Candidate profile not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        applications = Application.objects.filter(candidate=candidate)

        recent_applications = (
            applications
            .select_related("job")
            .order_by("-applied_at")[:5]
        )

        next_interview = (
            Interview.objects.filter(
                application__candidate=candidate,
                status="SCHEDULED",
            )
            .select_related("application__job")
            .order_by("interview_date", "interview_time")
            .first()
        )

        # ----------------------------------
        # Profile Completion
        # ----------------------------------

        profile_score = 0
        total_fields = 10

        if request.user.first_name:
            profile_score += 1

        if request.user.email:
            profile_score += 1

        if candidate.phone_number:
            profile_score += 1

        if candidate.city:
            profile_score += 1

        if candidate.highest_education:
            profile_score += 1

        if candidate.skills:
            profile_score += 1

        if candidate.current_company:
            profile_score += 1

        if candidate.linkedin_url:
            profile_score += 1

        if candidate.profile_photo:
            profile_score += 1

        if Resume.objects.filter(candidate=candidate).exists():
            profile_score += 1

        profile_completion = int(
            (profile_score / total_fields) * 100
        )

        # ----------------------------------
        # AI Resume Score
        # ----------------------------------

        resume_score = None

        latest_resume = (
            Resume.objects.filter(candidate=candidate)
            .order_by("-uploaded_at")
            .first()
        )

        if latest_resume:

            try:

                parsed_resume = ParsedResume.objects.get(
                    resume=latest_resume
                )

                resume_score = calculate_ats_score(
                    candidate,
                    parsed_resume
                )

            except ParsedResume.DoesNotExist:

                resume_score = None

        # ----------------------------------
        # Response
        # ----------------------------------

        data = {

            "username": request.user.username,

            "profile_completion": profile_completion,

            "resume_score": resume_score,

            "total_resumes": Resume.objects.filter(
                candidate=candidate
            ).count(),

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

            "recent_applications": [

                {
                    "id": app.id, # type: ignore
                    "job_title": app.job.title,
                    "status": app.status,
                    "applied_at": app.applied_at,
                }

                for app in recent_applications

            ],

            "next_interview": (

                {
                    "job_title": next_interview.application.job.title,
                    "interview_date": next_interview.interview_date,
                    "interview_time": next_interview.interview_time,
                    "interview_mode": next_interview.interview_mode,
                    "meeting_link": next_interview.meeting_link,
                    "notes": next_interview.notes,
                }

                if next_interview else None

            ),

        }

        return Response(
            data,
            status=status.HTTP_200_OK
        )     
             