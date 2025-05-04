import axios from 'axios';
import { SportType } from '../types/sports';

const API_BASE = 'http://localhost:8080/api';  // Update this to match your backend URL

export interface ESPNTeam {
  id: string;
  name: string;
  logo: string;
  venue: {
    fullName: string;
  };
  founded: number;
  league: string;
}

export interface ESPNPlayer {
  id: string;
  fullName: string;
  position: string;
  jersey: string;
  nationality: string;
  age: number;
  headshot: {
    href: string;
  };
  team: {
    id: string;
  };
}

export interface ESPNLeague {
  id: string;
  name: string;
  country: string;
  logos: {
    href: string;
  }[];
}

export type LeagueIds = {
  [key in 'epl' | 'laliga' | 'bundesliga' | 'seriea' | 'nba' | 'mlb' | 'nfl' | 'nhl']: string;
};

type SportEndpoints = {
  [key in 'soccer' | 'basketball' | 'baseball' | 'football' | 'hockey']: string;
};

const sportEndpoints: SportEndpoints = {
  'soccer': 'soccer',
  'basketball': 'basketball',
  'baseball': 'baseball',
  'football': 'football',
  'hockey': 'hockey'
};

// Map league IDs to their respective sports
const leagueToSport: { [key: string]: keyof SportEndpoints } = {
  'Premier League': 'soccer',
  'La Liga': 'soccer',
  'Bundesliga': 'soccer',
  'Serie A': 'soccer',
  'MLB': 'baseball',
  'NBA': 'basketball',
  'NFL': 'football',
  'NHL': 'hockey'
};

const leagueIds: LeagueIds = {
  'epl': 'eng.1',      // English Premier League
  'laliga': 'esp.1',   // La Liga
  'bundesliga': 'ger.1', // Bundesliga
  'seriea': 'ita.1',   // Serie A
  'nba': 'nba',        // NBA
  'mlb': 'mlb',        // MLB
  'nfl': 'nfl',        // NFL
  'nhl': 'nhl'         // NHL
};

class ESPNApiService {
  async getLeagues(sport: keyof SportEndpoints): Promise<ESPNLeague[]> {
    try {
      const response = await axios.get(`${API_BASE}/espn/leagues`, {
        params: {
          sport: sportEndpoints[sport]
        }
      });
      return response.data.sports?.[0]?.leagues?.map((league: any) => ({
        id: league.id,
        name: league.name,
        country: league.country || '',
        logos: league.logos || []
      })) || [];
    } catch (error) {
      console.error('Error fetching leagues:', error);
      return [];
    }
  }

  async getTeams(sport: keyof SportEndpoints, leagueId: string): Promise<ESPNTeam[]> {
    try {
      const endpoint = `${API_BASE}/espn/teams`;
      console.log('Fetching teams from:', endpoint);
      
      const response = await axios.get(endpoint, {
        params: {
          sport: sportEndpoints[sport],
          league: leagueId
        }
      });
      const teams = response.data.sports?.[0]?.leagues?.[0]?.teams || [];
      
      return teams.map((teamEntry: any) => ({
        id: teamEntry.team.id,
        name: teamEntry.team.name,
        logo: teamEntry.team.logos?.[0]?.href || '',
        venue: teamEntry.team.venue || { fullName: 'Unknown Venue' },
        founded: teamEntry.team.founded || 0,
        league: leagueId
      }));
    } catch (error) {
      console.error('Error fetching teams:', error);
      return [];
    }
  }

