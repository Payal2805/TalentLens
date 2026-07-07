import re


def extract_experience(text):
    """
    Extract total years of experience from resume text.
    """

    if not text:
        return {
            "total_experience": None
        }

    patterns = [
        r"(\d+(?:\.\d+)?)\+?\s*(?:years|year|yrs|yr)",
        r"(\d+(?:\.\d+)?)\+?\s*(?:months|month)"
    ]

    for pattern in patterns:

        match = re.search(
            pattern,
            text,
            re.IGNORECASE
        )

        if match:

            return {
                "total_experience": match.group(0)
            }

    if re.search(r"\bfresher\b", text, re.IGNORECASE):

        return {
            "total_experience": "Fresher"
        }

    return {
        "total_experience": None
    }
    