import React from 'react';
import { Box, Typography, Paper, Link } from '@mui/material';

const features = [
  {
    title: 'Intuitive Capture',
    body: 'Jot down ideas from anywhere – email, browser, or mind. ZenFlow intelligently sorts and organizes them, so nothing slips through the cracks.',
    cta: 'Learn More about Inbox',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1976d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7" />
      </svg>
    ),
  },
  {
    title: 'Mindful Prioritization',
    body: 'AI-powered suggestions and flexible prioritization tools guide your attention to high-impact tasks, ensuring you always work on the right thing, at the right time.',
    cta: 'Explore Smart Prioritization',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1976d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    title: 'Flow State Tracking',
    body: 'See your achievements unfold with beautiful, insightful reports. ZenFlow empowers you to track habits, identify patterns, and continuously improve your productivity.',
    cta: 'View Analytics Features',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1976d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4 17 10 11 13 14 21 6" />
        <polyline points="21 12 21 6 15 6" />
      </svg>
    ),
  },
];

const FeatureShowcase = () => {
  return (
    <Box sx={{ py: 8, px: 2, maxWidth: 1200, margin: 'auto', display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
      {features.map((feature, index) => (
        <Paper key={index} elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: 3, overflow: 'hidden', flex: '1 1 300px' }}>
          <Box sx={{ mb: 2, display: 'inline-block' }}>
            {feature.icon}
          </Box>
          <Typography variant="h6" gutterBottom>
            {feature.title}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {feature.body}
          </Typography>
          <Link href="#" underline="hover" sx={{ fontWeight: 'bold', cursor: 'pointer' }}>
            {feature.cta}
          </Link>
        </Paper>
      ))}
    </Box>
  );
};

export default FeatureShowcase;
