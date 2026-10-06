from ai_engine.models import ParsedResume

from .pdf_parser import extract_text_from_pdf
from .text_cleaner import clean_text
from .skill_extractor import extract_skills
from .education_extractor import extract_education
from .experience_extractor import extract_experience


def parse_resume(resume):

    # -----------------------------
    # Step 1: Extract PDF text
    # -----------------------------

    raw_text = extract_text_from_pdf(
        resume.resume_file.path
    )

    # -----------------------------
    # Step 2: Clean text
    # -----------------------------

    cleaned_text = clean_text(
        raw_text
    )

    # -----------------------------
    # Step 3: Extract skills
    # -----------------------------

    skills = extract_skills(
        cleaned_text
    )

    # -----------------------------
    # Step 4: Extract education
    # -----------------------------

    education = extract_education(
        cleaned_text
    )

    # -----------------------------
    # Step 5: Extract experience
    # -----------------------------

    experience = extract_experience(
        cleaned_text
    )

    # -----------------------------
    # Step 6: Save / update ParsedResume
    # -----------------------------

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

    return parsed_resume
