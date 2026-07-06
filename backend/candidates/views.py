from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import CandidateProfile, Resume
from jobs.models import Application
from .serializers import CandidateProfileSerializer, ResumeSerializer

from accounts.permissions import IsCandidate

class CandidateProfileView(APIView):

    permission_classes = [IsAuthenticated, IsCandidate]

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

        data = {
            "username": request.user.username,
            "total_resumes": Resume.objects.filter(candidate=candidate).count(),
            "total_applications": applications.count(),
            "applied": applications.filter(status="APPLIED").count(),
            "under_review": applications.filter(status="UNDER_REVIEW").count(),
            "shortlisted": applications.filter(status="SHORTLISTED").count(),
            "hired": applications.filter(status="HIRED").count(),
            "rejected": applications.filter(status="REJECTED").count(),
        }

        return Response(data, status=status.HTTP_200_OK)   
         