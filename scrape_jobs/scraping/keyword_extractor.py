import re
import spacy

# Loading the spaCy model for English
nlp = spacy.load("en_core_web_sm")

def clean_extracted_text(text):
    """Clean the extracted text by fixing spacing and formatting issues."""
    # Step 1: Normalize spaces and remove unwanted characters
    cleaned_text = re.sub(r'\s+', ' ', text)  # Normalize all whitespace to a single space
    cleaned_text = cleaned_text.strip()  # Remove leading/trailing spaces

    # Step 2: Add heuristic to fix missing spaces between words
    cleaned_text = re.sub(r'([a-z])([A-Z])', r'\1 \2', cleaned_text)  # Fix camelCase
    cleaned_text = re.sub(r'(\d)([A-Za-z])', r'\1 \2', cleaned_text)  # Fix digit-letter concatenation
    cleaned_text = re.sub(r'([a-zA-Z])([/,])([a-zA-Z])', r'\1 \2 \3', cleaned_text)  # Fix letter-comma-letter
    
    return cleaned_text

def extract_all_keywords(text):
    """Extract and consolidate all relevant keywords from the given text, excluding unwanted patterns."""
    # Process the text with spaCy
    doc = nlp(text)
    
    # Define a set to store unique keywords
    keywords = set()

    # Define patterns to exclude
    patterns_to_exclude = [
        r'^\d+$',                        # Remove standalone numbers (e.g., "10")
        r'http[s]?://\S+',               # Remove URLs
        r'\b(monday|friday|week)\b',     # Remove day/time-related terms
        r'\b(job type|application|benefits|schedule)\b',  # Additional unwanted terms
    ]
    
    def is_valid_keyword(keyword):
        """Check if the keyword matches any exclusion pattern."""
        return not any(re.search(pattern, keyword) for pattern in patterns_to_exclude)
    
    # Extract individual tokens (lemma form, lowercased) with specified POS
    for token in doc:
        keyword = token.lemma_.lower()
        if (
            not token.is_stop and 
            not token.is_punct and 
            token.pos_ in {'PROPN', 'NOUN', 'ADJ', 'VERB'} and 
            is_valid_keyword(keyword)
        ):
            keywords.add(keyword)
    
    # Extract noun phrases (filtering based on length or specific keywords if needed)
    for chunk in doc.noun_chunks:
        phrase = chunk.text.lower()
        if len(phrase.split()) <= 3 and is_valid_keyword(phrase):  # Ignore overly long phrases
            keywords.add(phrase)
    
    # Extract named entities, focusing on specific entity types if necessary
    for ent in doc.ents:
        entity = ent.text.lower()
        if ent.label_ in {'ORG', 'PERSON', 'GPE', 'LANGUAGE', 'PRODUCT'} and is_valid_keyword(entity):
            keywords.add(entity)
    
    # Remove overlapping keywords
    filtered_keywords = set()
    for keyword in keywords:
        if not any(keyword in other and keyword != other for other in keywords):
            filtered_keywords.add(keyword)
    
    return filtered_keywords
