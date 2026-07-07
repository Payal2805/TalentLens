from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from candidates.models import Resume
from jobs.models import Job
from jobs.models import Application
from .models import ParsedResume, ParsedJob
from .serializers import ParsedResumeSerializer

from .services.pdf_parser import extract_text_from_pdf
from .services.text_cleaner import clean_text
from .services.skill_extractor import extract_skills
from .services.education_extractor import extract_education
from .services.experience_extractor import extract_experience
from .services.job_parser import parse_job_description
from .services.matcher import calculate_match_score


class ResumeTextExtractionView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, resume_id):

        # ----------------------------------
        # Step 1 : Resume Exists?
        # ----------------------------------

        try:
            resume = Resume.objects.get(id=resume_id)

        except Resume.DoesNotExist:

            return Response(
                {
                    "message": "Resume not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # ----------------------------------
        # Step 2 : Extract Raw Text
        # ----------------------------------

        raw_text = extract_text_from_pdf(
            resume.resume_file.path
        )

        # ----------------------------------
        # Step 3 : Clean Text
        # ----------------------------------

        cleaned_text = clean_text(raw_text)

        # ----------------------------------
        # Step 4 : Extract Skills
        # ----------------------------------

        skills = extract_skills(cleaned_text)

        # ----------------------------------
        # Step 5 : Extract Education
        # ----------------------------------

        education = extract_education(cleaned_text)

        # ----------------------------------
        # Step 6 : Extract Experience
        # ----------------------------------

        experience = extract_experience(cleaned_text)

        # ----------------------------------
        # Step 7 : Save Parsed Resume
        # ----------------------------------

        parsed_resume, created = ParsedResume.objects.update_or_create(
            resume=resume,
            defaults={
                "raw_text": raw_text,
                "cleaned_text": cleaned_text,
                "skills": skills,
                "education": education,
                "experience": experience,
            }
        )

        # ----------------------------------
        # Step 8 : Response
        # ----------------------------------

        return Response(
            {
                "message": "Resume parsed successfully.",

                "resume": {
                    "id": resume.id, # type: ignore
                    "title": resume.resume_title,
                },

                "parsed_resume": {
                    "id": parsed_resume.id, # type: ignore
                    "skills": parsed_resume.skills,
                    "education": parsed_resume.education,
                    "experience": parsed_resume.experience,
                    "parsed_at": parsed_resume.parsed_at,
                }
            },
            status=status.HTTP_200_OK
        )
        
class ParsedResumeDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, resume_id):

        try:
            parsed_resume = ParsedResume.objects.get(
                resume_id=resume_id
            )

        except ParsedResume.DoesNotExist:

            return Response(
                {
                    "message": "Parsed resume not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ParsedResumeSerializer(parsed_resume)

        return Response(serializer.data)
    
class JobParserView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, job_id):

        # -----------------------------
        # Step 1 : Job Check
        # -----------------------------
        try:
            job = Job.objects.get(id=job_id)

        except Job.DoesNotExist:
            return Response(
                {
                    "message": "Job not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # ----------------------------------
        # Step 2 : Combine Job Details
        # ----------------------------------

        job_text = f"""
        {job.title}

        {job.description}

        {job.skills_required}

        Experience: {job.experience} Years
        """

        # ----------------------------------
        # Step 3 : Parse Job
        # ----------------------------------

        parsed_data = parse_job_description(job_text)

        # -----------------------------
        # Step 4 : Save Parsed Job
        # -----------------------------
        parsed_job, created = ParsedJob.objects.update_or_create(
            job=job,
            defaults={
                "cleaned_text": parsed_data["cleaned_text"],
                "skills": parsed_data["skills"],
                "experience": parsed_data["experience"],
            }
        )

        # -----------------------------
        # Step 5 : Response
        # -----------------------------
        return Response(
            {
                "message": "Job parsed successfully.",
                "job": {
                    "id": job.id, # type: ignore
                    "title": job.title,
                },
                "parsed_job": {
                    "id": parsed_job.id, # type: ignore
                    "skills": parsed_job.skills,
                    "experience": parsed_job.experience,
                    "parsed_at": parsed_job.parsed_at,
                }
            },
            status=status.HTTP_200_OK
        )
        
class MatchResumeJobView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, resume_id, job_id):

        # ----------------------------
        # Parsed Resume
        # ----------------------------

        try:
            parsed_resume = ParsedResume.objects.get(
                resume_id=resume_id
            )

        except ParsedResume.DoesNotExist:

            return Response(
                {
                    "message": "Parsed resume not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # ----------------------------
        # Parsed Job
        # ----------------------------

        try:
            parsed_job = ParsedJob.objects.get(
                job_id=job_id
            )

        except ParsedJob.DoesNotExist:

            return Response(
                {
                    "message": "Parsed job not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # ----------------------------
        # Calculate Match
        # ----------------------------

        result = calculate_match_score(
            parsed_resume,
            parsed_job
        )

        return Response(
            {
                "resume_id": resume_id,
                "job_id": job_id,
                "result": result
            }
        )

class JobApplicantsMatchView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, job_id):

        # ----------------------------
        # Step 1 : Parsed Job
        # ----------------------------

        try:
            parsed_job = ParsedJob.objects.get(
                job_id=job_id
            )

        except ParsedJob.DoesNotExist:

            return Response(
                {
                    "message": "Parsed job not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # ----------------------------
        # Step 2 : Get Applications
        # ----------------------------

        applications = Application.objects.filter(
            job_id=job_id
        )

        results = []

        # ----------------------------
        # Step 3 : Match Every Resume
        # ----------------------------

        for application in applications:

            try:

                parsed_resume = ParsedResume.objects.get(
                    resume=application.resume
                )

            except ParsedResume.DoesNotExist:

                continue

            match_result = calculate_match_score(
                parsed_resume,
                parsed_job
            )

            results.append({
                "candidate_id": application.candidate.id, # type: ignore
                "candidate_name": application.candidate.user.get_full_name()
                or application.candidate.user.username,
                "resume_id": application.resume.id, # type: ignore
                "application_status": application.status,

                "skill_score": match_result["skill_score"],
                "experience_score": match_result["experience_score"],
                "overall_score": match_result["overall_score"],
            })

        # ----------------------------
        # Step 4 : Ranking
        # ----------------------------

        results.sort(
            key=lambda x: x["overall_score"],
            reverse=True
        )

        # ----------------------------
        # Step 5 : Add Rank
        # ----------------------------

        for index, candidate in enumerate(results, start=1):
            candidate["rank"] = index

        # ----------------------------
        # Step 6 : Response
        # ----------------------------

        return Response(
            {
                "job_id": job_id,
                "total_applicants": len(results),
                "results": results
            },
            status=status.HTTP_200_OK
        )
          