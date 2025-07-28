import { Box, Typography } from '@mui/material';

const ProblemSolution = () => {
  return (
    <Box sx={{ py: 8, px: 2, maxWidth: 1200, margin: 'auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 4 }}>
     
      <Box sx={{ flex: '1 1 300px', textAlign: 'center' }}>
        <Box
          component="img"
          src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80"
          alt="Cluttered Desk Illustration"
          sx={{ maxWidth: '100%', filter: 'grayscale(60%)', mb: 3 }}
        />
        <Typography variant="h6" sx={{ mb: 2, color: '#000' }}>
          Stuck in the chaos of endless to-dos? Feeling drained by distractions and missed deadlines? The traditional way isn't working.
        </Typography>
      </Box>

      
      <Box sx={{ flex: '1 1 300px', textAlign: 'center' }}>
        <Box
          component="img"
          src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80"
          alt="Serene Task List Illustration"
          sx={{ maxWidth: '100%', mb: 3 }}
        />
        <Typography variant="h6" sx={{ mb: 2, color: '#000' }}>
          Tasky brings a new paradigm. Our intuitive design and intelligent features gently guide you to clarity, so you can breathe, focus, and thrive.
        </Typography>
      </Box>
    </Box>
  );
};

export default ProblemSolution;
