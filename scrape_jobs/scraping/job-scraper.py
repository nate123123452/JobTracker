import os
import django
import sys

# Setup Django environment
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))  # Adjust path to include the project root
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'job_scraper.settings')  # Replace 'job_scraper' with your actual project name
django.setup()  # Set up Django environment

from scrape_jobs.models import JobListing  # Import your models
from keyword_extractor import clean_extracted_text, extract_all_keywords  # Import your cleaning and keyword extraction functions

def get_user_input():
    """Get company name, website URL, and job description from user."""
    company_name = input("Enter the company name: ")
    website_url = input("Enter the website URL: ")

    print("Enter the job description (press Enter and type 'END' on a new line when finished):")
    job_description_lines = []
    while True:
        line = input()
        if line.strip().upper() == "END":
            break
        job_description_lines.append(line)
    job_description = "\n".join(job_description_lines)
    
    return company_name, website_url, job_description


def save_job_listing(company_name, website_url, job_description):
    """Save the job listing to the database."""
    # Clean the job description
    cleaned_description = clean_extracted_text(job_description)
    
    # Extract keywords from the cleaned description
    keywords = extract_all_keywords(cleaned_description)

    # Save the job listing to the database
    job_listing = JobListing(
        job_name=company_name,
        website=website_url,
        text=cleaned_description  # Save the cleaned description
    )
    job_listing.save()  # Save the job listing to the database
    print("Job listing saved successfully.")

    # Save keywords to the database
    # save_keywords_to_model(keywords)

# def save_keywords_to_model(keywords):
#     """Save the extracted keywords to the Keyword model."""
#     for keyword in keywords:
#         # Check if the keyword already exists to avoid duplicates
#         if not Keyword.objects.filter(words=keyword).exists():
#             # Create and save a new keyword in the model
#             Keyword.objects.create(words=keyword)
#             print(f"Saved keyword: {keyword}")
#         else:
#             print(f"Keyword already exists: {keyword}")

def main():
    """Main function to run the job scraper."""
    company_name, website_url, job_description = get_user_input()
    
    # Save the job listing to the database
    save_job_listing(company_name, website_url, job_description)

if __name__ == '__main__':
    main()
