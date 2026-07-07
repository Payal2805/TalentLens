import re

def calculate_skill_match(candidate_skills, job_skills):
    """
    Calculate skill match percentage.
    """

    if not job_skills:
        return 0

    candidate_set = {
        skill.lower()
        for skill in candidate_skills
    }

    job_set = {
        skill.lower()
        for skill in job_skills
    }

    matched = candidate_set.intersection(job_set)

    percentage = (
        len(matched) / len(job_set)
    ) * 100

    return round(percentage, 2)



def calculate_experience_match(candidate_experience, job_experience):
    """
    Compare candidate and job experience.
    """

    candidate = candidate_experience.get("total_experience")
    required = job_experience.get("total_experience")

    # If job doesn't specify experience
    if not required:
        return 100

    # If candidate experience not found
    if not candidate:
        return 0

    # Fresher case
    if candidate.lower() == "fresher":
        candidate_years = 0
    else:
        match = re.search(r"\d+(\.\d+)?", candidate)
        candidate_years = float(match.group()) if match else 0

    match = re.search(r"\d+(\.\d+)?", required)
    required_years = float(match.group()) if match else 0

    if candidate_years >= required_years:
        return 100

    return round((candidate_years / required_years) * 100, 2)

def calculate_match_score(parsed_resume, parsed_job):
    """
    Calculate overall resume-job match score.
    """

    skill_score = calculate_skill_match(
        parsed_resume.skills,
        parsed_job.skills
    )

    experience_score = calculate_experience_match(
        parsed_resume.experience,
        parsed_job.experience
    )

    overall_score = round(
        (skill_score * 0.7) +
        (experience_score * 0.3),
        2
    )

    return {
        "skill_score": skill_score,
        "experience_score": experience_score,
        "overall_score": overall_score
    }
    