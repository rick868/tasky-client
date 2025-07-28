import { useForm } from 'react-hook-form';
import { Box, Button, TextField, Typography, Link, Divider } from '@mui/material';

type LoginData = {
  identifier: string; 
  password: string;
};

type Props = {
  onSubmit: (data: LoginData) => void;
  loading?: boolean;
  onSignUpClick: (e: React.MouseEvent) => void;
};

const SignInForm = ({ onSubmit, loading, onSignUpClick }: Props) => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>();

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', mt: 5, p: 3, boxShadow: 3, borderRadius: 2, backgroundColor: '#fff' }}>
      {/* Brand Logo */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <img src="Tasky.png" alt="Tasky Logo" style={{ maxWidth: '150px' }} />
      </Box>
      <Typography variant="h4" textAlign="center" gutterBottom>
        Welcome Back!
      </Typography>
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
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            mt: 3,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            color: 'white',
            fontWeight: 'bold',
            '&:hover': {
              background: 'linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)',
            },
          }}
          disabled={loading}
        >
          {loading ? 'Logging In...' : 'Log In'}
        </Button>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Typography variant="body2" textAlign="center">
        Forgot your password?{' '}
        <Link href="#" underline="hover" sx={{ cursor: 'pointer' }}>
          Reset Password
        </Link>
      </Typography>
      <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
        Don't have an account?{' '}
        <Link href="#" onClick={onSignUpClick} underline="hover" sx={{ cursor: 'pointer' }}>
          Sign Up
        </Link>
      </Typography>
    </Box>
  );
};

export default SignInForm;
