from rest_framework import serializers
from .models import Job, Application


class JobSerializer(serializers.ModelSerializer):

    class Meta:
        model = Job
        fields = "__all__"

        read_only_fields = [
            "id",
            "recruiter",
            "created_at",
            "updated_at",
        ]
        
class ApplicationSerializer(serializers.ModelSerializer):

    job_title = serializers.CharField(
        source="job.title",
        read_only=True
    )

    company_name = serializers.CharField(
        source="job.recruiter.company_name",
        read_only=True
    )

    class Meta:
        model = Application
        fields = [
            "id",
            "job",
            "job_title",
            "company_name",
            "resume",
            "status",
            "applied_at",
        ]

        read_only_fields = [
            "id",
            "status",
            "applied_at",
        ]
        
class RecruiterApplicationSerializer(serializers.ModelSerializer):

    candidate_name = serializers.CharField(
        source="candidate.user.username",
        read_only=True
    )

    candidate_email = serializers.CharField(
        source="candidate.user.email",
        read_only=True
    )

    class Meta:
        model = Application
        fields = [
            "id",
            "candidate_name",
            "candidate_email",
            "resume",
            "status",
            "applied_at",
        ]
        
class ApplicationStatusSerializer(serializers.ModelSerializer):

    class Meta:
        model = Application
        fields = ["status"]
        
        