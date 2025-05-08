from flask import Blueprint, jsonify, request
import random
from openai import AzureOpenAI
from azure.core.credentials import AzureKeyCredential
import os
from datetime import datetime
from flask_cors import CORS
from ..core.config import settings

predictions = Blueprint('predictions', __name__)
CORS(predictions)  # Enable CORS for all routes in this blueprint

# Initialize Azure OpenAI client
client = AzureOpenAI(
    api_version="2024-12-01-preview",
    azure_endpoint="https://ai-w2159934766238ai224090976649.openai.azure.com/",
    api_key=settings.AZURE_OPENAI_KEY
)

@predictions.route('/predict/match', methods=['POST'])
def predict_match():
    try:
        data = request.get_json()
        home_team = data.get('home_team')
        away_team = data.get('away_team')
        
        if not home_team or not away_team:
            return jsonify({'error': 'Both home_team and away_team are required'}), 400
            
        # Simple prediction logic based on random probability
        home_win_prob = round(random.uniform(0.2, 0.6), 2)
        draw_prob = round(random.uniform(0.1, 0.3), 2)
        away_win_prob = round(1 - home_win_prob - draw_prob, 2)
        
        prediction = {
            'home_team': home_team,
            'away_team': away_team,
            'probabilities': {
                'home_win': home_win_prob,
                'draw': draw_prob,
                'away_win': away_win_prob
            },
            'prediction': 'home_win' if home_win_prob > max(draw_prob, away_win_prob) else 'draw' if draw_prob > away_win_prob else 'away_win'
        }
        
        return jsonify(prediction), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@predictions.route('/predict/player', methods=['POST', 'OPTIONS'])
def predict_player():
    if request.method == 'OPTIONS':
        return '', 200

    try:
        data = request.get_json()
        player_name = data.get('player_name')
        team = data.get('team')
        category = data.get('category')
        prediction_type = data.get('prediction_type')
        target_value = data.get('target_value')

        if not all([player_name, team, category, prediction_type, target_value]):
            return jsonify({'error': 'Missing required fields'}), 400

        # Construct the prompt for player prediction
        prompt = f"""
        Analyze the following player prediction request:
        Player: {player_name}
        Team: {team}
        Category: {category}
        Prediction Type: {prediction_type}
        Target Value: {target_value}

        Please provide a detailed analysis of the player's likelihood to achieve this target,
        considering their recent form, historical performance, and relevant statistics.
        """

        # Get prediction analysis from OpenAI using Azure OpenAI
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert sports analyst specializing in player performance predictions."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=800
        )

        # Extract the analysis
        analysis = response.choices[0].message.content

        # Generate a confidence score (this would be replaced with actual ML model in production)
        confidence = round(random.uniform(0.6, 0.9), 2)

        return jsonify({
            'player': player_name,
            'team': team,
            'category': category,
            'prediction_type': prediction_type,
            'target_value': target_value,
            'confidence': confidence,
            'analysis': analysis
        }), 200

    except Exception as e:
        print(f"Error in predict_player: {str(e)}")  # Add debug logging
        return jsonify({'error': str(e)}), 500 