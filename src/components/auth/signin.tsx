import { useForm } from 'react-hook-form';
import { Box, Button, TextField, Typography, Link, Divider, Paper, Alert, Fade } from '@mui/material';
import { useTheme } from '@mui/material/styles';

type LoginData = {
  identifier: string; 
  password: string;
};

type Props = {
  onSubmit: (data: LoginData) => void;
  loading?: boolean;
  onSignUpClick: (e: React.MouseEvent) => void;
  error?: string;
};

const SignInForm = ({ onSubmit, loading, onSignUpClick, error }: Props) => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>();
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: 4,
        px: 2,
      }}
    >
      <Fade in timeout={600}>
        <Paper
          elevation={8}
          sx={{
            maxWidth: 450,
            width: '100%',
            p: 4,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <img 
              src="Tasky.png" 
              alt="Tasky Logo" 
              style={{ maxWidth: '120px', marginBottom: theme.spacing(2) }}
            />
            <Typography 
              variant="h4" 
              component="h1"
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                mb: 0.5,
              }}
            >
              Welcome Back!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to continue to your tasks
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              label="Email or Username"
              fullWidth
              margin="normal"
              {...register('identifier', { required: 'Email or Username is required' })}
              error={!!errors.identifier}
              helperText={errors.identifier?.message}
              slotProps={{ inputLabel: { shrink: true } }}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              {...register('password', { required: 'Password is required' })}
              error={!!errors.password}
              helperText={errors.password?.message}
              slotProps={{ inputLabel: { shrink: true } }}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <Box sx={{ textAlign: 'right', mt: 1 }}>
              <Link 
                href="#" 
                underline="hover" 
                sx={{ 
                  fontSize: '0.875rem',
                  color: 'primary.main',
                  '&:hover': {
                    color: 'primary.dark',
                  },
                }}
              >
                Forgot password?
              </Link>
            </Box>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                color: 'white',
                fontWeight: 600,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                boxShadow: '0 4px 15px rgba(33, 150, 243, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)',
                  boxShadow: '0 6px 20px rgba(33, 150, 243, 0.5)',
                  transform: 'translateY(-2px)',
                },
                '&:disabled': {
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                },
                transition: 'all 0.3s ease',
              }}
              disabled={loading}
            >
              {loading ? 'Logging In...' : 'Log In'}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link 
                href="#" 
                onClick={onSignUpClick} 
                underline="hover" 
                sx={{ 
                  fontWeight: 600,
                  color: 'primary.main',
                  cursor: 'pointer',
                  '&:hover': {
                    color: 'primary.dark',
                  },
                }}
              >
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
};

export default SignInForm;
