import os
import django
import sys

# Setup Django environment
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))  # Adjust path to include the project root

# Add Django project settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'job_scraper.settings')  # Replace 'your_project_name' with your actual project name
django.setup()  # Set up Django environment

import tkinter as tk
from tkinter import filedialog
from docx import Document
from scrape_jobs.models import Keyword, ResumeListing  # Import models
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

def save_text_to_model(text):
    """Save the resume text to ResumeListing Model"""
    resume = ResumeListing.objects.create(text=text)
    resume.save()
    return resume

def save_keywords_to_model(keywords, resume):
    """Save the extracted keywords to Keyword model."""
    for keyword in keywords:
        # Check if the keyword already exists to avoid duplicates
        if not Keyword.objects.filter(words=keyword).exists():
            # Create and save a new keyword in the model
            Keyword.objects.create(words=keyword)
            print(f"Saved keyword: {keyword}")
        else:
            print(f"Keyword already exists: {keyword}")

def main():
    # Main logic to extract and clean text from the selected DOCX file
    docx_file_path = select_docx_file()

    if docx_file_path:
        # Extract text from the selected DOCX file
        extracted_text = extract_text_with_docx(docx_file_path)
        
        # Clean the extracted text
        cleaned_text = clean_extracted_text(extracted_text)

        # Save the text
        resume = save_text_to_model(cleaned_text)

        # Extract the keywords
        keyword_text = extract_all_keywords(cleaned_text)

        # Save the keywords
        save_keywords_to_model(keyword_text, resume)
        
        # Print the cleaned extracted keyword text
        print("Cleaned Extracted Keyword Text:\n", keyword_text)
    else:
        print("No file selected.")

if __name__ == '__main__':
    main()
