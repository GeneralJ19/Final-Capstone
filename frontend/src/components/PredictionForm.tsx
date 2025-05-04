import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { Match } from './MatchSchedule';
import { PREDICTION_CATEGORIES } from '../data/sportsData';

interface PredictionFormProps {
  open: boolean;
  onClose: () => void;
  match?: Match;
  sport: string;
}

interface PredictionData {
  player_name: string;
  category: string;
  target_value: number;
  confidence: number;
  explanation: string;
}

const PredictionForm: React.FC<PredictionFormProps> = ({ open, onClose, match, sport }) => {
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [targetValue, setTargetValue] = useState<number>(0);
  const [playerName, setPlayerName] = useState('');

  // Get categories for the selected sport
  const categories = PREDICTION_CATEGORIES[sport] || [];

  useEffect(() => {
    if (match) {
      // Reset form when match changes
      setSelectedCategory('');
      setTargetValue(0);
      setPlayerName('');
      setPrediction(null);
    }
  }, [match]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post('http://localhost:8080/api/predictions/player', {
        sport,
        player_name: playerName,
        team: match?.home_team.name,
        opponent: match?.away_team.name,
        category: selectedCategory,
        target_value: targetValue,
        is_home_game: true // You might want to make this dynamic based on the selected team
      });
      setPrediction(response.data);
    } catch (error) {
      console.error('Error making prediction:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPrediction(null);
    setSelectedCategory('');
    setTargetValue(0);
    setPlayerName('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {match ? `Predict: ${match.home_team.name} vs ${match.away_team.name}` : 'Player Prediction'}
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Player Name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Prediction Category</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Prediction Category"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Target Value"
                type="number"
                value={targetValue}
                onChange={(e) => setTargetValue(Number(e.target.value))}
                required
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            {prediction && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Prediction Results
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Confidence: {(prediction.confidence * 100).toFixed(2)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {prediction.explanation}
                </Typography>
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Predicting...' : 'Make Prediction'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PredictionForm; 