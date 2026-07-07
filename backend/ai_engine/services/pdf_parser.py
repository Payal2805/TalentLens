import pdfplumber


def extract_text_from_pdf(file_path):
    """
    Extract all text from a PDF file.

    Args:
        file_path (str): Path of the PDF file.

    Returns:
        str: Extracted text.
    """

    text = ""

    try:
        with pdfplumber.open(file_path) as pdf:

            for page in pdf.pages:

                page_text = page.extract_text()

                if page_text:
                    text += page_text + "\n"

        return text.strip()

    except Exception as e:
        print(f"Error while reading PDF: {e}")
        return ""