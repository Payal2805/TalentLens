from .text_cleaner import clean_text
from .skill_extractor import extract_skills
from .experience_extractor import extract_experience


def parse_job_description(job_description):
    """
    Parse Job Description
    """

    cleaned_text = clean_text(job_description)

    skills = extract_skills(cleaned_text)

    experience = extract_experience(cleaned_text)

    return {
        "cleaned_text": cleaned_text,
        "skills": skills,
        "experience": experience,
    }
    