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
from selenium.common.exceptions import StaleElementReferenceException, NoSuchElementException, TimeoutException
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
            # Extract job title, location, and company
            job_title = job.find_element(By.CSS_SELECTOR, 'span[id^="jobTitle"]').text
            job_location = job.find_element(By.CSS_SELECTOR, 'div[data-testid="text-location"]').text
            job_company = job.find_element(By.CSS_SELECTOR, 'span[data-testid="company-name"]').text

            # Save basic job details to the database
            job_listing_instance = JobListing(
                title=job_title,
                location=job_location,
                company=job_company,
                date_posted=date.today(),
                attributes="Not listed",  # Placeholder, will update after extracting skills
                job_description="Not available"  # Placeholder for job description
            )
            job_listing_instance.save()

            # Print the basic job details
            print(f"Saved job listing: {job_title} at {job_company} in {job_location}")

            # Click on the job to view more details
            job.click()

            # Wait for the details to load
            wait.until(EC.presence_of_element_located((By.ID, 'jobDescriptionText')))  # Wait for the job description to load

            # Extract skills from the job detail page
            attributes = extract_attributes(driver, wait)

            # Extract benefits from the job detail page
            benefits = extract_benefits(driver, wait)

            # Extract job description from the job detail page
            job_description = extract_job_description(driver, wait)

            # Update job instance with skills, benefits, and job description
            job_listing_instance.attributes = " | ".join(attributes) if attributes else "No attribute listed"
            job_listing_instance.benefits = " | ".join(benefits) if benefits else "No benefits listed"
            job_listing_instance.job_description = "\n".join(job_description)  # Join job description into a single string
            job_listing_instance.save()  # Save updated attributes, benefits, and job description

            # Print the job details
            print(f"Job Title: {job_title}")
            print(f"Company: {job_company}")
            print(f"Location: {job_location}")
            print(f"Attributes: {', '.join(attributes) if attributes else 'No attributes listed'}")
            print(f"Benefits: {', '.join(benefits) if benefits else 'No benefits listed'}")
            print(f"Job Description: {job_description}")
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
            print(f"Error Extracting!!!")


def extract_attributes(driver, wait):
    attributes = []
    try:
        wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, 'div.js-match-insights-provider-tvvxwd')))
        attributes_divs = driver.find_elements(By.CSS_SELECTOR, 'div.js-match-insights-provider-tvvxwd')

        if not attributes_divs:
            print("No attributes found.")
            return attributes

        for div in attributes_divs:
            attribute_name = div.text.strip()
            if attribute_name:
                attributes.append(attribute_name)

        if not attributes:
            print("Attributes were found, but they are empty.")
        
    except Exception as e:
        print(f"No attributes!!!")

    return attributes



def extract_benefits(driver, wait):
    benefits = []
    try:
        # Wait for the benefits section to be present
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'div#benefits[data-testid="benefits-test"]')))
        
        # Find the benefits list element
        benefits_list = driver.find_element(By.CSS_SELECTOR, 'div#benefits[data-testid="benefits-test"] ul')

        # Check if the benefits list is found
        if not benefits_list:
            print("No benefits section found.")
            return benefits  # Return an empty list

        # Extract all benefits listed in <li> elements
        benefits_items = benefits_list.find_elements(By.TAG_NAME, 'li')
        if not benefits_items:  # Check if no benefits found
            print("No benefits found.")
            return benefits  # Return an empty list

        for item in benefits_items:
            benefits.append(item.text.strip())  # Get the text and strip whitespace

    except Exception as e:
        print(f"No benefits!!!")
    
    return benefits



def extract_job_description(driver, wait):
    job_description = []
    try:
        # Wait for the job description section to be present
        wait.until(EC.presence_of_element_located((By.ID, 'jobDescriptionText')))
        
        # Find the job description element
        job_description_div = driver.find_element(By.ID, 'jobDescriptionText')

        # Extract all paragraphs (<p>) in the job description
        paragraphs = job_description_div.find_elements(By.TAG_NAME, 'p')
        for paragraph in paragraphs:
            job_description.append(paragraph.text.strip())  # Get the text and strip whitespace
        
        # Extract all list items (<li>) in the job description (if any)
        list_items = job_description_div.find_elements(By.TAG_NAME, 'li')
        for item in list_items:
            job_description.append(item.text.strip())  # Get the text and strip whitespace
            
    except Exception as e:
        print(f"No description!!!")
    
    return job_description


# Function to check if the "Next" button exists and click it
def go_to_next_page(driver):
    try:
        next_button = driver.find_element(By.CSS_SELECTOR, 'a[data-testid="pagination-page-next"]')
        next_button.click()  # Click the "Next" button to load the next page
        print("Clicked next page.")
        return True
    except NoSuchElementException:
        print("No more pages available.")
        return False
    except Exception as e:
        print(f"Error clicking Next: {e}")
        return False

# New function to handle pagination and extraction
def scrape_job_listings(driver, wait, max_pages):
    page_counter = 0
    
    # Loop through pages and extract job listings until no more pages are found or the page limit is reached
    while page_counter < max_pages:
        print(f"Scraping page {page_counter + 1}...")
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

    try:
        # Open the initial Indeed job listings page
        driver.get(url)

        # Wait for the page to load completely
        wait = WebDriverWait(driver, 10)  # Adjust timeout if necessary

        # Start scraping job listings
        scrape_job_listings(driver, wait, max_pages)

    except Exception as e:
        print(f"An error occurred: {e}")

    finally:
        driver.quit()  # Close the WebDriver

if __name__ == "__main__":
    main()
