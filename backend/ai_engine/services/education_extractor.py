import re


EDUCATION_KEYWORDS = [
    "B.E",
    "B.E.",
    "BE",
    "B.Tech",
    "B.Tech.",
    "Bachelor of Engineering",
    "Bachelor of Technology",
    "M.E",
    "ME",
    "M.Tech",
    "Master of Engineering",
    "Master of Technology",
    "B.Sc",
    "B.Sc.",
    "BSc CS",
    "BSc IT",
    "M.Sc",
    "M.Sc.",
    "BCA",
    "MCA",
    "BBA",
    "MBA",
    "Diploma",
    "PhD",
    "SSC",
    "HSC"
]


def extract_education(text):
    """
    Extract education details from resume text.
    """

    if not text:
        return []

    found = []

    for keyword in EDUCATION_KEYWORDS:

        pattern = r"\b" + re.escape(keyword) + r"\b"

        if re.search(pattern, text, re.IGNORECASE):

            found.append(keyword)

    return sorted(list(set(found)))
