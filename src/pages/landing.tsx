import HeroSection from '../components/landingarea/hero-section';
import ProblemSolution from '../components/landingarea/problem-solution';
import FeatureShowcase from '../components/landingarea/feature-showcase';
import TrustCommunity from '../components/landingarea/trust-community';
import Footer from '../components/landingarea/footer';
//import Header from '../components/landingarea/header';
import { Box } from '@mui/material';

const Landing = () => {
  return (
    <Box sx={{ minHeight: '100vh',minWidth: '100%', overflow: 'hidden',  display: 'flex', flexDirection: 'column', backgroundColor: '#f1eaeaff', boxShadow: 'inset 0 0 50px #ffffffff' }}>
      {/* <Header /> */}
      <HeroSection />
      <ProblemSolution />
      <FeatureShowcase />
      <TrustCommunity />   
      <Footer />
    </Box>
  );
};

export default Landing;
