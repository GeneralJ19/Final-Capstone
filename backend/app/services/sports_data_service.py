import aiohttp
import asyncio
from typing import Dict, List, Optional, Any
import json
from datetime import datetime
import logging
from ..core.config import settings
import httpx

logger = logging.getLogger(__name__)

class SportsDataService:
    def __init__(self):
        # API endpoints for different sports data providers
        self.API_ENDPOINTS = {
            'football': 'https://api.football-data.org/v4',
            'basketball': 'https://api.basketball-data.org/v3',
            'baseball': 'https://api.mlb-data.org/v3',
            'hockey': 'https://api.nhl.com/v1',
            'tennis': 'https://api.tennis-data.org/v2',
            'cricket': 'https://api.cricket-data.org/v3',
        }
        
        self.SPORT_FEATURES = {
            'football': [
                'team_form', 'goals_scored', 'goals_conceded', 'possession',
                'shots_on_target', 'cards', 'injuries', 'head_to_head'
            ],
            'basketball': [
                'points_per_game', 'rebounds', 'assists', 'field_goal_percentage',
                'three_point_percentage', 'free_throw_percentage', 'injuries'
            ],
            'baseball': [
                'batting_average', 'era', 'runs_per_game', 'home_runs',
                'pitching_stats', 'weather_conditions', 'stadium_factors'
            ],
            'hockey': [
                'goals_per_game', 'save_percentage', 'power_play_percentage',
                'penalty_kill', 'shots_per_game', 'injuries'
            ],
            'tennis': [
                'win_rate', 'surface_performance', 'recent_form',
                'head_to_head', 'tournament_history', 'fatigue_index'
            ],
            'cricket': [
                'batting_average', 'bowling_average', 'recent_form',
                'pitch_conditions', 'weather_impact', 'head_to_head'
            ]
        }

        self.api_key = "579557"
        self.base_url = "https://www.thesportsdb.com/api/v2/json"

    async def fetch_live_odds(self, sport: str, game_id: str) -> Dict:
        """Fetch real-time odds from multiple bookmakers"""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"https://api.odds-provider.com/{sport}/games/{game_id}/odds",
                    headers={"Authorization": f"Bearer {settings.ODDS_API_KEY}"}
                ) as response:
                    if response.status == 200:
                        return await response.json()
                    else:
                        logger.error(f"Error fetching odds: {response.status}")
                        return None
        except Exception as e:
            logger.error(f"Error fetching odds: {str(e)}")
            return None

    async def fetch_team_stats(self, sport: str, team_id: str) -> Dict:
        """Fetch comprehensive team statistics"""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"{self.API_ENDPOINTS[sport]}/teams/{team_id}/statistics",
                    headers={"X-Auth-Token": settings.SPORTS_API_KEY}
                ) as response:
                    if response.status == 200:
                        return await response.json()
                    else:
                        logger.error(f"Error fetching team stats: {response.status}")
                        return None
        except Exception as e:
            logger.error(f"Error fetching team stats: {str(e)}")
            return None

    async def fetch_weather_data(self, location: str) -> Dict:
        """Fetch weather data for outdoor sports"""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"https://api.weather-provider.com/forecast/{location}",
                    headers={"Authorization": f"Bearer {settings.WEATHER_API_KEY}"}
                ) as response:
                    if response.status == 200:
                        return await response.json()
                    else:
                        logger.error(f"Error fetching weather data: {response.status}")
                        return None
        except Exception as e:
            logger.error(f"Error fetching weather data: {str(e)}")
            return None

    async def get_game_features(self, sport: str, game_id: str) -> Dict:
        """Gather all relevant features for a game prediction"""
        features = {}
        
        # Fetch basic game info
        game_info = await self.fetch_game_info(sport, game_id)
        if not game_info:
            return None

        # Get team stats
        home_stats = await self.fetch_team_stats(sport, game_info['home_team_id'])
        away_stats = await self.fetch_team_stats(sport, game_info['away_team_id'])

        # Get live odds
        odds = await self.fetch_live_odds(sport, game_id)

        # For outdoor sports, get weather data
        if sport in ['football', 'baseball', 'cricket']:
            weather = await self.fetch_weather_data(game_info['location'])
            features['weather_conditions'] = weather

        # Combine all data
        features.update({
            'home_team_stats': home_stats,
            'away_team_stats': away_stats,
            'odds': odds,
            'game_info': game_info
        })

        return features

    async def fetch_game_info(self, sport: str, game_id: str) -> Dict:
        """Fetch basic game information"""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"{self.API_ENDPOINTS[sport]}/matches/{game_id}",
                    headers={"X-Auth-Token": settings.SPORTS_API_KEY}
                ) as response:
                    if response.status == 200:
                        return await response.json()
                    else:
                        logger.error(f"Error fetching game info: {response.status}")
                        return None
        except Exception as e:
            logger.error(f"Error fetching game info: {str(e)}")
            return None

    def get_sport_features(self, sport: str) -> List[str]:
        """Get the list of features used for a specific sport"""
        return self.SPORT_FEATURES.get(sport, [])

    def get_supported_sports(self) -> List[str]:
        """Get list of supported sports"""
        return list(self.API_ENDPOINTS.keys())

    async def get_team_stats(self, team_name: str) -> Optional[Dict[str, Any]]:
        """Get team statistics from TheSportsDB v2"""
        try:
            async with httpx.AsyncClient() as client:
                # Search for team using v2 endpoint
                response = await client.get(
                    f"{self.base_url}/{self.api_key}/searchteams.php",
                    params={"t": team_name}
                )
                response.raise_for_status()
                data = response.json()
                
                if not data.get("teams"):
                    logger.warning(f"No team found for: {team_name}")
                    return None

                team = data["teams"][0]
                return {
                    "id": team["idTeam"],
                    "name": team["strTeam"],
                    "league": team["strLeague"],
                    "stadium": team["strStadium"],
                    "description": team["strDescriptionEN"],
                    "formed_year": team["intFormedYear"],
                    "country": team["strCountry"],
                    "logo": team["strTeamBadge"],
                    "website": team.get("strWebsite", ""),
                    "facebook": team.get("strFacebook", ""),
                    "twitter": team.get("strTwitter", ""),
                    "instagram": team.get("strInstagram", ""),
                    "youtube": team.get("strYoutube", ""),
                    "rss": team.get("strRSS", ""),
                    "stadium_thumb": team.get("strStadiumThumb", ""),
                    "stadium_description": team.get("strStadiumDescription", ""),
                    "stadium_location": team.get("strStadiumLocation", ""),
                    "stadium_capacity": team.get("intStadiumCapacity", ""),
                    "alternate": team.get("strAlternate", "")
                }
        except Exception as e:
            logger.error(f"Error fetching team stats: {str(e)}")
            return None

    async def get_league_teams(self, league_id: str) -> List[Dict[str, Any]]:
        """Get all teams in a league using v2 endpoint"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/{self.api_key}/lookup_all_teams.php",
                    params={"id": league_id}
                )
                response.raise_for_status()
                data = response.json()
                
                if not data.get("teams"):
                    return []

                return [{
                    "id": team["idTeam"],
                    "name": team["strTeam"],
                    "stadium": team["strStadium"],
                    "logo": team["strTeamBadge"],
                    "website": team.get("strWebsite", ""),
                    "facebook": team.get("strFacebook", ""),
                    "twitter": team.get("strTwitter", ""),
                    "instagram": team.get("strInstagram", ""),
                    "youtube": team.get("strYoutube", ""),
                    "rss": team.get("strRSS", ""),
                    "stadium_thumb": team.get("strStadiumThumb", ""),
                    "stadium_description": team.get("strStadiumDescription", ""),
                    "stadium_location": team.get("strStadiumLocation", ""),
                    "stadium_capacity": team.get("intStadiumCapacity", ""),
                    "alternate": team.get("strAlternate", "")
                } for team in data["teams"]]
        except Exception as e:
            logger.error(f"Error fetching league teams: {str(e)}")
            return []

    async def get_team_players(self, team_id: str) -> List[Dict[str, Any]]:
        """Get all players in a team using v2 endpoint"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/{self.api_key}/lookup_all_players.php",
                    params={"id": team_id}
                )
                response.raise_for_status()
                data = response.json()
                
                # Debugging the response structure
                logger.info(f"API Response for team_id {team_id}: {json.dumps(data)[:200]}...")
                
                # Check if 'player' key exists and is not None
                if not data or not data.get("player"):
                    # Try alternate endpoint with team name instead of ID
                    team_response = await client.get(
                        f"{self.base_url}/{self.api_key}/lookupteam.php",
                        params={"id": team_id}
                    )
                    team_response.raise_for_status()
                    team_data = team_response.json()
                    
                    if team_data and team_data.get("teams") and len(team_data["teams"]) > 0:
                        team_name = team_data["teams"][0]["strTeam"]
                        player_response = await client.get(
                            f"{self.base_url}/{self.api_key}/searchplayers.php",
                            params={"t": team_name}
                        )
                        player_response.raise_for_status()
                        data = player_response.json()
                    else:
                        return []

                # The API might return player data under "player" or "players" key
                players_data = data.get("player") or data.get("players") or []
                if not players_data:
                    return []

                return [{
                    "id": player["idPlayer"],
                    "name": player["strPlayer"],
                    "nationality": player.get("strNationality", ""),
                    "position": player.get("strPosition", ""),
                    "description": player.get("strDescriptionEN", ""),
                    "thumb": player.get("strThumb", ""),
                    "signing": player.get("strSigning", ""),
                    "wage": player.get("strWage", ""),
                    "birth_location": player.get("strBirthLocation", ""),
                    "date_born": player.get("dateBorn", ""),
                    "date_signed": player.get("dateSigned", ""),
                    "facebook": player.get("strFacebook", ""),
                    "twitter": player.get("strTwitter", ""),
                    "instagram": player.get("strInstagram", ""),
                    "youtube": player.get("strYoutube", ""),
                    "height": player.get("strHeight", ""),
                    "weight": player.get("strWeight", ""),
                    "gender": player.get("strGender", ""),
                    "sport": player.get("strSport", ""),
                    "team": player.get("strTeam", ""),
                    "team2": player.get("strTeam2", ""),
                    "team3": player.get("strTeam3", ""),
                    "team4": player.get("strTeam4", ""),
                    "team5": player.get("strTeam5", ""),
                    "team6": player.get("strTeam6", ""),
                    "team7": player.get("strTeam7", ""),
                    "team8": player.get("strTeam8", ""),
                    "team9": player.get("strTeam9", ""),
                    "team10": player.get("strTeam10", ""),
                    "team11": player.get("strTeam11", ""),
                    "team12": player.get("strTeam12", ""),
                    "team13": player.get("strTeam13", ""),
                    "team14": player.get("strTeam14", ""),
                    "team15": player.get("strTeam15", ""),
                    "team16": player.get("strTeam16", ""),
                    "team17": player.get("strTeam17", ""),
                    "team18": player.get("strTeam18", ""),
                    "team19": player.get("strTeam19", ""),
                    "team20": player.get("strTeam20", "")
                } for player in players_data]
        except Exception as e:
            logger.error(f"Error fetching team players: {str(e)}")
            return []

    async def get_league_table(self, league_id: str) -> List[Dict[str, Any]]:
        """Get league standings using v2 endpoint"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/{self.api_key}/lookuptable.php",
                    params={"l": league_id, "s": "2023-2024"}
                )
                response.raise_for_status()
                data = response.json()
                
                if not data.get("table"):
                    return []

                return [{
                    "position": team["intRank"],
                    "team_id": team["idTeam"],
                    "team_name": team["strTeam"],
                    "played": team["intPlayed"],
                    "win": team["intWin"],
                    "draw": team["intDraw"],
                    "loss": team["intLoss"],
                    "goals_for": team["intGoalsFor"],
                    "goals_against": team["intGoalsAgainst"],
                    "goal_difference": team["intGoalDifference"],
                    "points": team["intPoints"],
                    "form": team.get("strForm", ""),
                    "description": team.get("strDescription", ""),
                    "badge": team.get("strTeamBadge", "")
                } for team in data["table"]]
        except Exception as e:
            logger.error(f"Error fetching league table: {str(e)}")
            return []

    async def get_team_last_matches(self, team_id: str) -> List[Dict[str, Any]]:
        """Get team's last 5 matches using v2 endpoint"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/{self.api_key}/eventslast.php",
                    params={"id": team_id}
                )
                response.raise_for_status()
                data = response.json()
                
                if not data.get("results"):
                    return []

                return [{
                    "id": match["idEvent"],
                    "date": match["dateEvent"],
                    "home_team": match["strHomeTeam"],
                    "away_team": match["strAwayTeam"],
                    "home_score": match["intHomeScore"],
                    "away_score": match["intAwayScore"],
                    "venue": match["strVenue"],
                    "league": match["strLeague"],
                    "season": match.get("strSeason", ""),
                    "filename": match.get("strFilename", ""),
                    "thumbnail": match.get("strThumb", ""),
                    "video": match.get("strVideo", ""),
                    "status": match.get("strStatus", ""),
                    "postponed": match.get("strPostponed", ""),
                    "locked": match.get("strLocked", "")
                } for match in data["results"]]
        except Exception as e:
            logger.error(f"Error fetching team matches: {str(e)}")
            return []

    async def get_team_next_matches(self, team_id: str) -> List[Dict[str, Any]]:
        """Get team's next 5 matches using v2 endpoint"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/{self.api_key}/eventsnext.php",
                    params={"id": team_id}
                )
                response.raise_for_status()
                data = response.json()
                
                if not data.get("events"):
                    return []

                return [{
                    "id": match["idEvent"],
                    "date": match["dateEvent"],
                    "time": match["strTime"],
                    "home_team": match["strHomeTeam"],
                    "away_team": match["strAwayTeam"],
                    "venue": match["strVenue"],
                    "league": match["strLeague"],
                    "season": match.get("strSeason", ""),
                    "filename": match.get("strFilename", ""),
                    "thumbnail": match.get("strThumb", ""),
                    "video": match.get("strVideo", ""),
                    "status": match.get("strStatus", ""),
                    "postponed": match.get("strPostponed", ""),
                    "locked": match.get("strLocked", "")
                } for match in data["events"]]
        except Exception as e:
            logger.error(f"Error fetching upcoming matches: {str(e)}")
            return []

sports_data_service = SportsDataService() 