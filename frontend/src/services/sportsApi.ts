import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export interface TeamStats {
    id: string;
    name: string;
    league: string;
    stadium: string;
    description: string;
    formed_year: string;
    country: string;
    logo: string;
    website: string;
    facebook: string;
    twitter: string;
    instagram: string;
    youtube: string;
    rss: string;
    stadium_thumb: string;
    stadium_description: string;
    stadium_location: string;
    stadium_capacity: string;
    alternate: string;
}

export interface Player {
    id: string;
    name: string;
    nationality: string;
    position: string;
    description: string;
    thumb: string;
    signing: string;
    wage: string;
    birth_location: string;
    date_born: string;
    date_signed: string;
    facebook: string;
    twitter: string;
    instagram: string;
    youtube: string;
    height: string;
    weight: string;
    gender: string;
    sport: string;
    team: string;
    team2: string;
    team3: string;
    team4: string;
    team5: string;
    team6: string;
    team7: string;
    team8: string;
    team9: string;
    team10: string;
    team11: string;
    team12: string;
    team13: string;
    team14: string;
    team15: string;
    team16: string;
    team17: string;
    team18: string;
    team19: string;
    team20: string;
}

export interface TeamMatch {
    id: string;
    date: string;
    home_team: string;
    away_team: string;
    home_score?: string;
    away_score?: string;
    venue: string;
    league: string;
    time?: string;
    season: string;
    filename: string;
    thumbnail: string;
    video: string;
    status: string;
    postponed: string;
    locked: string;
}

export interface LeagueTeam {
    id: string;
    name: string;
    stadium: string;
    logo: string;
    website: string;
    facebook: string;
    twitter: string;
    instagram: string;
    youtube: string;
    rss: string;
    stadium_thumb: string;
    stadium_description: string;
    stadium_location: string;
    stadium_capacity: string;
    alternate: string;
}

export interface LeagueTableEntry {
    position: number;
    team_id: string;
    team_name: string;
    played: number;
    win: number;
    draw: number;
    loss: number;
    goals_for: number;
    goals_against: number;
    goal_difference: number;
    points: number;
    form: string;
    description: string;
    badge: string;
}

