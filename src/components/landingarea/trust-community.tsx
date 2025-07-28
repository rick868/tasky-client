import React, { useState } from 'react';
import { Box, Typography, Avatar, Button } from '@mui/material';

const testimonials = [
  {
    name: 'Aisha K., Freelance Designer',
    image: '/assets/images/aisha-k.jpg',
    quote: "ZenFlow brought calm to my chaotic client deadlines. I've never felt so in control. Absolutely life-changing!",
  },
  {
    name: 'David M., Startup Founder',
    image: '/assets/images/david-m.jpg',
    quote: "Our team's collaboration skyrocketed with ZenFlow. Tasks are clearer, communication is seamless. Highly recommend!",
  },
];

const TrustCommunity = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <Box sx={{ py: 8, px: 2, maxWidth: 900, margin: 'auto', textAlign: 'center', bgcolor: '#f9f4ef', borderRadius: 3 }}>
      <Typography variant="h4" gutterBottom>
        Trusted by Minds Seeking Clarity.
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, mb: 3 }}>
        <Avatar
          alt={currentTestimonial.name}
          src={currentTestimonial.image}
          sx={{ width: 80, height: 80, border: '2px solid #ccc' }}
        />
        <Typography variant="body1" sx={{ maxWidth: 500, fontStyle: 'italic' }}>
          "{currentTestimonial.quote}"
        </Typography>
      </Box>
      <Typography variant="subtitle2" sx={{ mb: 3 }}>
        - {currentTestimonial.name}
      </Typography>
      <Box>
        <Button onClick={handlePrev} sx={{ mr: 2 }}>
          Previous
        </Button>
        <Button onClick={handleNext}>
          Next
        </Button>
      </Box>
      <Typography variant="caption" sx={{ mt: 4, display: 'block' }}>
        Join 500,000+ others finding their Zen.
      </Typography>
    </Box>
  );
};

export default TrustCommunity;
