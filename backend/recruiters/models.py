from django.db import models
from accounts.models import User


class RecruiterProfile(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="recruiter_profile"
    )

    company_name = models.CharField(max_length=255)

    company_email = models.EmailField()

    company_phone = models.CharField(max_length=15)

    company_website = models.URLField(blank=True)

    company_address = models.TextField()

    designation = models.CharField(max_length=100)

    company_description = models.TextField(blank=True)

    company_logo = models.ImageField(
        upload_to="company_logos/",
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.company_name
    