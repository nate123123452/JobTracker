import tkinter as tk
from tkinter import filedialog
from docx import Document

from keyword_extractor import clean_extracted_text, extract_all_keywords

def select_docx_file():
    """Open a file dialog to select a DOCX file."""
    root = tk.Tk()
    root.withdraw()  # Hide the root window
    file_path = filedialog.askopenfilename(
        title="Select a DOCX file",
        filetypes=[("DOCX files", "*.docx")]
    )
    return file_path

def extract_text_with_docx(docx_file):
    """Extract text from a DOCX file using python-docx."""
    doc = Document(docx_file)
    text = ""
    for paragraph in doc.paragraphs:
        text += paragraph.text + "\n"  # Append paragraph text with a newline
    return text

# Main logic to extract and clean text from the selected DOCX file
docx_file_path = select_docx_file()

if docx_file_path:
    # Extract text from the selected DOCX file
    extracted_text = extract_text_with_docx(docx_file_path)
    
    # Clean the extracted text
    cleaned_text = clean_extracted_text(extracted_text)

    # Extract the keywords
    keyword_text = extract_all_keywords(cleaned_text)
    
    # Print the cleaned extracted keyword text
    print("Cleaned Extracted Keyword Text:\n", keyword_text)
else:
    print("No file selected.")
