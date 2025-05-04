import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  styled,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  SelectChangeEvent,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import { format } from 'date-fns';
import { SportType } from '../types/sports';
import { espnApi } from '../services/espnApi';
import { PREDICTION_CATEGORIES } from '../data/sportsData';
import axios from 'axios';

interface Scorer {
  scorer: string;
  assist: string;
  minute: string;
}

interface Team {
  id: string;
  name: string;
  score: string;
  logo: string;
  scorers: Scorer[];
}

export interface Match {
  id: string;
  date: string;
  time?: string;
  name: string;
  shortName: string;
  home_team: Team;
  away_team: Team;
  venue: string;
  league: string;
  status: {
    type: string;
    state: string;
    detail: string;
  };
  sport: SportType;
}

interface MatchScheduleProps {
  matches: Match[];
  onMatchSelect: (match: Match) => void;
}

interface Player {
  id: string;
  name: string;
  position: string;
  team: string;
}

interface PredictionType {
  category: string;
  type: 'over' | 'under';
  value: number;
}

interface PredictionAnalysis {
  player: string;
  team: string;
  category: string;
  prediction_type: string;
  target_value: number;
  confidence: number;
  analysis: string;
}

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: '#2d2d2d',
  color: 'white',
  '&:hover': {
    backgroundColor: '#3d3d3d',
  },
}));

const TeamBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const ScoreText = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.5rem',
  color: '#fff',
}));

const VenueText = styled(Typography)(({ theme }) => ({
  color: '#aaa',
  fontSize: '0.9rem',
}));

const ScorerText = styled(Typography)(({ theme }) => ({
  color: '#bbb',
  fontSize: '0.8rem',
  textAlign: 'center',
}));

