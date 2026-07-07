from rest_framework import serializers
from .models import ParsedResume


class ParsedResumeSerializer(serializers.ModelSerializer):

    class Meta:
        model = ParsedResume
        fields = [
            "id",
            "skills",
            "education",
            "experience",
            "parsed_at",
        ]
        