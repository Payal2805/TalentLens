from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import RecruiterProfile
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
        