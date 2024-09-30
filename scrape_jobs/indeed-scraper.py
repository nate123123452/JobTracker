import os
import django
from datetime import date

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
import time

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

# Function to extract job listings from the current page
def extract_job_listings():
    job_listings = wait.until(EC.presence_of_all_elements_located((By.CLASS_NAME, 'job_seen_beacon')))
    
    # Loop through job listings and extract job title, location, and salary (if available)
    for job in job_listings:
        try:
            # Extract job title using span with an id that starts with 'jobTitle'
            job_title = job.find_element(By.CSS_SELECTOR, 'span[id^="jobTitle"]').text
            
            # Extract location using 'data-testid="text-location"' attribute
            job_location = job.find_element(By.CSS_SELECTOR, 'div[data-testid="text-location"]').text
            
            # Extract salary using 'data-testid="attribute_snippet_testid"' (if available)
            try:
                job_salary = job.find_element(By.CSS_SELECTOR, 'div[data-testid="attribute_snippet_testid"]').text
            except:
                job_salary = "Not listed"
            
            # Save job details to the database
            JobListing.objects.create(
                title=job_title,
                company="N/A",  # If you want to extract the company name, you need to do so
                location=job_location,
                description="N/A",  # You may extract a description if available
                date_posted=date.today()  # Adjust as necessary
            )
            
            # Print the job details
            print(f"Job Title: {job_title}")
            print(f"Location: {job_location}")
            print(f"Salary: {job_salary}")
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
    time.sleep(3)
    
    # Try to go to the next page
    if not go_to_next_page():
        break  # Break the loop if there are no more pages
    
    # Increment the page counter
    page_counter += 1

# Close the WebDriver
driver.quit()
