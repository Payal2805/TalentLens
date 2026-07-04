from rest_framework import serializers
from .models import CandidateProfile, Resume


class CandidateProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = CandidateProfile
        fields = "__all__"
        read_only_fields = [
            "id",
            "user",
            "created_at",
            "updated_at",
        ]

class ResumeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Resume
        fields = "__all__"
        read_only_fields = [
            "id",
            "candidate",
            "uploaded_at",
        ]

    def validate_resume_file(self, value):
        if not value.name.lower().endswith(".pdf"):
            raise serializers.ValidationError(
                "Only PDF files are allowed."
            )

        return value
        