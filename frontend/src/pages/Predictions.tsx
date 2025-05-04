import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  SelectChangeEvent,
  CircularProgress,
  Link,
  Avatar,
  Chip,
  Divider,
  Paper,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  Tooltip,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
  RssFeed as RssIcon,
  LocationOn as LocationIcon,
  Stadium as StadiumIcon,
  Person as PersonIcon,
  Cake as CakeIcon,
  Scale as ScaleIcon,
  Height as HeightIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { TeamStats, TeamMatch, LeagueTeam, getPlayerPrediction, getMatchPrediction } from '../services/sportsApi';
import { PREDICTION_CATEGORIES, PredictionCategory } from '../services/mockData';
import espnApi, { ESPNTeam, ESPNPlayer, ESPNLeague, LeagueIds } from '../services/espnApi';
import MatchSchedule, { Match } from '../components/MatchSchedule';
import type { SportType } from '../types/sports';
import PredictionForm from '../components/PredictionForm';

// Define available sports and soccer leagues
const SPORTS = [
  { id: 'soccer', name: 'Soccer' },
  { id: 'basketball', name: 'Basketball' },
  { id: 'baseball', name: 'Baseball' },
  { id: 'football', name: 'Football' },
  { id: 'hockey', name: 'Hockey' }
];

const SOCCER_LEAGUES = [
  { id: 'eng.1', name: 'English Premier League' },
  { id: 'esp.1', name: 'La Liga' },
  { id: 'ger.1', name: 'Bundesliga' },
  { id: 'ita.1', name: 'Serie A' }
];

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

const ConfidenceMeter = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  marginTop: theme.spacing(1),
}));

