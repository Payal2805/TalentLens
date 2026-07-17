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
from .serializers import RegisterSerializer, LoginSerializer, ForgotPasswordSerializer, ResetPasswordSerializer

from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.core.mail import send_mail
from django.conf import settings

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
        
class ForgotPasswordView(APIView):

    permission_classes = []

    def post(self, request):

        serializer = ForgotPasswordSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        email = serializer.validated_data["email"] # type: ignore

        try:
            user = User.objects.get(email=email)

        except User.DoesNotExist:
            return Response(
                {
                    "message": "No account found with this email."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        uid = urlsafe_base64_encode(force_bytes(user.pk))

        token = default_token_generator.make_token(user)

        reset_link = (
            f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"
        )

        send_mail(
            subject="TalentLens Password Reset",
            message=(
                f"Hello {user.username},\n\n"
                f"Click the link below to reset your password:\n\n"
                f"{reset_link}\n\n"
                f"If you did not request this, you can ignore this email."
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )

        return Response(
            {
                "message": "Password reset link has been sent to your email."
            },
            status=status.HTTP_200_OK
        )
        
class ResetPasswordView(APIView):

    permission_classes = []

    def post(self, request):

        serializer = ResetPasswordSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        uid = serializer.validated_data["uid"] # type: ignore
        token = serializer.validated_data["token"] # type: ignore
        password = serializer.validated_data["password"] # type: ignore

        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)

        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response(
                {
                    "message": "Invalid reset link."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if not default_token_generator.check_token(user, token):
            return Response(
                {
                    "message": "Invalid or expired token."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(password)
        user.save()

        return Response(
            {
                "message": "Password has been reset successfully."
            },
            status=status.HTTP_200_OK
        )        
