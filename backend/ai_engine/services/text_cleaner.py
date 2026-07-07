import re


def clean_text(text):
    """
    Clean extracted resume text.
    """

    if not text:
        return ""

    # Remove extra spaces and tabs
    text = re.sub(r"[ \t]+", " ", text)

    # Remove multiple blank lines
    text = re.sub(r"\n+", "\n", text)

    # Remove extra spaces at line start/end
    lines = [line.strip() for line in text.split("\n")]

    # Remove empty lines
    lines = [line for line in lines if line]

    return "\n".join(lines)