from transformers import pipeline, AutoTokenizer, AutoModel
import torch
import torch.nn.functional as F
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Load the JobBERT model and tokenizer
try:
    tokenizer = AutoTokenizer.from_pretrained("jjzha/jobbert-base-cased")
    model = AutoModel.from_pretrained("jjzha/jobbert-base-cased")
except Exception as e:
    print(f"Error loading model: {e}")

def get_jobbert_embedding(text):
    inputs = tokenizer(text, return_tensors='pt', truncation=True, padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
    # Extract the [CLS] token embedding
    return outputs.last_hidden_state[:, 0, :]

def calculate_bert_similarity(text1, text2):
    embedding1 = get_jobbert_embedding(text1)
    embedding2 = get_jobbert_embedding(text2)
    similarity_score = F.cosine_similarity(embedding1, embedding2)
    return similarity_score.item()

def calculate_tfidf_similarity(text1, text2):
    # Create a TF-IDF vectorizer
    vectorizer = TfidfVectorizer()

    # Combine the documents into a list
    documents = [text1, text2]

    # Fit and transform the documents
    tfidf_matrix = vectorizer.fit_transform(documents)

    # Calculate cosine similarity
    similarity_matrix = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])

    # Extract the similarity score
    return similarity_matrix[0][0]

# Example usage
job_description = (
'$2599.15-$2884.77 wk (includes wage of ~$23.00-$23.00/hr and per diems if eligible) click for benefits and other job details ~$966-$966 weekly taxable income ~$1633.15 in non-taxable per diem (amount subject to eligibility & seasonal / annual adjustment) Calling all healthcare rockstars! Are you a RN (Registered Nurse) with experience in Telemetry If so, you might be the right fit for this travel healthcare position in Anaheim, CA. We offer thousands of high-paying job opportunities in all 50 states, Guam, and Washington D.C. This huge pool of opportunities lets nurses and allied healthcare professionals grow their experience and resume, practice clinical skills, and enhance their quality of life. Your own personal recruiter acts as a guide along the way, ensuring you get the jobs and locations you want. Let’s partner to perfect your career in care! We believe that a happy, healthy clinician makes for happier, healthier patients. That’s why Medical Solutions supports our travelers with everything they need to live their best lives and establish the career of their dreams. That starts with a, dedicated, experienced recruiter and top-shelf service. Our travelers also enjoy traditional and modern benefits, including: Paid, private, pet-friendly housing Traveler discount program $600 for 600 hours worked unlimited loyalty bonus A recruiter committed to your career journey 24/7 customer care $500 unlimited referral bonus Licensure / certification reimbursement Day-one medical, dental, and vision insurance Voluntary insurance benefits, like disability and more 401(k) with company contribution Free employee assistance program (EAP) Equal employment opportunity And that’s just a taste of the Medical Solutions magic!'
)
resume = (
    'Education University of California, Irvine Graduated June 2024 Bachelor in Psychological Sciences, Minor in Information and Computer Sciences Relevant Coursework: Data Structures and Algorithm Programming in C++ Requirements Analysis and Engineering Project in Ubiquitous Computing Projects Sorted Linked Lists | C++ Incorporating key-value pairs to simulate a map interface using a double linked list. Implemented overloaded operators to enable interaction with the list data structure. Conducted thorough testing and debugging to ensure correct functionality. Hangman Game | C++ Implemented a cheating mechanism where the program strategically narrows down the possible words based on user guesses, maximizing the remaining word possibilities to increase difficulty for the user. Utilized classes and data structures such as arrays and lists to manage word lists efficiently, ensuring minimal memory usage. Web Development Project | HTML, CSS, Javascript, React Developed a dynamic and responsive website using HTML, CSS, Java Script, and the React framework. Integrated smooth, animated route transitions with framer-motion and utilized npm packages like react-toastify to create an interactive user experience with responsive feedback mechanisms such as toast notifications. Deployed and hosted the application on AWS S3, ensuring high availability and scalability. Technical Skills Languages: Proficient in Python, C++, HTML / CSS. Basic knowledge of Javascript and SQL Tools and Environment: Git, Visual Studio Code Database Systems: Familiar with My SQL and DBeaver Frameworks: React'
)

# Calculate similarity scores
bert_similarity_score = calculate_bert_similarity(job_description, resume)
tfidf_similarity_score = calculate_tfidf_similarity(job_description, resume)

# Print similarity scores
print("BERT Similarity Score:", bert_similarity_score)
print("TF-IDF Similarity Score:", tfidf_similarity_score)

def calculate_weighted_similarity(text1, text2, bert_weight=0.8, tfidf_weight=0.2):
    bert_similarity = calculate_bert_similarity(text1, text2)  # BERT similarity score
    tfidf_similarity = calculate_tfidf_similarity(text1, text2)  # TF-IDF similarity score
    
    # Weighted final similarity score
    final_similarity = (bert_similarity * bert_weight) + (tfidf_similarity * tfidf_weight)
    return final_similarity

# Example usage
similarity_score = calculate_weighted_similarity(job_description, resume)
print("Final Weighted Similarity Score:", similarity_score)
