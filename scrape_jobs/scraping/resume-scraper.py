import tkinter as tk
from tkinter import filedialog
import re
from docx import Document

def extract_text_with_docx(docx_file):
    """Extract text from a DOCX file using python-docx."""
    doc = Document(docx_file)
    text = ""
    for paragraph in doc.paragraphs:
        text += paragraph.text + "\n"  # Append paragraph text with a newline
    return text

def clean_extracted_text(text):
    """Clean the extracted text by fixing spacing and formatting issues."""
    # Step 1: Normalize spaces and remove unwanted characters
    cleaned_text = re.sub(r'\s+', ' ', text)  # Normalize all whitespace to single space
    cleaned_text = cleaned_text.strip()  # Remove leading/trailing spaces

    # Step 2: Add heuristic to fix missing spaces between words
    cleaned_text = re.sub(r'([a-z])([A-Z])', r'\1 \2', cleaned_text)
    cleaned_text = re.sub(r'(\d)([A-Za-z])', r'\1 \2', cleaned_text)
    cleaned_text = re.sub(r'([a-zA-Z])([/,])([a-zA-Z])', r'\1 \2 \3', cleaned_text)
    
    return cleaned_text

# Function to open a file picker dialog restricted to DOCX files
def select_docx_file():
    """Open a file dialog to select a DOCX file."""
    root = tk.Tk()
    root.withdraw()  # Hide the root window
    file_path = filedialog.askopenfilename(
        title="Select a DOCX file",
        filetypes=[("DOCX files", "*.docx")]
    )
    return file_path

# Main logic to extract and clean text from the selected DOCX file
docx_file_path = select_docx_file()

if docx_file_path:
    # Extract text from the selected DOCX file
    extracted_text = extract_text_with_docx(docx_file_path)
    
    # Clean the extracted text
    cleaned_text = clean_extracted_text(extracted_text)
    
    # Print the cleaned extracted text
    print("Cleaned Extracted Text:\n", cleaned_text)
else:
    print("No file selected.")
