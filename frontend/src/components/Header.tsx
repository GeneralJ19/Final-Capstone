import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

const Header: React.FC = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#1a237e' }}>
      <Toolbar>
        <Box display="flex" alignItems="center">
          <Typography variant="h6" component="div">
            Sports Prediction Hub
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 