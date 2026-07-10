from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from .permissions import IsCandidate, IsRecruiter, IsAdmin

from accounts.models import User
from candidates.models import CandidateProfile, Resume
from recruiters.models import RecruiterProfile
from jobs.models import Job, Application
from .serializers import RegisterSerializer, LoginSerializer


class RegisterView(APIView):

    def post(self, request):

        serializer = RegisterSerializer(
            data=request.data
        )

        if serializer.is_valid():

            serializer.save()

            return Response(
                {
                    "message": "User registered successfully."
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
        
class LoginView(APIView):

    permission_classes = []

    def post(self, request):

        serializer = LoginSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"] # type: ignore

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "Login Successful",

                "access": str(refresh.access_token),

                "refresh": str(refresh),

                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "role": user.role,
                }
            },
            status=status.HTTP_200_OK
        )
        
class CandidateDashboardView(APIView):

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

        resumes = Resume.objects.filter(
            candidate=candidate
        )

        applications = Application.objects.filter(
            candidate=candidate
        )

        response = {
            "profile": {
                "username": request.user.username,
                "email": request.user.email,
                "role": request.user.role,
            },

            "statistics": {

                "total_resumes": resumes.count(),

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

                "rejected": applications.filter(
                    status="REJECTED"
                ).count(),

                "hired": applications.filter(
                    status="HIRED"
                ).count(),
            }
        }

        return Response(
            response,
            status=status.HTTP_200_OK
        )
        
class RecruiterDashboardView(APIView):

    permission_classes = [IsAuthenticated, IsRecruiter]

    def get(self, request):

        try:
            recruiter = RecruiterProfile.objects.get(
                user=request.user
            )

        except RecruiterProfile.DoesNotExist:

            return Response(
                {
                    "message": "Recruiter profile not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        jobs = Job.objects.filter(
            recruiter=recruiter
        )

        applications = Application.objects.filter(
            job__recruiter=recruiter
        )

        response = {
            "profile": {
                "username": request.user.username,
                "email": request.user.email,
                "role": request.user.role,
                "company_name": recruiter.company_name
            },

            "statistics": {

                "total_jobs": jobs.count(),

                "active_jobs": jobs.filter(
                    is_active=True
                ).count(),

                "closed_jobs": jobs.filter(
                    is_active=False
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

                "rejected": applications.filter(
                    status="REJECTED"
                ).count(),

                "hired": applications.filter(
                    status="HIRED"
                ).count()
            }
        }

        return Response(
            response,
            status=status.HTTP_200_OK
        )
        
class AdminDashboardView(APIView):

    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):

        response = {
            "profile": {
                "username": request.user.username,
                "email": request.user.email,
                "role": request.user.role,
            },

            "statistics": {

                "total_users": User.objects.count(),

                "total_candidates": CandidateProfile.objects.count(),

                "total_recruiters": RecruiterProfile.objects.count(),

                "total_jobs": Job.objects.count(),

                "active_jobs": Job.objects.filter(
                    is_active=True
                ).count(),

                "closed_jobs": Job.objects.filter(
                    is_active=False
                ).count(),

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
            }
        }

        return Response(
            response,
            status=status.HTTP_200_OK
        )
        