const MatchSchedule: React.FC<MatchScheduleProps> = ({ matches, onMatchSelect }) => {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isPredictionOpen, setIsPredictionOpen] = useState(false);
  const [matchDetails, setMatchDetails] = useState<{ [key: string]: Match }>({});
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [selectedPredictionCategory, setSelectedPredictionCategory] = useState<string>('');
  const [predictionType, setPredictionType] = useState<'over' | 'under'>('over');
  const [predictionValue, setPredictionValue] = useState<string>('');
  const [availableCategories, setAvailableCategories] = useState<any[]>([]);
  const [predictionAnalysis, setPredictionAnalysis] = useState<PredictionAnalysis | null>(null);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatchDetails = async (match: Match) => {
      try {
        const response = await fetch(`/api/espn/match?match_id=${match.id}&sport=soccer&league=${encodeURIComponent(match.league)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch match details');
        }
        const data = await response.json();
        
        // Update match details with scorer information
        setMatchDetails(prev => ({
          ...prev,
          [match.id]: {
            ...match,
            home_team: {
              ...match.home_team,
              scorers: data.home_team.scorers,
              score: data.home_team.score
            },
            away_team: {
              ...match.away_team,
              scorers: data.away_team.scorers,
              score: data.away_team.score
            }
          }
        }));
      } catch (error) {
        console.error('Error fetching match details:', error);
      }
    };

    // Fetch details for each match
    matches.forEach(match => {
      if (match.status.type === 'STATUS_FINAL' || match.status.type === 'STATUS_IN_PROGRESS') {
        fetchMatchDetails(match);
      }
    });
  }, [matches]);

  const fetchPlayers = async (teamId: string, teamName: string) => {
    setLoadingPlayers(true);
    try {
      // Get the current match's league ID and sport from the match details
      const match = matches.find(m => m.home_team.id === teamId || m.away_team.id === teamId);
      if (!match) {
        console.error('Match not found for team:', teamId);
        setPlayers([]);
        return;
      }

      const leagueId = match.league;
      const sport = match.sport;
      
      console.log('Fetching players for sport:', sport, 'team:', teamName, 'league:', leagueId);
      const teamPlayers = await espnApi.getPlayers(sport, teamId, leagueId);
      console.log('Fetched players for team:', teamName, teamPlayers);
      
      const formattedPlayers = teamPlayers.map(p => ({
        id: p.id,
        name: p.fullName || 'Unknown Player',
        position: p.position || 'Unknown Position',
        team: teamName
      }));
      
      setPlayers(formattedPlayers);
    } catch (error) {
      console.error('Error fetching players:', error);
      setPlayers([]); // Reset players on error
    } finally {
      setLoadingPlayers(false);
    }
  };

  const formatMatchDate = (date: string, time?: string) => {
    try {
      const dateObj = new Date(date);
      const formattedDate = format(dateObj, 'MMM d, yyyy');
      return time ? `${formattedDate} at ${time}` : formattedDate;
    } catch (error) {
      console.error('Error formatting date:', error);
      return date;
    }
  };

  const handleMatchClick = (match: Match) => {
    setSelectedMatch(match);
    setIsPredictionOpen(true);
    // Reset all selections
    setSelectedTeam('');
    setSelectedPlayer('');
    setSelectedPredictionCategory('');
    setPredictionType('over');
    setPredictionValue('');
    setPlayers([]);
    // Set available categories based on the match's sport
    setAvailableCategories(PREDICTION_CATEGORIES[match.sport] || []);
  };

  const handleTeamChange = async (event: SelectChangeEvent) => {
    const teamId = event.target.value;
    setSelectedTeam(teamId);
    setSelectedPlayer('');
    
    if (selectedMatch && teamId) {
      const team = teamId === selectedMatch.home_team.id ? selectedMatch.home_team : selectedMatch.away_team;
      await fetchPlayers(teamId, team.name);
    }
  };

  const handlePlayerChange = (event: SelectChangeEvent) => {
    setSelectedPlayer(event.target.value);
    setSelectedPredictionCategory('');
    setPredictionType('over');
    setPredictionValue('');
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setSelectedPredictionCategory(event.target.value);
  };

  const handlePredictionTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newType: 'over' | 'under'
  ) => {
    if (newType !== null) {
      setPredictionType(newType);
    }
  };

  const handlePredictionValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (!isNaN(Number(value))) {
      setPredictionValue(value);
    }
  };

  const handlePredictionClose = () => {
    setIsPredictionOpen(false);
    setSelectedMatch(null);
    setSelectedTeam('');
    setSelectedPlayer('');
    setPlayers([]);
  };

  const getMatchWithDetails = (match: Match): Match => {
    return matchDetails[match.id] || match;
  };

  const handleSubmitPrediction = async () => {
    if (!selectedMatch || !selectedTeam || !selectedPlayer || !selectedPredictionCategory || !predictionValue) {
      return;
    }

    setIsAnalysisLoading(true);
    setAnalysisError(null);

    try {
      const selectedPlayerData = players.find(p => p.id === selectedPlayer);
      const response = await axios.post('http://localhost:8080/api/predictions/predict/player', {
        player_name: selectedPlayerData?.name,
        team: selectedTeam === selectedMatch.home_team.id ? selectedMatch.home_team.name : selectedMatch.away_team.name,
        category: selectedPredictionCategory,
        type: predictionType,
        value: parseFloat(predictionValue)
      });

      setPredictionAnalysis(response.data);
    } catch (error) {
      console.error('Error submitting prediction:', error);
      setAnalysisError('Failed to generate prediction analysis. Please try again.');
    } finally {
      setIsAnalysisLoading(false);
    }
  };

  const handleCloseAnalysis = () => {
    setPredictionAnalysis(null);
    handlePredictionClose();
  };

  const handlePredictionSubmit = () => {
    if (selectedMatch) {
      onMatchSelect(selectedMatch);
    }
    handlePredictionClose();
  };

  return (
    <Box>
      {matches.map((match) => {
        const matchWithDetails = getMatchWithDetails(match);
        return (
          <StyledCard key={match.id}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                {/* Date and Time */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" align="center" sx={{ color: '#fff' }}>
                    {formatMatchDate(matchWithDetails.date, matchWithDetails.time)}
                  </Typography>
                  <Typography variant="caption" align="center" sx={{ display: 'block', color: matchWithDetails.status.type === 'STATUS_FINAL' ? '#ff4444' : '#4CAF50' }}>
                    {matchWithDetails.status.type === 'STATUS_FINAL' ? 'FT' : matchWithDetails.status.detail}
                  </Typography>
                </Grid>

                {/* Teams */}
                <Grid item xs={5}>
                  <TeamBox>
                    <Avatar src={matchWithDetails.home_team.logo} alt={matchWithDetails.home_team.name} sx={{ width: 56, height: 56 }} />
                    <Typography variant="subtitle1" align="center">
                      {matchWithDetails.home_team.name} ({matchWithDetails.home_team.score || 0})
                    </Typography>
                    {matchWithDetails.home_team.scorers && matchWithDetails.home_team.scorers.length > 0 ? (
                      matchWithDetails.home_team.scorers.map((scorer, index) => (
                        <ScorerText key={index}>
                          ⚽ {scorer.scorer} {scorer.minute && `(${scorer.minute}')`}
                          {scorer.assist && <span> 👟 {scorer.assist}</span>}
                        </ScorerText>
                      ))
                    ) : (
                      parseInt(matchWithDetails.home_team.score || '0', 10) > 0 && (
                        <ScorerText>Goal details not available</ScorerText>
                      )
                    )}
                  </TeamBox>
                </Grid>

                <Grid item xs={2}>
                  <Typography variant="h5" align="center" sx={{ color: '#fff' }}>
                    vs
                  </Typography>
                </Grid>

                <Grid item xs={5}>
                  <TeamBox>
                    <Avatar src={matchWithDetails.away_team.logo} alt={matchWithDetails.away_team.name} sx={{ width: 56, height: 56 }} />
                    <Typography variant="subtitle1" align="center">
                      {matchWithDetails.away_team.name} ({matchWithDetails.away_team.score || 0})
                    </Typography>
                    {matchWithDetails.away_team.scorers && matchWithDetails.away_team.scorers.length > 0 ? (
                      matchWithDetails.away_team.scorers.map((scorer, index) => (
                        <ScorerText key={index}>
                          ⚽ {scorer.scorer} {scorer.minute && `(${scorer.minute}')`}
                          {scorer.assist && <span> 👟 {scorer.assist}</span>}
                        </ScorerText>
                      ))
                    ) : (
                      parseInt(matchWithDetails.away_team.score || '0', 10) > 0 && (
                        <ScorerText>Goal details not available</ScorerText>
                      )
                    )}
                  </TeamBox>
                </Grid>

                {/* Venue and League */}
                <Grid item xs={12}>
                  <VenueText align="center">
                    {matchWithDetails.venue}
                  </VenueText>
                  <VenueText align="center">
                    {matchWithDetails.league}
                  </VenueText>
                </Grid>

                {/* Make Prediction Button */}
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="center">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleMatchClick(matchWithDetails)}
                      sx={{
                        backgroundColor: '#1976d2',
                        '&:hover': {
                          backgroundColor: '#115293',
                        },
                      }}
                    >
                      MAKE PREDICTION
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </StyledCard>
        );
      })}

      {/* Prediction Dialog */}
      <Dialog 
        open={isPredictionOpen} 
        onClose={handlePredictionClose}
        maxWidth="sm"
        fullWidth
      >
        {predictionAnalysis ? (
          <>
            <DialogTitle>
              Prediction Analysis
            </DialogTitle>
            <DialogContent>
              <Box sx={{ my: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {predictionAnalysis.player} - {predictionAnalysis.team}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  {predictionAnalysis.prediction_type.toUpperCase()} {predictionAnalysis.target_value} {predictionAnalysis.category}
                </Typography>
                <Typography variant="subtitle2" gutterBottom color="primary">
                  Confidence: {(predictionAnalysis.confidence * 100).toFixed(1)}%
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1" style={{ whiteSpace: 'pre-line' }}>
                    {predictionAnalysis.analysis}
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseAnalysis} color="primary">
                Close
              </Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle>
              {selectedMatch ? `Make Prediction: ${selectedMatch.home_team.name} vs ${selectedMatch.away_team.name}` : 'Make Prediction'}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ my: 2 }}>
                {/* Team Selection */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Select Team</InputLabel>
                  <Select
                    value={selectedTeam}
                    onChange={handleTeamChange}
                    label="Select Team"
                  >
                    {selectedMatch && [
                      <MenuItem key={selectedMatch.home_team.id} value={selectedMatch.home_team.id}>
                        {selectedMatch.home_team.name}
                      </MenuItem>,
                      <MenuItem key={selectedMatch.away_team.id} value={selectedMatch.away_team.id}>
                        {selectedMatch.away_team.name}
                      </MenuItem>
                    ]}
                  </Select>
                </FormControl>

                {/* Player Selection */}
                {selectedTeam && (
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Select Player</InputLabel>
                    <Select
                      value={selectedPlayer}
                      onChange={handlePlayerChange}
                      label="Select Player"
                      disabled={loadingPlayers}
                    >
                      {loadingPlayers ? (
                        <MenuItem value="">
                          <Box display="flex" alignItems="center" gap={1}>
                            <CircularProgress size={20} />
                            <Typography>Loading players...</Typography>
                          </Box>
                        </MenuItem>
                      ) : players.length > 0 ? (
                        players.map((player) => (
                          <MenuItem key={player.id} value={player.id}>
                            <Box>
                              <Typography variant="subtitle1">{player.name}</Typography>
                              <Typography variant="body2" color="textSecondary">
                                {player.position}
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value="">
                          <Typography color="error">No players found</Typography>
                        </MenuItem>
                      )}
                    </Select>
                  </FormControl>
                )}

                {/* Prediction Category Selection */}
                {selectedPlayer && (
                  <>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Select Prediction Category</InputLabel>
                      <Select
                        value={selectedPredictionCategory}
                        onChange={handleCategoryChange}
                        label="Select Prediction Category"
                      >
                        {availableCategories.map((category) => (
                          <MenuItem key={category.id} value={category.id}>
                            <Box>
                              <Typography variant="subtitle1">{category.name}</Typography>
                              <Typography variant="body2" color="textSecondary">
                                {category.description}
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {selectedPredictionCategory && (
                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12}>
                          <Typography variant="subtitle1" gutterBottom>
                            Prediction Type
                          </Typography>
                          <ToggleButtonGroup
                            value={predictionType}
                            exclusive
                            onChange={handlePredictionTypeChange}
                            fullWidth
                          >
                            <ToggleButton value="over">
                              Over
                            </ToggleButton>
                            <ToggleButton value="under">
                              Under
                            </ToggleButton>
                          </ToggleButtonGroup>
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Prediction Value"
                            type="number"
                            value={predictionValue}
                            onChange={handlePredictionValueChange}
                            InputProps={{
                              inputProps: { min: 0, step: 0.5 }
                            }}
                          />
                        </Grid>
                      </Grid>
                    )}
                  </>
                )}
              </Box>
              {analysisError && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {analysisError}
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handlePredictionClose} color="primary">
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitPrediction}
                color="primary" 
                variant="contained"
                disabled={!selectedTeam || !selectedPlayer || !selectedPredictionCategory || !predictionValue || isAnalysisLoading}
              >
                {isAnalysisLoading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Analyzing...
                  </>
                ) : (
                  'Submit Prediction'
                )}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default MatchSchedule; 