  async getPlayers(sport: keyof SportEndpoints, teamId: string, leagueId?: string): Promise<ESPNPlayer[]> {
    try {
      console.log(`Fetching players for sport: ${sport}, team: ${teamId}, league: ${leagueId}`);
      
      if (!leagueId) {
        console.error('League ID is required');
        return [];
      }

      // Map league names to ESPN API format if needed
      const leagueMapping: { [key: string]: string } = {
        'Premier League': 'eng.1',
        'La Liga': 'esp.1',
        'Bundesliga': 'ger.1',
        'Serie A': 'ita.1',
        'MLB': 'mlb',
        'NBA': 'nba',
        'NFL': 'nfl',
        'NHL': 'nhl'
      };

      // Get the correct sport based on the league
      const correctSport = leagueToSport[leagueId] || sport;
      const apiLeagueId = leagueMapping[leagueId] || leagueId;
      
      console.log(`Using sport: ${correctSport} for league: ${leagueId}`);
      const endpoint = `${API_BASE}/espn/${sportEndpoints[correctSport]}/${apiLeagueId}/teams/${teamId}/roster`;
      console.log('Fetching players from:', endpoint);
      
      const response = await axios.get(endpoint);
      console.log('ESPN API Response:', response.data);
      
      if (!response.data.athletes) {
        console.error('Invalid response format - athletes not found:', response.data);
        return [];
      }

      return response.data.athletes.map((player: any) => {
        console.log('Mapping player:', player);
        
        // Handle different response formats for different sports
        const displayName = player.displayName || player.fullName || player.name || '';
        const position = player.position?.name || player.position?.abbreviation || player.position || '';
        const jersey = player.jersey || player.uniform || '';
        const nationality = player.nationality || player.birthCountry || '';
        const age = player.age || this.calculateAge(player.dateOfBirth) || 0;
        const headshot = player.headshot || player.image || { href: '' };
        
        return {
          id: player.id,
          fullName: displayName,
          position: position,
          jersey: String(jersey),
          nationality: nationality,
          age: age,
          headshot: headshot,
          team: {
            id: teamId
          }
        };
      });
    } catch (error) {
      console.error('Error fetching players:', error);
      return [];
    }
  }

