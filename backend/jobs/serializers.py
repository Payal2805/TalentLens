from rest_framework import serializers
from .models import Job, Application, Interview


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
            "job",          # ✅ Add this
            "status",
            "applied_at",
        ]
        
class RecruiterApplicationSerializer(serializers.ModelSerializer):
    
    candidate_id = serializers.IntegerField(
        source="candidate.id",
        read_only=True
    )

    candidate_name = serializers.CharField(
        source="candidate.user.username",
        read_only=True
    )

    candidate_email = serializers.CharField(
        source="candidate.user.email",
        read_only=True
    )

    resume_title = serializers.CharField(
        source="resume.resume_title",
        read_only=True
    )

    resume_file = serializers.FileField(
        source="resume.resume_file",
        read_only=True
    )

    class Meta:
        model = Application
        fields = [
            "id",
            "candidate_id",
            "candidate_name",
            "candidate_email",
            "resume",
            "resume_title",
            "resume_file",
            "status",
            "applied_at",
        ]
        
class ApplicationStatusSerializer(serializers.ModelSerializer):

    class Meta:
        model = Application
        fields = ["status"]
        
class InterviewSerializer(serializers.ModelSerializer):

    class Meta:
        model = Interview
        fields = "__all__"
       
class RecruiterInterviewSerializer(serializers.ModelSerializer):

    candidate_name = serializers.CharField(
        source="application.candidate.user.get_full_name",
        read_only=True
    )

    candidate_email = serializers.EmailField(
        source="application.candidate.user.email",
        read_only=True
    )

    job_title = serializers.CharField(
        source="application.job.title",
        read_only=True
    )

    class Meta:
        model = Interview
        fields = [
            "id",
            "candidate_name",
            "candidate_email",
            "job_title",
            "interview_date",
            "interview_time",
            "interview_mode",
            "meeting_link",
            "status",
        ]
        
class InterviewStatusSerializer(serializers.ModelSerializer):

    class Meta:
        model = Interview
        fields = ["status"]
        