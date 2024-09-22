import requests
from bs4 import BeautifulSoup
import pandas as pd

# URL for the website you want to scrape
URL = 'https://www.indeed.com/jobs?q=entry+level+developer&l=Mission+Viejo%2C+CA&radius=25&fromage=last&vjk=11c6db99074967db&advn=4296571507200433'

# Define headers to simulate a browser request
headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'
}

# Send a GET request to the site with headers
response = requests.get(URL, headers=headers)

# Check if the response was successful
if response.status_code == 200:
    # Parse the page content
    soup = BeautifulSoup(response.text, 'lxml')

    # Create lists to store data
    job_titles = []
    companies = []
    locations = []
    pays = []

    # Find job postings on the website
    job_listings = soup.find_all('div', class_='job_seen_beacon')

    for job in job_listings:
        # Extract the job title
        title = job.find('h2', class_='jobTitle')
        job_titles.append(title.get_text(strip=True) if title else 'N/A')

        # Extract the company name
        company = job.find('span', class_='companyName')
        companies.append(company.get_text(strip=True) if company else 'N/A')

        # Extract the job location
        location = job.find('div', class_='companyLocation')
        locations.append(location.get_text(strip=True) if location else 'N/A')

        # Extract the pay
        pay = job.find('div', {'data-testid': 'attribute_snippet_testid'})
        pays.append(pay.get_text(strip=True) if pay else 'N/A')

    # Create a DataFrame to store the data
    df = pd.DataFrame({
        'Job Title': job_titles,
        'Company': companies,
        'Location': locations,
        'Pay': pays
    })

    # Print the DataFrame
    print(df.head())

    # Save data in a CSV file
    df.to_csv('indeed-job-listings.csv', index=False)

else:
    print(f"Failed to retrieve the page. Status code: {response.status_code}")
