from typing import List, Dict, Any, Optional
import openai
from ..core.config import settings

class OpenAIService:
    def __init__(self):
        openai.api_key = settings.OPENAI_API_KEY
        self.model = settings.OPENAI_MODEL
        self.temperature = settings.OPENAI_TEMPERATURE
        self.max_tokens = settings.OPENAI_MAX_TOKENS

    async def get_prediction(
        self,
        sport: str,
        team1: str,
        team2: str,
        match_type: str,
        historical_data: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Get a prediction for a sports match using GPT-4.
        """
        # Construct the prompt
        prompt = self._construct_prediction_prompt(
            sport, team1, team2, match_type, historical_data
        )

        try:
            response = await openai.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": self._get_system_prompt()},
                    {"role": "user", "content": prompt}
                ],
                temperature=self.temperature,
                max_tokens=self.max_tokens,
                response_format={"type": "json_object"}
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"Error calling OpenAI API: {str(e)}")
            return {
                "error": "Failed to generate prediction",
                "details": str(e)
            }

    async def get_player_analysis(
        self,
        player_name: str,
        team: str,
        sport: str,
        stats: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Get detailed player analysis using GPT-4.
        """
        prompt = self._construct_player_analysis_prompt(
            player_name, team, sport, stats
        )

        try:
            response = await openai.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": self._get_system_prompt()},
                    {"role": "user", "content": prompt}
                ],
                temperature=self.temperature,
                max_tokens=self.max_tokens,
                response_format={"type": "json_object"}
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"Error calling OpenAI API: {str(e)}")
            return {
                "error": "Failed to generate player analysis",
                "details": str(e)
            }

    def _get_system_prompt(self) -> str:
        """
        Get the system prompt for the AI.
        """
        return """You are an expert sports analyst and predictor. Your role is to:
        1. Analyze teams, players, and matches
        2. Provide detailed predictions with confidence levels
        3. Consider historical performance, current form, and relevant statistics
        4. Explain your reasoning clearly and concisely
        5. Format responses in a structured JSON format
        
        Keep your analysis factual, unbiased, and based on available data."""

    def _construct_prediction_prompt(
        self,
        sport: str,
        team1: str,
        team2: str,
        match_type: str,
        historical_data: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        Construct the prompt for match prediction.
        """
        prompt = f"Analyze the upcoming {sport} match between {team1} and {team2} in {match_type}.\n\n"
        
        if historical_data:
            prompt += "Historical data:\n"
            prompt += str(historical_data) + "\n\n"
        
        prompt += """Please provide a detailed prediction including:
        1. Win probability for each team
        2. Expected score or key statistics
        3. Key factors influencing the prediction
        4. Confidence level in the prediction
        5. Potential props or special bets worth considering
        
        Format the response as a JSON object."""
        
        return prompt

    def _construct_player_analysis_prompt(
        self,
        player_name: str,
        team: str,
        sport: str,
        stats: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        Construct the prompt for player analysis.
        """
        prompt = f"Analyze {player_name} from {team} in {sport}.\n\n"
        
        if stats:
            prompt += "Player statistics:\n"
            prompt += str(stats) + "\n\n"
        
        prompt += """Please provide a detailed analysis including:
        1. Performance assessment
        2. Strengths and weaknesses
        3. Recent form and trends
        4. Predictions for upcoming performance
        5. Key statistics and their significance
        
        Format the response as a JSON object."""
        
        return prompt 