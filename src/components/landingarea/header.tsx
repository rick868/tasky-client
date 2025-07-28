import { Box, Typography, } from '@mui/material';

const Header = () => {
    return (
        <Box
            component="header"
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 2,
                backgroundColor: '#4b26f0ff',
                color: '#ffffffff',
                transparency: '100%',
                cursor: 'pointer',
            }}
        >
            <Typography variant="h6" component="div">
                Tasky
            </Typography>
            <Box>
               
            </Box>
        </Box>
    );
};

export default Header;
