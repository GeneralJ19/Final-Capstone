from flask import Blueprint, request, jsonify
import requests
import logging
from datetime import datetime, timedelta

espn_proxy = Blueprint('espn_proxy', __name__)

ESPN_API_BASE = 'https://site.api.espn.com/apis/site/v2/sports'

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@espn_proxy.route('/espn/scoreboard', methods=['GET'])
def get_scoreboard():
    try:
        # Get query parameters from the request
        sport = request.args.get('sport')
        league_id = request.args.get('leagueId')  # For soccer
        league = request.args.get('league')       # For other sports
        dates = request.args.get('dates')
        limit = request.args.get('limit', '100')

        if not sport:
            return jsonify({'error': 'Sport parameter is required'}), 400

        # Log request parameters
        logger.info(f"Scoreboard request - Sport: {sport}, League: {league or league_id}, Dates: {dates}")
        
        # Format today's date in YYYYMMDD format
        today = datetime.now().strftime('%Y%m%d')
        
        # For soccer, we need to include the league in the URL path
        if sport == 'soccer':
            if not league_id:
                return jsonify({'error': 'League ID is required for soccer'}), 400
                
            url = f"{ESPN_API_BASE}/soccer/{league_id}/scoreboard"
        else:
            # For other sports, construct the URL with the sport and league
            if not league:
                return jsonify({'error': f'League parameter is required for {sport}'}), 400
            
            url = f"{ESPN_API_BASE}/{sport}/{league}/scoreboard"
        
        params = {
            'limit': limit,
            'dates': today
        }
        
        logger.info(f"Requesting URL: {url}")
        logger.info(f"With params: {params}")
        
        # Forward the request to ESPN API
        response = requests.get(url, params=params)
        
        # Log response status and headers
        logger.info(f"ESPN Response status: {response.status_code}")
        logger.info(f"ESPN Response headers: {dict(response.headers)}")
        
        if response.status_code != 200:
            logger.error(f"ESPN API error: {response.text}")
            return jsonify({
                'error': 'ESPN API error',
                'status': response.status_code,
                'details': response.text
            }), response.status_code

        # Return the response from ESPN
        return jsonify(response.json()), response.status_code

    except requests.RequestException as e:
        logger.error(f"Request error: {str(e)}")
        return jsonify({'error': 'Failed to fetch data from ESPN API', 'details': str(e)}), 500
    except Exception as e:
        logger.error(f"General error: {str(e)}")
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@espn_proxy.route('/espn/teams', methods=['GET'])
def get_teams():
    try:
        sport = request.args.get('sport')
        league = request.args.get('league')
        
        if not sport:
            return jsonify({'error': 'Sport parameter is required'}), 400
            
        logger.info(f"Teams request - Sport: {sport}, League: {league}")
        
        # For soccer, include the league in the URL path
        if sport == 'soccer':
            if not league:
                return jsonify({'error': 'League parameter is required for soccer'}), 400
                
            url = f"{ESPN_API_BASE}/soccer/{league}/teams"
            params = {}
        else:
            url = f"{ESPN_API_BASE}/{sport}/teams"
            params = {'league': league} if league else {}
            
        logger.info(f"Requesting teams URL: {url}")
        logger.info(f"With params: {params}")
        
        response = requests.get(url, params=params)
        
        if response.status_code != 200:
            logger.error(f"ESPN API error: {response.text}")
            return jsonify({
                'error': 'ESPN API error',
                'status': response.status_code,
                'details': response.text
            }), response.status_code
            
        return jsonify(response.json()), response.status_code

    except requests.RequestException as e:
        logger.error(f"Teams request error: {str(e)}")
        return jsonify({'error': 'Failed to fetch teams from ESPN API', 'details': str(e)}), 500
    except Exception as e:
        logger.error(f"General error in teams endpoint: {str(e)}")
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@espn_proxy.route('/espn/match', methods=['GET'])
def get_match_details():
    try:
        match_id = request.args.get('match_id')
        sport = request.args.get('sport', 'soccer')
        league = request.args.get('league')
        
        if not match_id:
            return jsonify({'error': 'Match ID is required'}), 400
            
        logger.info(f"Match details request - ID: {match_id}, Sport: {sport}, League: {league}")
        
        # Map league names to ESPN API format
        league_mapping = {
            'Premier League': 'eng.1',
            'La Liga': 'esp.1',
            'Bundesliga': 'ger.1',
            'Serie A': 'ita.1',
            'NBA': 'nba',
            'MLB': 'mlb',
            'NFL': 'nfl',
            'NHL': 'nhl'
        }
        
        # Use mapped league ID if available, otherwise use provided league
        api_league = league_mapping.get(league, league)
        
        # Construct the URL for match details
        if sport == 'soccer':
            url = f"{ESPN_API_BASE}/soccer/{api_league}/summary"
            params = {'event': match_id}
        else:
            url = f"{ESPN_API_BASE}/{sport}/{api_league}/summary"
            params = {'event': match_id}
            
        logger.info(f"Requesting match details URL: {url}")
        logger.info(f"With params: {params}")
        
        response = requests.get(url, params=params)
        
        if response.status_code != 200:
            logger.error(f"ESPN API error: {response.text}")
            return jsonify({
                'error': 'ESPN API error',
                'status': response.status_code,
                'details': response.text
            }), response.status_code
            
        match_data = response.json()
        
        # Extract scoring plays and format them for the frontend
        formatted_data = {
            'id': match_id,
            'home_team': {
                'scorers': [],
                'score': '0'
            },
            'away_team': {
                'scorers': [],
                'score': '0'
            }
        }
        
        if sport == 'soccer':
            if 'scoringPlays' in match_data:
                for play in match_data['scoringPlays']:
                    scorer_data = {
                        'scorer': play.get('scorer', {}).get('name', 'Unknown'),
                        'assist': play.get('assist', {}).get('name', ''),
                        'minute': str(play.get('clock', {}).get('displayValue', ''))
                    }
                    
                    if play.get('team', {}).get('homeAway') == 'home':
                        formatted_data['home_team']['scorers'].append(scorer_data)
                    else:
                        formatted_data['away_team']['scorers'].append(scorer_data)
        else:
            # For other sports, handle scoring differently based on the sport
            if 'boxscore' in match_data:
                formatted_data['home_team']['score'] = str(match_data['boxscore'].get('teams', [])[0].get('score', '0'))
                formatted_data['away_team']['score'] = str(match_data['boxscore'].get('teams', [])[1].get('score', '0'))
        
        # Update scores from header if available
        if 'header' in match_data and 'competitions' in match_data['header']:
            competition = match_data['header']['competitions'][0]
            for competitor in competition.get('competitors', []):
                if competitor.get('homeAway') == 'home':
                    formatted_data['home_team']['score'] = competitor.get('score', '0')
                else:
                    formatted_data['away_team']['score'] = competitor.get('score', '0')
                    
        return jsonify(formatted_data), 200

    except requests.RequestException as e:
        logger.error(f"Match details request error: {str(e)}")
        return jsonify({'error': 'Failed to fetch match details from ESPN API', 'details': str(e)}), 500
    except Exception as e:
        logger.error(f"General error in match details endpoint: {str(e)}")
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@espn_proxy.route('/espn/<sport>/<league>/teams/<team_id>/roster', methods=['GET'])
def get_team_roster(sport, league, team_id):
    try:
        logger.info(f"Roster request - Sport: {sport}, League: {league}, Team: {team_id}")
        
        # Map league names to ESPN API format
        league_mapping = {
            'Premier League': 'eng.1',
            'La Liga': 'esp.1',
            'Bundesliga': 'ger.1',
            'Serie A': 'ita.1',
            'MLB': 'mlb',
            'NBA': 'nba',
            'NFL': 'nfl',
            'NHL': 'nhl'
        }
        
        # Map league names to their correct sports
        league_to_sport = {
            'Premier League': 'soccer',
            'La Liga': 'soccer',
            'Bundesliga': 'soccer',
            'Serie A': 'soccer',
            'MLB': 'baseball',
            'NBA': 'basketball',
            'NFL': 'football',
            'NHL': 'hockey'
        }
        
        # Use mapped league ID if available, otherwise use provided league
        api_league = league_mapping.get(league, league)
        
        # Get the correct sport based on the league
        api_sport = league_to_sport.get(league, sport)
        logger.info(f"Using sport: {api_sport} for league: {league}")
            
        # Construct the URL for roster request
        if api_sport == 'soccer':
            url = f"{ESPN_API_BASE}/{api_sport}/{api_league}/teams/{team_id}/roster"
            params = {}
        else:
            url = f"{ESPN_API_BASE}/{api_sport}/{api_league}/teams/{team_id}"
            params = {'enable': 'roster'}
            
        logger.info(f"Requesting roster URL: {url}")
        logger.info(f"With params: {params}")
        
        response = requests.get(url, params=params)
        
        # Log response status and headers
        logger.info(f"ESPN Response status: {response.status_code}")
        logger.info(f"ESPN Response headers: {dict(response.headers)}")
        
        if response.status_code != 200:
            logger.error(f"ESPN API error: {response.text}")
            return jsonify({
                'error': 'ESPN API error',
                'status': response.status_code,
                'details': response.text
            }), response.status_code
        
        data = response.json()
        logger.info(f"ESPN Response data structure: {list(data.keys())}")
        
        # Transform the response based on sport
        roster_data = {
            'athletes': []
        }
        
        if api_sport == 'soccer':
            # For soccer, the roster is directly in the response
            if 'roster' in data:
                roster_data['athletes'] = data['roster']
            elif 'athletes' in data:
                roster_data['athletes'] = data['athletes']
        else:
            # For other sports, extract roster from team data
            if 'team' in data and 'athletes' in data['team']:
                roster_data['athletes'] = data['team']['athletes']
            elif 'athletes' in data:
                roster_data['athletes'] = data['athletes']
        
        logger.info(f"Found {len(roster_data['athletes'])} players in roster")
        return jsonify(roster_data), 200

    except requests.RequestException as e:
        logger.error(f"Roster request error: {str(e)}")
        return jsonify({'error': 'Failed to fetch roster from ESPN API', 'details': str(e)}), 500
    except Exception as e:
        logger.error(f"General error in roster endpoint: {str(e)}")
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500 