import os
import django
import sys

# Setup Django environment
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))  # Adjust path to include the project root
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'job_scraper.settings')  # Replace 'job_scraper' with your actual project name
django.setup()  # Set up Django environment

import tkinter as tk
from tkinter import filedialog
from docx import Document
from scrape_jobs.models import ResumeListing  # Import models
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

def save_text_to_resume_model(text, keywords):
    """Save the resume text and keywords to ResumeListing Model."""
    resume = ResumeListing.objects.create(text=text, keywords=keywords)
    resume.save()
    return resume

def main():
    # Main logic to extract and clean text from the selected DOCX file
    docx_file_path = select_docx_file()

    if docx_file_path:
        # Extract text from the selected DOCX file
        extracted_text = extract_text_with_docx(docx_file_path)
        
        # Clean the extracted text
        cleaned_text = clean_extracted_text(extracted_text)

        # Extract the keywords
        keyword_text = extract_all_keywords(cleaned_text)

        # Join keywords into a single string (comma-separated)
        keyword_string = ', '.join(keyword_text)

        # Save the text and keywords to the ResumeListing model
        resume = save_text_to_resume_model(cleaned_text, keyword_string)
        
        # Print the cleaned extracted keyword text
        print("Cleaned Extracted Keyword Text:\n", keyword_string)
    else:
        print("No file selected.")

if __name__ == '__main__':
    main()
