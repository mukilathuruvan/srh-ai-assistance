import PyPDF2


def read_file(file):
    file_content = ""

    if file:
        if file.content_type == "application/pdf":
            pdf_reader = PyPDF2.PdfReader(file)
            for page in pdf_reader.pages:
                file_content += page.extract_text()
        else:
            file_content = file.read().decode("utf-8")

    return file_content
