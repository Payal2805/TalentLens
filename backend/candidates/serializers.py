from rest_framework import serializers
from .models import CandidateProfile, Resume


class CandidateProfileSerializer(serializers.ModelSerializer):

    username = serializers.CharField(source="user.username", read_only=True)
    first_name = serializers.CharField(source="user.first_name", read_only=True)
    last_name = serializers.CharField(source="user.last_name", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)

    full_name = serializers.SerializerMethodField()

    class Meta:
        model = CandidateProfile
        fields = [
            "id",
            "user",

            "username",
            "first_name",
            "last_name",
            "full_name",
            "email",

            "phone_number",
            "date_of_birth",
            "gender",
            "address",
            "city",
            "state",
            "country",
            "highest_education",
            "college_name",
            "experience_years",
            "current_company",
            "current_job_title",
            "skills",
            "linkedin_url",
            "github_url",
            "portfolio_url",
            "profile_photo",

            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "user",
            "created_at",
            "updated_at",
        ]

    def get_full_name(self, obj):
        full_name = f"{obj.user.first_name} {obj.user.last_name}".strip()
        return full_name if full_name else obj.user.username

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
        