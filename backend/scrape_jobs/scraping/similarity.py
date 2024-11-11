from transformers import AutoTokenizer, AutoModel
from sentence_transformers import SentenceTransformer, util
import torch
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Load the JobBERT model and tokenizer
try:
    jobbert_tokenizer = AutoTokenizer.from_pretrained("jjzha/jobbert-base-cased")
    jobbert_model = AutoModel.from_pretrained("jjzha/jobbert-base-cased")
except Exception as e:
    print(f"Error loading JobBERT model: {e}")

# Load the Sentence-BERT model
try:
    sentence_model = SentenceTransformer('all-MiniLM-L6-v2')
except Exception as e:
    print(f"Error loading Sentence-BERT model: {e}")

# Initialize the TF-IDF vectorizer globally
vectorizer = TfidfVectorizer()

def get_jobbert_embedding(text):
    inputs = jobbert_tokenizer(text, return_tensors='pt', truncation=True, padding=True, max_length=512)
    with torch.no_grad():
        outputs = jobbert_model(**inputs)
    # Extract the [CLS] token embedding
    return outputs.last_hidden_state[:, 0, :]

def get_sentence_embedding(text):
    # Use the Sentence-BERT model to get embeddings
    return sentence_model.encode(text, convert_to_tensor=True)

def calculate_jobbert_similarity(text1, text2):
    embedding1 = get_jobbert_embedding(text1)
    embedding2 = get_jobbert_embedding(text2)
    
    # Calculate cosine similarity
    similarity_score = torch.nn.functional.cosine_similarity(embedding1, embedding2)
    return similarity_score.item()

def calculate_sentence_similarity(text1, text2):
    embedding1 = get_sentence_embedding(text1)
    embedding2 = get_sentence_embedding(text2)
    
    # Calculate cosine similarity
    similarity_score = util.pytorch_cos_sim(embedding1, embedding2)
    return similarity_score.item()

def calculate_tfidf_similarity(text1, text2):
    # Combine the documents into a list
    documents = [text1, text2]

    # Fit and transform the documents
    tfidf_matrix = vectorizer.fit_transform(documents)

    # Calculate cosine similarity
    similarity_matrix = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])

    # Extract the similarity score
    return similarity_matrix[0][0]

def calculate_weighted_similarity(text1, text2, jobbert_weight=0.7, sentence_weight=0.3, tfidf_weight=0):
    jobbert_similarity = calculate_jobbert_similarity(text1, text2)  # JobBERT similarity score
    sentence_similarity = calculate_sentence_similarity(text1, text2)  # Sentence-BERT similarity score
    tfidf_similarity = calculate_tfidf_similarity(text1, text2)  # TF-IDF similarity score

    # Weighted final similarity score
    final_similarity = (jobbert_similarity * jobbert_weight) + (sentence_similarity * sentence_weight) + (tfidf_similarity * tfidf_weight)
    return final_similarity

# Example usage
job_description = (
'Minimum Qualifications: Completed bachelor’s degree in Computer Science, Computer Engineering, Math or other Science major Excellent verbal and written communication skills Ability to research and execute solutions based on online guides and tutorials Technical aptitude and the ability to problem solve Knowledge of HTML / CSS and Javascript Strong work ethic, positive attitude and motivation to learn Ability to work independently as well as in a team environment High level of professionalism and ethics Preferred qualifications: Technical creativity and a history finding creative solutions to interesting problems Ability to manage multiple priorities in a fast paced environment Experience with React, Ruby on Rails and SQL Experience in Java, web development, python Experience working with the Selenium test suite About Property Matrix Property Matrix is the future of property management software. Utilizing cloud services, our property management platform was designed to be both powerful and scalable to meet'
)

resume = (
'Grace Hopper gracehopper123@gmail.com • (919) 123-1234 • linkedin.com / in / grace-hopper-123 • github.com / gracehopper123 EDUCATION The University of North Carolina at Chapel Hill | Chapel Hill, NC B.S. in Computer Science | GPA: 3.7/4.0 May 2025 Relevant Courses: Computer Organization, Data Structures, Foundations of Programming, Algorithms & Analysis TECHNICAL SKILLS Programming Languages: Java (Advanced), Python (Advanced), C (Intermediate), C# (Intermediate), C++ (Beginner) Operating Systems: Windows XP / Vista/7/8/10, Linux RELEVANT EXPERIENCE UNC Department of Computer Science | Teaching Assistant | Chapel Hill, NC Aug 2022 - Present Mentor over 275 Introduction to Programming students, explaining challenging concepts to both Computer Science and non-technical majors Coordinate office hours and lesson plans in conjunction with 6 other teaching assistants to ensure widespread availability and quickly return tests and assignments to students Software Test Engineer Intern | Qualtrics | Seattle, WA May 2023 - August 2023 Implemented an extensible script in Python to automate project creation with static data on tests to improve pass rates and duration, ultimately speeding up software releases Improved test times across 3 teams by nearly 400% with more stability Reviewed design docs and prototypes of an upcoming feature release to create nearly 50 test cases. Performed manual testing and triaged 15 bugs with engineers PROJECTS RESTroom Yelp | Pearl Hacks Project February 2024 Collaborated with a team of 4 and developed a fully functional web application with a dynamic Javascript-based front-end, an AJAX-based communication with a RESTful server-side API, a relational database that stores back-end application state, and an ORM layer to access data in the database Designed most of the front end & debugged PHP Awarded the Most Creative Award by Appian and Best Innovation in Collaboration Award by Red Ventures Discover the New World Mini-game | Personal Project May 2023 Created a mini-game in C# for Xbox with immersive music and sound effects as well as designed the user interface using Figma Generated a random map based on a 2 D array with multiple pages for the user to traverse on their west LEADERSHIP EXPERIENCE Director of Promotion | Pearl Hacks | UNC-Chapel Hill Apr 2023 - Present Manage and delegate the marketing branch (directors and committee members) to establish Pearl Hacks mission to empower women and gender non-conforming beginners in tech Develop and execute the marketing strategy through social media, design, and in-person campaigns which fostered 1500+ registrations with a 60% turnout rate from representation from 30+ countries Partnered with 3 other branches and 4 other chair members to discuss how the marketing strategy plays into the function of the organization as a whole'
)

# Calculate similarity scores
jobbert_similarity_score = calculate_jobbert_similarity(job_description, resume)
sentence_similarity_score = calculate_sentence_similarity(job_description, resume)

# Print similarity scores from both models
print("JobBERT Similarity Score:", jobbert_similarity_score)
print("Sentence-BERT Similarity Score:", sentence_similarity_score)

# Calculate and print weighted similarity score
similarity_score = calculate_weighted_similarity(job_description, resume)
print("Final Weighted Similarity Score:", similarity_score)
