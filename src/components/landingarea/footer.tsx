import { Box, Typography, Link, Stack } from '@mui/material';
import { Twitter, LinkedIn, Instagram } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: '#222', color: '#fff', py: 4, px: 2 }}>
      <Box sx={{ maxWidth: 1200, margin: 'auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 4 }}>
        
        <Box sx={{ flex: '1 1 200px' }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Tasky
          </Typography>
          <Typography variant="body2">© 2025 Tasky. All rights reserved.</Typography>
        </Box>

        
        <Box sx={{ flex: '3 1 600px', display: 'flex', justifyContent: 'space-around',  alignItems: 'center', flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Product</Typography>
            <Stack spacing={0.5}>
              <Link href="#" color="inherit" underline="hover">Features</Link>
              <Link href="#" color="inherit" underline="hover">Pricing</Link>
              <Link href="#" color="inherit" underline="hover">Integrations</Link>
              <Link href="#" color="inherit" underline="hover">Demo</Link>
            </Stack>
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Company</Typography>
            <Stack spacing={0.5}>
              <Link href="#" color="inherit" underline="hover">About Us</Link>
              <Link href="#" color="inherit" underline="hover">Careers</Link>
              <Link href="#" color="inherit" underline="hover">Help Center</Link>
              <Link href="#" color="inherit" underline="hover">Contact Us</Link>
            </Stack>
          </Box>
        </Box>

       
        <Box sx={{ flex: '1 1 150px', display: 'flex', alignItems: 'center', gap: 2 }}>
          <Link href="https://twitter.com" color="inherit" target="_blank" rel="noopener">
            <Twitter />
          </Link>
          <Link href="https://linkedin.com" color="inherit" target="_blank" rel="noopener">
            <LinkedIn />
          </Link>
          <Link href="https://instagram.com" color="inherit" target="_blank" rel="noopener">
            <Instagram />
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