const sportsApi = {
    getTeamStats: async (teamName: string): Promise<TeamStats> => {
        try {
            const response = await axios.get(`${API_BASE_URL}/sports/team/${teamName}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching team stats for ${teamName}:`, error);
            throw error;
        }
    },

    getLeagueTeams: async (leagueId: string): Promise<LeagueTeam[]> => {
        try {
            const response = await axios.get(`${API_BASE_URL}/sports/league/${leagueId}/teams`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching teams for league ${leagueId}:`, error);
            return [];
        }
    },

    getTeamPlayers: async (teamId: string): Promise<Player[]> => {
        try {
            console.log(`Fetching players for team ID: ${teamId}`);
            const response = await axios.get(`${API_BASE_URL}/sports/team/${teamId}/players`);
            console.log(`Received ${response.data.length} players from API`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching players for team ${teamId}:`, error);
            return [];
        }
    },

    getLeagueTable: async (leagueId: string): Promise<LeagueTableEntry[]> => {
        try {
            const response = await axios.get(`${API_BASE_URL}/sports/league/${leagueId}/table`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching league table for ${leagueId}:`, error);
            return [];
        }
    },

    getTeamLastMatches: async (teamId: string): Promise<TeamMatch[]> => {
        try {
            const response = await axios.get(`${API_BASE_URL}/sports/teams/${teamId}/matches/recent`);
            if (!response.data || response.data.length === 0) {
                // Return mock data if no real data is available
                return [
                    {
                        id: '1',
                        date: '2024-03-15',
                        home_team: 'Team A',
                        away_team: 'Team B',
                        home_score: '2',
                        away_score: '1',
                        venue: 'Stadium A',
                        league: 'Premier League',
                        status: 'Finished',
                        season: '2023/24',
                        filename: '',
                        thumbnail: '',
                        video: '',
                        postponed: 'no',
                        locked: 'no'
                    },
                    {
                        id: '2',
                        date: '2024-03-10',
                        home_team: 'Team C',
                        away_team: 'Team A',
                        home_score: '0',
                        away_score: '3',
                        venue: 'Stadium C',
                        league: 'Premier League',
                        status: 'Finished',
                        season: '2023/24',
                        filename: '',
                        thumbnail: '',
                        video: '',
                        postponed: 'no',
                        locked: 'no'
                    },
                    {
                        id: '3',
                        date: '2024-03-05',
                        home_team: 'Team A',
                        away_team: 'Team D',
                        home_score: '1',
                        away_score: '1',
                        venue: 'Stadium A',
                        league: 'Premier League',
                        status: 'Finished',
                        season: '2023/24',
                        filename: '',
                        thumbnail: '',
                        video: '',
                        postponed: 'no',
                        locked: 'no'
                    }
                ];
            }
            return response.data;
        } catch (error) {
            console.error(`Error fetching last matches for team ${teamId}:`, error);
            // Return mock data on error
            return [
                {
                    id: '1',
                    date: '2024-03-15',
                    home_team: 'Team A',
                    away_team: 'Team B',
                    home_score: '2',
                    away_score: '1',
                    venue: 'Stadium A',
                    league: 'Premier League',
                    status: 'Finished',
                    season: '2023/24',
                    filename: '',
                    thumbnail: '',
                    video: '',
                    postponed: 'no',
                    locked: 'no'
                },
                {
                    id: '2',
                    date: '2024-03-10',
                    home_team: 'Team C',
                    away_team: 'Team A',
                    home_score: '0',
                    away_score: '3',
                    venue: 'Stadium C',
                    league: 'Premier League',
                    status: 'Finished',
                    season: '2023/24',
                    filename: '',
                    thumbnail: '',
                    video: '',
                    postponed: 'no',
                    locked: 'no'
                },
                {
                    id: '3',
                    date: '2024-03-05',
                    home_team: 'Team A',
                    away_team: 'Team D',
                    home_score: '1',
                    away_score: '1',
                    venue: 'Stadium A',
                    league: 'Premier League',
                    status: 'Finished',
                    season: '2023/24',
                    filename: '',
                    thumbnail: '',
                    video: '',
                    postponed: 'no',
                    locked: 'no'
                }
            ];
        }
    },

    getTeamNextMatches: async (teamId: string): Promise<TeamMatch[]> => {
        try {
            const response = await axios.get(`${API_BASE_URL}/sports/teams/${teamId}/matches/upcoming`);
            if (!response.data || response.data.length === 0) {
                // Return mock data if no real data is available
                return [
                    {
                        id: '4',
                        date: '2024-03-25',
                        home_team: 'Team B',
                        away_team: 'Team A',
                        venue: 'Stadium B',
                        league: 'Premier League',
                        time: '15:00',
                        status: 'Scheduled',
                        season: '2023/24',
                        filename: '',
                        thumbnail: '',
                        video: '',
                        postponed: 'no',
                        locked: 'no'
                    },
                    {
                        id: '5',
                        date: '2024-04-01',
                        home_team: 'Team A',
                        away_team: 'Team E',
                        venue: 'Stadium A',
                        league: 'Premier League',
                        time: '19:45',
                        status: 'Scheduled',
                        season: '2023/24',
                        filename: '',
                        thumbnail: '',
                        video: '',
                        postponed: 'no',
                        locked: 'no'
                    },
                    {
                        id: '6',
                        date: '2024-04-08',
                        home_team: 'Team F',
                        away_team: 'Team A',
                        venue: 'Stadium F',
                        league: 'Premier League',
                        time: '20:00',
                        status: 'Scheduled',
                        season: '2023/24',
                        filename: '',
                        thumbnail: '',
                        video: '',
                        postponed: 'no',
                        locked: 'no'
                    }
                ];
            }
            return response.data;
        } catch (error) {
            console.error(`Error fetching next matches for team ${teamId}:`, error);
            // Return mock data on error
            return [
                {
                    id: '4',
                    date: '2024-03-25',
                    home_team: 'Team B',
                    away_team: 'Team A',
                    venue: 'Stadium B',
                    league: 'Premier League',
                    time: '15:00',
                    status: 'Scheduled',
                    season: '2023/24',
                    filename: '',
                    thumbnail: '',
                    video: '',
                    postponed: 'no',
                    locked: 'no'
                },
                {
                    id: '5',
                    date: '2024-04-01',
                    home_team: 'Team A',
                    away_team: 'Team E',
                    venue: 'Stadium A',
                    league: 'Premier League',
                    time: '19:45',
                    status: 'Scheduled',
                    season: '2023/24',
                    filename: '',
                    thumbnail: '',
                    video: '',
                    postponed: 'no',
                    locked: 'no'
                },
                {
                    id: '6',
                    date: '2024-04-08',
                    home_team: 'Team F',
                    away_team: 'Team A',
                    venue: 'Stadium F',
                    league: 'Premier League',
                    time: '20:00',
                    status: 'Scheduled',
                    season: '2023/24',
                    filename: '',
                    thumbnail: '',
                    video: '',
                    postponed: 'no',
                    locked: 'no'
                }
            ];
        }
    }
};

export const getPlayerPrediction = async (
  sport: string,
  playerName: string,
  team: string,
  opponent: string,
  category: string,
  targetValue: number,
  isHomeGame: boolean,
  weather?: string
) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/predictions/player`, {
      sport,
      player_name: playerName,
      team,
      opponent,
      category,
      target_value: targetValue,
      is_home_game: isHomeGame,
      weather_condition: weather
    });
    return response.data;
  } catch (error) {
    console.error('Error getting player prediction:', error);
    throw error;
  }
};

export const getMatchPrediction = async (
  sport: string,
  team1: string,
  team2: string,
  matchType: string = 'regular season'
) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/predictions/match/${sport}/${team1}/${team2}?match_type=${matchType}`
    );
    return response.data;
  } catch (error) {
    console.error('Error getting match prediction:', error);
    throw error;
  }
};

export default sportsApi; 