  private calculateAge(dateOfBirth: string): number {
    if (!dateOfBirth) return 0;
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  async getTeamStats(sport: keyof SportEndpoints, teamId: string) {
    try {
      const response = await axios.get(
        `${API_BASE}/espn/${sport}/teams/${teamId}/statistics`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching team stats:', error);
      return null;
    }
  }

  async getPlayerStats(sport: keyof SportEndpoints, playerId: string) {
    try {
      const response = await axios.get(
        `${API_BASE}/espn/${sport}/athletes/${playerId}/statistics`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching player stats:', error);
      return null;
    }
  }

  async getTeamSchedule(sport: keyof SportEndpoints, leagueId: string) {
    try {
      const endpoint = `${API_BASE}/espn/scoreboard`;
      console.log('Fetching schedule from:', endpoint);
      console.log('Sport:', sport);
      console.log('League ID:', leagueId);
      
      const params: any = {
        sport: sportEndpoints[sport],
        limit: 100
      };

      if (sport === 'soccer') {
        params.leagueId = leagueId;
      } else {
        params.league = leagueId;
      }
      
      const response = await axios.get(endpoint, { params });
      console.log('Schedule response:', response.data);

      if (!response.data.events) {
        console.error('Invalid response format - events not found:', response.data);
        return [];
      }

      const processedEvents = await Promise.all(response.data.events.map(async (event: any) => {
        const homeTeam = event.competitions?.[0]?.competitors?.find((c: any) => c.homeAway === 'home');
        const awayTeam = event.competitions?.[0]?.competitors?.find((c: any) => c.homeAway === 'away');
        
        if (!homeTeam || !awayTeam) {
          console.error('Missing team data for event:', event);
          return null;
        }

        const matchDetails = await this.getMatchDetails(event.id, sport, leagueId);
        console.log('Match details for game', event.id, ':', matchDetails);

        const homeScorers = matchDetails?.goals?.filter((goal: any) => goal.team.id === homeTeam.id) || [];
        const awayScorers = matchDetails?.goals?.filter((goal: any) => goal.team.id === awayTeam.id) || [];

        return {
          id: event.id,
          date: event.date,
          time: new Date(event.date).toLocaleTimeString(),
          name: event.name,
          shortName: event.shortName,
          home_team: {
            id: homeTeam.id,
            name: homeTeam.team.name,
            score: homeTeam.score,
            logo: homeTeam.team.logo || homeTeam.team.logos?.[0]?.href || '',
            scorers: homeScorers.map((goal: any) => ({
              scorer: goal.scorer.name,
              assist: goal.assist?.name || '',
              minute: goal.minute
            }))
          },
          away_team: {
            id: awayTeam.id,
            name: awayTeam.team.name,
            score: awayTeam.score,
            logo: awayTeam.team.logo || awayTeam.team.logos?.[0]?.href || '',
            scorers: awayScorers.map((goal: any) => ({
              scorer: goal.scorer.name,
              assist: goal.assist?.name || '',
              minute: goal.minute
            }))
          },
          venue: event.competitions?.[0]?.venue?.fullName || 'TBD',
          league: this.getLeagueName(sport, leagueId),
          status: {
            type: event.status?.type?.name || 'Scheduled',
            state: event.status?.type?.state || 'pre',
            detail: event.status?.type?.detail || ''
          }
        };
      }));

      return processedEvents.filter(Boolean);

    } catch (error) {
      console.error('Error fetching schedule:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', error.response?.data);
      }
      return [];
    }
  }

  private async getMatchDetails(gameId: string, sport: keyof SportEndpoints, leagueId: string): Promise<any> {
    try {
      const response = await axios.get(`${API_BASE}/espn/match`, {
        params: {
          match_id: gameId,
          sport: sportEndpoints[sport],
          league: leagueId
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching match details:', error);
      return null;
    }
  }

  private getLeagueName(sport: keyof SportEndpoints, leagueId: string): string {
    const leagueNames: Record<string, string> = {
      'eng.1': 'Premier League',
      'esp.1': 'La Liga',
      'ger.1': 'Bundesliga',
      'ita.1': 'Serie A',
      'nba': 'NBA',
      'mlb': 'MLB',
      'nfl': 'NFL',
      'nhl': 'NHL'
    };
    return leagueNames[leagueId] || sport.toUpperCase();
  }

  private getDefaultVenue(sport: keyof SportEndpoints, teamName: string): string {
    const venues: Record<string, string> = {
      'Arsenal': 'Emirates Stadium',
      'Manchester City': 'Etihad Stadium',
      'Liverpool': 'Anfield',
      'Chelsea': 'Stamford Bridge',
      'Los Angeles Lakers': 'Crypto.com Arena',
      'Boston Celtics': 'TD Garden',
      'New York Yankees': 'Yankee Stadium',
      'Boston Red Sox': 'Fenway Park',
      'Kansas City Chiefs': 'Arrowhead Stadium',
      'San Francisco 49ers': "Levi's Stadium",
      'Boston Bruins': 'TD Garden',
      'New York Rangers': 'Madison Square Garden'
    };
    return venues[teamName] || 'Home Stadium';
  }

  async getGameOdds(sport: keyof SportEndpoints, gameId: string) {
    try {
      const response = await axios.get(
        `${API_BASE}/espn/${sport}/events/${gameId}/competitions/${gameId}/odds`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching game odds:', error);
      return null;
    }
  }

  async getPlayerPrediction(
    sport: keyof SportEndpoints,
    playerName: string,
    teamName: string
  ) {
    // Since ESPN doesn't provide prediction APIs, we'll return a mock prediction
    return {
      player_stats_prediction: [
        { stat: 'Points', prediction: Math.floor(Math.random() * 30) },
        { stat: 'Assists', prediction: Math.floor(Math.random() * 10) },
        { stat: 'Rebounds', prediction: Math.floor(Math.random() * 15) }
      ],
      recent_form_analysis: `Based on recent games and statistical trends for ${playerName}`
    };
  }

  async getMatchPrediction(
    sport: keyof SportEndpoints,
    teamName: string,
    opponentName: string
  ) {
    // Since ESPN doesn't provide prediction APIs, we'll return a mock prediction
    return {
      matchup_analysis: `Historical matchup analysis between ${teamName} and ${opponentName} suggests a competitive game.`
    };
  }
}

export const espnApi = new ESPNApiService();
export default espnApi;