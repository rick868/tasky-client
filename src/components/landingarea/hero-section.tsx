import { Box, Typography, Button,CardMedia} from '@mui/material';
import { keyframes } from '@emotion/react';

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(0, 123, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 123, 255, 0); }
`;

const HeroSection = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        color: '#ffffffff',
        textAlign: 'center',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
        zIndex: 1,
      }}
    >
      {/* Background video */}
      <CardMedia
        component="video"
        src="task.mp4"
        autoPlay
        loop
        muted
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -2,
          filter: 'brightness(0.5)',
          opacity: 0.8,
        }}
       
      />

      {/* Animated abstract pattern overlay */}
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          background:
            'radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, transparent 70%), repeating-radial-gradient(circle at center, rgba(255,255,255,0.02) 0%, transparent 80%)',
          animation: `${pulse} 20s infinite alternate`,
          zIndex: -1,
          pointerEvents: 'none',
          opacity: 0.5,
        }}
      />

      {/* Headline */}
      <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', mb: 2, maxWidth: 600, }}>
        Unclutter Your Mind. Unleash Your Potential.
      </Typography>

      {/* Sub-headline */}
      <Typography variant="h5" sx={{ mb: 4, maxWidth: 600 }}>
        Tasky transforms scattered thoughts into serene accomplishments. Find your focus, one mindful task at a time.
      </Typography>

      {/* CTA Buttons */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 1 }}>
        <Button
          variant="contained"
          sx={{
            background: 'linear-gradient(45deg, #141414ff 30%, #21CBF3 90%)',
            color: '#fff',
            px: 4,
            py: 1.5,
            fontWeight: 'bold',
            animation: `${pulse} 2s infinite`,
            '&:hover': {
              animationPlayState: 'paused',
              boxShadow: '0 0 15px 5px rgba(33, 203, 243, 0.7)',
            },
          }}
          onClick={() => window.location.href = '/signin'}
        >
          Start Your Flow - It's Free
        </Button>
        <Button
          variant="outlined"
          sx={{
            borderColor: 'rgba(255,255,255,0.7)',
            color: 'rgba(14, 13, 13, 0.7)',
            px: 4,
            py: 1.5,
            fontWeight: 'bold',
            '&:hover': {
              borderColor: '#0b0c0cff',
              color: '#0a0a0aff',
            },
          }}
          onClick={() => window.open('https://example.com/product-tour', '_blank')}
        >
          See How Tasky Works
        </Button>
      </Box>

      {/* Small text below CTAs */}
      <Typography variant="caption" sx={{ color: 'rgba(7, 7, 7, 0.7)' }}>
        No credit card required. Cancel anytime.
      </Typography>
    </Box>
  );
};

export default HeroSection;