const SocialLink = styled(Link)(({ theme }) => ({
  marginRight: theme.spacing(1),
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

interface PredictionAnalysis {
  confidence: number;
  reasoning: string[];
  recentForm: string;
  matchupAnalysis: string;
}

interface TeamInfo {
  id: string;
  name: string;
  logo: string;
  stadium: string;
  founded: number;
  league: string;
}

interface PlayerInfo {
  id: string;
  name: string;
  number: string;
  position: string;
  nationality: string;
  age: number;
  photo: string;
  teamId: string;
  birthLocation: string;
  height: string;
  weight: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
}

// Sport to League mapping
const sportLeagues: Record<SportType, string[]> = {
  'soccer': ['eng.1', 'esp.1', 'ger.1', 'ita.1'],  // Premier League, La Liga, Bundesliga, Serie A
  'basketball': ['nba'],
  'baseball': ['mlb'],
  'football': ['nfl'],
  'hockey': ['nhl']
};

// League display names
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

const Predictions = () => {
  const [selectedSport, setSelectedSport] = useState<SportType | ''>('');
  const [selectedLeague, setSelectedLeague] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [selectedOpponent, setSelectedOpponent] = useState<string>('');
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const [isHomeGame, setIsHomeGame] = useState<boolean>(true);
  const [weatherCondition, setWeatherCondition] = useState<string>('clear');
  const [teamSchedule, setTeamSchedule] = useState<TeamMatch[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [teamStats, setTeamStats] = useState<TeamStats | null>(null);
  const [players, setPlayers] = useState<PlayerInfo[]>([]);
  const [lastMatches, setLastMatches] = useState<TeamMatch[]>([]);
  const [nextMatches, setNextMatches] = useState<TeamMatch[]>([]);
  const [leagueTeams, setLeagueTeams] = useState<LeagueTeam[]>([]);
  const [currentTeams, setCurrentTeams] = useState<TeamInfo[]>([]);
  const [currentPlayers, setCurrentPlayers] = useState<PlayerInfo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [predictionType, setPredictionType] = useState<'over' | 'under'>('over');
  const [targetValue, setTargetValue] = useState<string>('');
  const [predictionAnalysis, setPredictionAnalysis] = useState<PredictionAnalysis | null>(null);
  const [leagues, setLeagues] = useState<{ id: string; name: string }[]>([]);
  const [teams, setTeams] = useState<TeamInfo[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [showPredictionForm, setShowPredictionForm] = useState(false);

  // Weather conditions for outdoor sports
  const WEATHER_CONDITIONS = [
    { value: 'clear', label: 'Clear Sky' },
    { value: 'cloudy', label: 'Cloudy' },
    { value: 'rain', label: 'Rain' },
    { value: 'snow', label: 'Snow' },
    { value: 'wind', label: 'Windy' },
    { value: 'heat', label: 'Extreme Heat' },
    { value: 'cold', label: 'Extreme Cold' }
  ];

  const mapESPNTeamToTeam = (espnTeam: ESPNTeam): TeamInfo => ({
    id: espnTeam.id,
    name: espnTeam.name,
    logo: espnTeam.logo,
    stadium: espnTeam.venue?.fullName || 'Unknown Stadium',
    founded: espnTeam.founded || 0,
    league: espnTeam.league
  });

  const mapESPNPlayerToPlayer = (espnPlayer: ESPNPlayer): PlayerInfo => ({
    id: espnPlayer.id,
    name: espnPlayer.fullName,
    number: espnPlayer.jersey,
    position: espnPlayer.position,
    nationality: espnPlayer.nationality,
    age: espnPlayer.age,
    photo: espnPlayer.headshot?.href || '',
    teamId: espnPlayer.team.id,
    birthLocation: 'Unknown',
    height: 'Unknown',
    weight: 'Unknown'
  });

  useEffect(() => {
    if (selectedSport) {
      setLeagues(
        sportLeagues[selectedSport].map(id => ({
          id,
          name: leagueNames[id]
        }))
      );
      setSelectedLeague('');
      setMatches([]);
    }
  }, [selectedSport]);

  useEffect(() => {
    if (selectedLeague) {
      loadMatches();
    }
  }, [selectedLeague]);

  useEffect(() => {
    const fetchTeamPlayers = async () => {
      if (selectedTeam && selectedSport) {
        try {
          const teamPlayers = await espnApi.getPlayers(selectedSport, selectedTeam, selectedLeague);
          setCurrentPlayers(teamPlayers.map(p => ({
            id: p.id,
            name: p.fullName,
            position: p.position,
            number: p.jersey,
            nationality: p.nationality,
            age: p.age,
            photo: p.headshot?.href || '',
            teamId: selectedTeam,
            birthLocation: 'Unknown',
            height: 'Unknown',
            weight: 'Unknown',
            facebook: undefined,
            twitter: undefined,
            instagram: undefined,
            youtube: undefined
          })));
        } catch (error) {
          console.error('Error fetching players:', error);
          setCurrentPlayers([]);
        }
      }
    };

    fetchTeamPlayers();
  }, [selectedTeam, selectedSport, selectedLeague]);

  const loadMatches = async () => {
    if (!selectedSport || !selectedLeague) return;
    
    setLoading(true);
    try {
      console.log('Loading matches for sport:', selectedSport, 'league:', selectedLeague);
      const matches = await espnApi.getTeamSchedule(selectedSport, selectedLeague);
      console.log('Loaded matches:', matches);
      
      // Sort matches by date and add sport field
      const sortedMatches = matches
        .map(match => ({
          ...match,
          sport: selectedSport // Add the sport field to each match
        }))
        .sort((a: Match, b: Match) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );

      setMatches(sortedMatches);
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSportChange = (event: SelectChangeEvent) => {
    const sport = event.target.value as SportType;
    setSelectedSport(sport);
  };

  const handleLeagueChange = (event: SelectChangeEvent) => {
    setSelectedLeague(event.target.value);
  };

  const handleMatchSelect = (match: Match) => {
    setSelectedMatch(match);
    setShowPredictionForm(true);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Sports Predictions
      </Typography>

      <Box sx={{ mb: 4 }}>
        <FormControl sx={{ mr: 2, minWidth: 200 }}>
          <InputLabel>Select Sport</InputLabel>
          <Select
            value={selectedSport}
            label="Select Sport"
            onChange={handleSportChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {SPORTS.map((sport) => (
              <MenuItem key={sport.id} value={sport.id}>
                {sport.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedSport && (
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Select League</InputLabel>
            <Select
              value={selectedLeague}
              label="Select League"
              onChange={handleLeagueChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {leagues.map((league) => (
                <MenuItem key={league.id} value={league.id}>
                  {league.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : matches.length > 0 ? (
        <MatchSchedule matches={matches} onMatchSelect={handleMatchSelect} />
      ) : selectedLeague ? (
        <Typography variant="body1" sx={{ mt: 4, textAlign: 'center' }}>
          No upcoming matches found for the selected league.
        </Typography>
      ) : null}

      {showPredictionForm && selectedMatch && (
        <PredictionForm
          open={showPredictionForm}
          onClose={() => setShowPredictionForm(false)}
          match={selectedMatch}
          sport={selectedSport}
        />
      )}
    </Container>
  );
};

export default Predictions; 