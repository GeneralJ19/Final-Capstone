import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

interface LeagueSelectorProps {
  selectedLeague: string;
  onLeagueChange: (league: string) => void;
}

const LeagueSelector: React.FC<LeagueSelectorProps> = ({ selectedLeague, onLeagueChange }) => {
  const handleChange = (event: SelectChangeEvent) => {
    onLeagueChange(event.target.value);
  };

  return (
    <FormControl fullWidth variant="outlined" sx={{ minWidth: 200, mb: 2 }}>
      <InputLabel>Select League</InputLabel>
      <Select
        value={selectedLeague}
        onChange={handleChange}
        label="Select League"
      >
        <MenuItem value="esp.1">La Liga</MenuItem>
        <MenuItem value="eng.1">Premier League</MenuItem>
        <MenuItem value="ita.1">Serie A</MenuItem>
        <MenuItem value="ger.1">Bundesliga</MenuItem>
      </Select>
    </FormControl>
  );
};

export default LeagueSelector; 