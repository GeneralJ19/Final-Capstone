import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Grid, Card, CardContent, Box } from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import TimelineIcon from '@mui/icons-material/Timeline';
import ShowChartIcon from '@mui/icons-material/ShowChart';

const features = [
  {
    icon: <SportsSoccerIcon sx={{ fontSize: 40 }} />,
    title: 'AI-Powered Predictions',
    description: 'Leverage the power of Zeus to get accurate sports predictions',
  },
  {
    icon: <TimelineIcon sx={{ fontSize: 40 }} />,
    title: 'Real-Time Analysis',
    description: 'Get instant updates and analysis for ongoing matches',
  },
  {
    icon: <ShowChartIcon sx={{ fontSize: 40 }} />,
    title: 'Performance Tracking',
    description: 'Track your betting performance with detailed analytics',
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', mt: 8, mb: 6 }}>
        <Typography variant="h1" component="h1" gutterBottom>
          Welcome to ProphetPlay
        </Typography>
        <Typography variant="h5" color="textSecondary" paragraph>
          Where AI meets the wisdom of Zeus for unparalleled sports predictions
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate('/predictions')}
          sx={{ mt: 4 }}
        >
          Get Started
        </Button>
      </Box>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" component="h2" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home; 