from rest_framework import serializers
from .models import RecruiterProfile


class RecruiterProfileSerializer(serializers.ModelSerializer):

    username = serializers.CharField(
        source="user.username",
        read_only=True
    )

    first_name = serializers.CharField(
        source="user.first_name",
        read_only=True
    )

    email = serializers.EmailField(
        source="user.email",
        read_only=True
    )

    class Meta:
        model = RecruiterProfile
        fields = [
            "id",
            "username",
            "first_name",
            "email",
            "company_name",
            "company_email",
            "company_phone",
            "company_website",
            "company_address",
            "designation",
            "company_description",
            "company_logo",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]
        