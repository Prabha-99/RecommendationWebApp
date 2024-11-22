import logging
from django.http import JsonResponse
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from transformers import AutoTokenizer, AutoModel
import torch
import re
import unicodedata
import os
from django.conf import settings


# Set up a logger for the view
logger = logging.getLogger(__name__)


# Preload the model and tokenizer
tokenizer = AutoTokenizer.from_pretrained("sinhala-nlp/sinhala-sentiment-analysis-sinbert-large")
model = AutoModel.from_pretrained("sinhala-nlp/sinhala-sentiment-analysis-sinbert-large")
model.eval()


# Define the paths to the files
npy_file_path = os.path.join(settings.BASE_DIR, 'static', 'data', 'all_blurbs_embeddings_sinbert_large.npy')
csv_file_path = os.path.join(settings.BASE_DIR, 'static', 'data', 'singleSentences.csv')

# Load embeddings and blurb data
all_embeddings_array = np.load(npy_file_path, allow_pickle=True)
blurbs_df = pd.read_csv(csv_file_path)

def preprocess_text(text):
    text = unicodedata.normalize('NFKC', text)
    text = re.sub(r'\d+', '', text)
    text = re.sub(r'-', '', text)
    text = re.sub(r'[a-zA-Z]', '', text)
    text = re.sub(r"['\"]", '', text)
    return text

def tokenize_into_sentences(text):
    from sinling import SinhalaTokenizer
    tokenizer = SinhalaTokenizer()
    return tokenizer.split_sentences(text)

def get_similarity_score(preference_vector, blurb_embeddings):
    blurb_vector = np.mean(np.vstack(blurb_embeddings), axis=0)
    return cosine_similarity([preference_vector], [blurb_vector])[0][0]

def recommend_books(request):
    # Get the user preference from the GET request
    user_preference_text = request.GET.get('preference', '')

    if not user_preference_text:
        return JsonResponse({'error': 'No user preference provided'}, status=400)

    # Log the received text
    logger.info(f"User preference received: {user_preference_text}")


    # Preprocess the user preference and tokenize into sentences
    processed_preference = preprocess_text(user_preference_text)
    processed_preference_sentences = tokenize_into_sentences(processed_preference)

    # Generate embeddings for the preference
    preference_embeddings = []
    for sentence in processed_preference_sentences:
        inputs = tokenizer(sentence, return_tensors='pt', padding=True, truncation=True)
        with torch.no_grad():
            outputs = model(**inputs)
            sentence_embedding = outputs.last_hidden_state.mean(dim=1)
            preference_embeddings.append(sentence_embedding.squeeze().cpu().numpy())

    preference_vector = np.mean(preference_embeddings, axis=0)

    # Calculate similarity scores for each blurb
    similarity_scores = []
    for blurb_embeddings in all_embeddings_array:
        score = get_similarity_score(preference_vector, blurb_embeddings)
        similarity_scores.append(score)

    # Get the indices of the top 5 most similar blurbs
    top_5_indices = np.argsort(similarity_scores)[::-1][:5]

    # Prepare the response data with top 5 recommendations
    recommendations = []
    for idx in top_5_indices:
        recommendations.append({
            'Book' : blurbs_df.iloc[idx]['Book'],
            'Author' : blurbs_df.iloc[idx]['Author'],
            'Blurb': blurbs_df.iloc[idx]['Blurb'],
            'Similarity Score': float(similarity_scores[idx])  # Convert to native float
        })

    return JsonResponse({'recommendations': recommendations})
