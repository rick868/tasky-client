import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const FinalCTA = () => {
  return (
    <Box sx={{ py: 8, px: 2, maxWidth: 900, margin: 'auto', textAlign: 'center', background: 'linear-gradient(135deg, #e0f7fa, #ffffff)', borderRadius: 3 }}>
      <Box
        component="img"
        src="/assets/images/serene-individual-illustration.png"
        alt="Serene Individual Illustration"
        sx={{ maxWidth: '100%', mb: 4 }}
      />
      <Typography variant="h4" gutterBottom>
        Ready to Experience Your Own ZenFlow?
      </Typography>
      <Typography variant="h6" sx={{ mb: 4 }}>
        Start focusing on what truly matters. Sign up for free today and transform your daily routine.
      </Typography>
      <Button
        variant="contained"
        sx={{
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          color: '#fff',
          px: 5,
          py: 1.5,
          fontWeight: 'bold',
        }}
        onClick={() => window.location.href = '/signin'}
      >
        Claim My Free Account
      </Button>
      <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'text.secondary' }}>
        No commitments. No hidden fees. Just pure productivity.
      </Typography>
    </Box>
  );
};

export default FinalCTA;
