from transformers import pipeline
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Load the skill and knowledge extraction models
skill_pipe = pipeline("token-classification", model="jjzha/jobbert_skill_extraction")
knowledge_pipe = pipeline("token-classification", model="jjzha/jobbert_knowledge_extraction")

# Job description and resume texts
job_text = (
    '$2599.15-$2884.77 wk (includes wage of ~$23.00-$23.00/hr and per diems if eligible) click for benefits and other job details ~$966-$966 weekly taxable income ~$1633.15 in non-taxable per diem (amount subject to eligibility & seasonal / annual adjustment) Calling all healthcare rockstars! Are you a RN (Registered Nurse) with experience in Telemetry If so, you might be the right fit for this travel healthcare position in Anaheim, CA. We offer thousands of high-paying job opportunities in all 50 states, Guam, and Washington D.C. This huge pool of opportunities lets nurses and allied healthcare professionals grow their experience and resume, practice clinical skills, and enhance their quality of life. Your own personal recruiter acts as a guide along the way, ensuring you get the jobs and locations you want. Let’s partner to perfect your career in care! We believe that a happy, healthy clinician makes for happier, healthier patients. That’s why Medical Solutions supports our travelers with everything they need to live their best lives and establish the career of their dreams. That starts with a, dedicated, experienced recruiter and top-shelf service. Our travelers also enjoy traditional and modern benefits, including: Paid, private, pet-friendly housing Traveler discount program $600 for 600 hours worked unlimited loyalty bonus A recruiter committed to your career journey 24/7 customer care $500 unlimited referral bonus Licensure / certification reimbursement Day-one medical, dental, and vision insurance Voluntary insurance benefits, like disability and more 401(k) with company contribution Free employee assistance program (EAP) Equal employment opportunity And that’s just a taste of the Medical Solutions magic!'
)

resume_text = (
    'Bachelor’s degree in Computer Science. Experienced in web development using JavaScript, HTML, CSS, and React. '
    'Proficient in SQL and Ruby on Rails. Developed solutions using Python for data analysis. '
    'Skilled in problem-solving and researching technical solutions. Worked with Selenium for automated testing.'
)

# Function to extract skills and knowledge terms
def extract_terms(text):
    skills = skill_pipe(text)
    knowledge = knowledge_pipe(text)
    return " ".join([item['word'] for item in skills + knowledge])

# Get extracted terms for job description and resume
job_terms = extract_terms(job_text)
resume_terms = extract_terms(resume_text)

# Ensure terms are not empty
if job_terms and resume_terms:
    # Vectorize terms without TF-IDF
    vectorizer = CountVectorizer(binary=True)  # binary=True for binary vectorization
    vectors = vectorizer.fit_transform([job_terms, resume_terms])

    # Calculate cosine similarity
    cosine_sim = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]
    print(f"Cosine Similarity between Job Description and Resume: {cosine_sim:.4f}")

    # Optional: Show extracted terms
    print("\nExtracted Terms from Job Description:", job_terms)
    print("\nExtracted Terms from Resume:", resume_terms)

    # Function to score the resume based on matched skills
    def score_resume(job_terms, resume_terms):
        job_skills = set(job_terms.split())
        resume_skills = set(resume_terms.split())

        matched_skills = job_skills.intersection(resume_skills)
        score = len(matched_skills) / len(job_skills) if job_skills else 0  # Avoid division by zero

        return score, matched_skills

    # Calculate the score
    score, matched = score_resume(job_terms, resume_terms)
    print(f"Score: {score:.2f}, Matched Skills: {matched}")
else:
    print("No terms extracted from either job description or resume.")
