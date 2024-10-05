import re
import spacy

# Loading the spaCy model for English
nlp = spacy.load("en_core_web_sm")

def clean_extracted_text(text):
    """Clean the extracted text by fixing spacing and formatting issues."""
    # Step 1: Normalize spaces and remove unwanted characters
    cleaned_text = re.sub(r'\s+', ' ', text)  # Normalize all whitespace to single space
    cleaned_text = cleaned_text.strip()  # Remove leading/trailing spaces

    # Step 2: Add heuristic to fix missing spaces between words
    cleaned_text = re.sub(r'([a-z])([A-Z])', r'\1 \2', cleaned_text)  # Fix camelCase
    cleaned_text = re.sub(r'(\d)([A-Za-z])', r'\1 \2', cleaned_text)  # Fix digit-letter concatenation
    cleaned_text = re.sub(r'([a-zA-Z])([/,])([a-zA-Z])', r'\1 \2 \3', cleaned_text)  # Fix letter-comma-letter
    
    return cleaned_text

def extract_all_keywords(text): 
    """Extract and consolidate all keywords from the given text."""
    # Use spaCy to process the text
    doc = nlp(text)
    
    # Define a set to store all keywords (lemma form, lowercased)
    keywords = set()

    # Extract single-word keywords (excluding stopwords and punctuation)
    for token in doc:
        if not token.is_stop and not token.is_punct and (token.pos_ in ['PROPN', 'NOUN', 'ADJ', 'VERB']):
            keywords.add(token.lemma_.lower())

    # Extract noun phrases (multi-word expressions like "Bachelor in Psychological Sciences")
    for chunk in doc.noun_chunks:
        keywords.add(chunk.text.lower())

    # Extract named entities (e.g., "University of California", "Python")
    for ent in doc.ents:
        keywords.add(ent.text.lower())

    return keywords

