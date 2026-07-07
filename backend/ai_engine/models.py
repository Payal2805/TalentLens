from django.db import models
from candidates.models import Resume
from jobs.models import Job

class ParsedResume(models.Model):

    resume = models.OneToOneField(
        Resume,
        on_delete=models.CASCADE,
        related_name="parsed_resume"
    )

    raw_text = models.TextField()

    cleaned_text = models.TextField()

    skills = models.JSONField(
        default=list
    )

    education = models.JSONField(
        default=list
    )

    experience = models.JSONField(
        default=dict
    )

    parsed_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.resume.resume_title
    
class ParsedJob(models.Model):

    job = models.OneToOneField(
        Job,
        on_delete=models.CASCADE,
        related_name="parsed_job"
    )

    cleaned_text = models.TextField()

    skills = models.JSONField(
        default=list
    )

    education = models.JSONField(
        default=list
    )

    experience = models.JSONField(
        default=dict
    )

    parsed_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.job.title
    