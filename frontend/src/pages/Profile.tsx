import React from 'react';
import { Container, Typography, Paper, Grid, Box, Card, CardContent } from '@mui/material';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const Profile = () => {
  // Mock user data - in a real app, this would come from your backend
  const userData = {
    username: 'ZeusBet123',
    balance: 1000,
    totalBets: 150,
    winRate: 0.65,
    profitLoss: 2500,
    favoriteSport: 'Football',
  };

  const stats = [
    {
      icon: <ShowChartIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Win Rate',
      value: `${(userData.winRate * 100).toFixed(1)}%`,
    },
    {
      icon: <AccountBalanceWalletIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: 'Profit/Loss',
      value: `$${userData.profitLoss.toFixed(2)}`,
    },
    {
      icon: <EmojiEventsIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      title: 'Total Bets',
      value: userData.totalBets,
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Welcome back, {userData.username}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Current Balance: ${userData.balance}
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {stat.title}
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {stat.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile; 