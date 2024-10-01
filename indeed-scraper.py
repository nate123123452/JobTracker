import os
import django
from datetime import date
import time

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'job_scraper.settings')  # Replace with your project's settings module
django.setup()

from scrape_jobs.models import JobListing  # Import your JobListing model

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

# Function to generate Indeed URL based on user input
def generate_indeed_url(job_title, location):
    base_url = "https://www.indeed.com/jobs"
    return f"{base_url}?q={job_title}&l={location}"

# Prompt user for job title and location
job_title = input("Enter the job title (e.g., 'entry level developer'): ")
location = input("Enter the location (e.g., 'Rancho Santa Margarita, CA'): ")
# Set the maximum number of pages to scrape
max_pages = int(input("Enter the number of pages you want to scrape: "))  # User-defined page limit

# Generate the URL
url = generate_indeed_url(job_title.replace(' ', '+'), location.replace(' ', '+'))

# Set up the Selenium WebDriver
service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service)

# Open the initial Indeed job listings page
driver.get(url)

# Wait for the page to load
wait = WebDriverWait(driver, 10)

def extract_job_listings():
    job_listings = wait.until(EC.presence_of_all_elements_located((By.CLASS_NAME, 'job_seen_beacon')))
    
    for job in job_listings:
        try:
            # Extract job title
            job_title = job.find_element(By.CSS_SELECTOR, 'span[id^="jobTitle"]').text

            # Extract location 
            try:
                job_location = job.find_element(By.CSS_SELECTOR, 'div[data-testid="text-location"]').text
            except:
                job_location = "Location not listed"

            # Extract company name 
            try:
                company_span = job.find_element(By.CSS_SELECTOR, 'span[data-testid="company-name"]')
                job_company = company_span.text  # Extract the company name
            except:
                job_company = "Company not listed"

            # Extract all attributes (e.g. salary/full time)
            try:
                attributes_elements = job.find_elements(By.CSS_SELECTOR, 'div[data-testid="attribute_snippet_testid"]')
                attribute_texts = [attribute.text for attribute in attributes_elements]  # Gets text for each element
                all_attributes = " | ".join(attribute_texts)  # Joins them into a single string
            except:
                all_attributes = "Not listed"  # Default value if extraction fails

            # Save job details to the database
            JobListing.objects.create(
                title=job_title,
                location=job_location,
                company=job_company,
                date_posted=date.today(),
                attributes=all_attributes  # Make sure this matches your model's field
            )
            
            # Print the job details
            print(f"Job Title: {job_title}")
            print(f"Company: {job_company}")
            print(f"Location: {job_location}")
            print(f"Attributes: {all_attributes}")
            print('-' * 40)
            
        except Exception as e:
            print(f"Error extracting job details: {e}")

# Function to check if the "Next" button exists and click it
def go_to_next_page():
    try:
        next_button = driver.find_element(By.CSS_SELECTOR, 'a[data-testid="pagination-page-next"]')
        next_button.click()  # Click the "Next" button to load the next page
        return True
    except Exception as e:
        print(f"No more pages or error clicking Next: {e}")
        return False

# Initialize the page counter
page_counter = 0

# Loop through pages and extract job listings until no more pages are found or the page limit is reached
while page_counter < max_pages:
    extract_job_listings()  # Extract job listings from the current page
    
    # Wait for a few seconds to ensure the next page loads fully
    time.sleep(10)  # You can adjust this timing if needed
    
    # Try to go to the next page
    if not go_to_next_page():
        break  # Break the loop if there are no more pages
    
    # Increment the page counter
    page_counter += 1

# Close the WebDriver
driver.quit()
