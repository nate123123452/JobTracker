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
from selenium.common.exceptions import StaleElementReferenceException, NoSuchElementException
from webdriver_manager.chrome import ChromeDriverManager

# Function to generate Indeed URL based on user input
def generate_indeed_url(job_title, location):
    base_url = "https://www.indeed.com/jobs"
    return f"{base_url}?q={job_title}&l={location}"

def extract_job_listings(driver, wait):
    try:
        job_listings = wait.until(EC.presence_of_all_elements_located((By.CLASS_NAME, 'job_seen_beacon')))
    except Exception as e:
        print(f"Error finding job listings: {e}")
        return

    for job in job_listings:
        try:
            # Extract job title
            job_title = job.find_element(By.CSS_SELECTOR, 'span[id^="jobTitle"]').text

            # Extract location 
            job_location = job.find_element(By.CSS_SELECTOR, 'div[data-testid="text-location"]').text
            job_company = job.find_element(By.CSS_SELECTOR, 'span[data-testid="company-name"]').text

            # Save basic job details to the database
            job_listing_instance = JobListing(
                title=job_title,
                location=job_location,
                company=job_company,
                date_posted=date.today(),
                attributes="Not listed"  # Placeholder, will update after extracting skills
            )
            job_listing_instance.save()

            # Click on the job to view more details
            job.click()

            # Wait for the details to load
            time.sleep(4)  # Adjust if needed

            # Extract skills from the job detail page
            attributes = extract_attributes(driver, wait)

            # Update job instance with skills
            job_listing_instance.attributes = " | ".join(attributes) if attributes else "No attribute listed"
            job_listing_instance.save()  # Save updated attributes

            # Print the job details
            print(f"Job Title: {job_title}")
            print(f"Company: {job_company}")
            print(f"Location: {job_location}")
            print(f"Attributes: {', '.join(attributes) if attributes else 'No attributes listed'}")
            print('-' * 40)
            
            # Go back to the job listings
            driver.back()

            # Wait for job listings to load again
            wait.until(EC.presence_of_all_elements_located((By.CLASS_NAME, 'job_seen_beacon')))

        except StaleElementReferenceException:
            print(f"Stale element error, retrying...")
            time.sleep(2)
            driver.back()
        except Exception as e:
            print(f"Error extracting job details: {e}")

def extract_attributes(driver, wait):
    attributes = []
    try:
        # Wait until the page loads and the specific div elements are present
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'div.js-match-insights-provider-tvvxwd')))

        # Find all skill-related div elements by class name
        attributes_divs = driver.find_elements(By.CSS_SELECTOR, 'div.js-match-insights-provider-tvvxwd')

        for div in attributes_divs:
            attribute_name = div.text.strip()  # Get the text content and strip unnecessary whitespace
            if attribute_name:  # Ensure it's not an empty string
                attributes.append(attribute_name)

    except Exception as e:
        print(f"Error extracting skills: {e}")
    
    return attributes


# Function to check if the "Next" button exists and click it
def go_to_next_page(driver):
    try:
        next_button = driver.find_element(By.CSS_SELECTOR, 'a[data-testid="pagination-page-next"]')
        next_button.click()  # Click the "Next" button to load the next page
        return True
    except NoSuchElementException:
        print(f"No more pages available.")
        return False
    except Exception as e:
        print(f"Error clicking Next: {e}")
        return False

# New function to handle pagination and extraction
def scrape_job_listings(driver, wait, max_pages):
    page_counter = 0
    
    # Loop through pages and extract job listings until no more pages are found or the page limit is reached
    while page_counter < max_pages:
        extract_job_listings(driver, wait)  # Extract job listings from the current page
        
        # Wait for a few seconds to ensure the next page loads fully
        time.sleep(5)  # Adjust time based on site performance
        
        # Try to go to the next page
        if not go_to_next_page(driver):
            break  # Break the loop if there are no more pages
        
        # Increment the page counter
        page_counter += 1

def main():
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

    # Call the function to start scraping
    scrape_job_listings(driver, wait, max_pages)

    # Close the WebDriver
    driver.quit()

if __name__ == "__main__":
    main()
