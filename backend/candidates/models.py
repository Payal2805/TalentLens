from django.db import models
from accounts.models import User
from decimal import Decimal

class CandidateProfile(models.Model):

    GENDER_CHOICES = [
        ("MALE", "Male"),
        ("FEMALE", "Female"),
        ("OTHER", "Other"),
    ]

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="candidate_profile"
    )

    phone_number = models.CharField(max_length=15)

    date_of_birth = models.DateField(
        null=True,
        blank=True
    )

    gender = models.CharField(
        max_length=10,
        choices=GENDER_CHOICES,
        blank=True
    )

    address = models.TextField(blank=True)

    city = models.CharField(
        max_length=100,
        blank=True
    )

    state = models.CharField(
        max_length=100,
        blank=True
    )

    country = models.CharField(
        max_length=100,
        blank=True
    )

    highest_education = models.CharField(
        max_length=200,
        blank=True
    )

    college_name = models.CharField(
        max_length=200,
        blank=True
    )

    experience_years = models.DecimalField(
        max_digits=4,
        decimal_places=1,
        default=Decimal("0.0")
    )

    current_company = models.CharField(
        max_length=200,
        blank=True
    )

    current_job_title = models.CharField(
        max_length=200,
        blank=True
    )

    skills = models.TextField(
        blank=True,
        help_text="Comma separated skills"
    )

    linkedin_url = models.URLField(blank=True)

    github_url = models.URLField(blank=True)

    portfolio_url = models.URLField(blank=True)

    profile_photo = models.ImageField(
        upload_to="profile_photos/",
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.user.username
    
class Resume(models.Model):

    candidate = models.ForeignKey(
        CandidateProfile,
        on_delete=models.CASCADE,
        related_name="resumes"
    )

    resume_title = models.CharField(
        max_length=200
    )

    resume_file = models.FileField(
        upload_to="resumes/"
    )

    is_default = models.BooleanField(
        default=False
    )

    uploaded_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.resume_title
