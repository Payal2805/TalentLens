from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):

    ROLE_CHOICES = [
        ("ADMIN", "Admin"),
        ("RECRUITER", "Recruiter"),
        ("CANDIDATE", "Candidate"),
    ]

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default="CANDIDATE"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username
