import { useForm } from 'react-hook-form';
import { Box, Button, TextField, Typography, Link, Divider } from '@mui/material';


type SignupData = {
  firstName: string;
  lastName: string;
  userName: string;
  emailAddress: string;
  password: string;
  confirmPassword: string;
};

type Props = {
  onSubmit: (data: SignupData) => void;
  loading?: boolean;
  onSignInClick: (e: React.MouseEvent) => void;
};

const SignUpForm = ({ onSubmit, loading, onSignInClick }: Props) => {
  const { register, handleSubmit, formState: { errors } } = useForm<SignupData>();

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', mt: 5, p: 3, boxShadow: 3, borderRadius: 2, backgroundColor: '#fdfdfdff' }}>
      {/* Brand Logo */}
      <Box sx={{ textAlign: 'center',  }}>
        <img src="Tasky.png" alt="Tasky Logo" style={{ maxWidth: '100px', }} />
      </Box>

      <Typography variant="h4" textAlign="center" gutterBottom>
        Create Account
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          label="First Name"
          fullWidth
          margin="normal"
          {...register('firstName', { required: 'First Name is required' })}
          error={!!errors.firstName}
          helperText={errors.firstName?.message}
          slotProps={{ inputLabel: { shrink: true } }}
          variant="outlined"
        />
        <TextField
          label="Last Name"
          fullWidth
          margin="normal"
          {...register('lastName', { required: 'Last Name is required' })}
          error={!!errors.lastName}
          helperText={errors.lastName?.message}
          slotProps={{ inputLabel: { shrink: true } }}
          variant="outlined"
        />
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          {...register('userName', { required: 'Username is required' })}
          error={!!errors.userName}
          helperText={errors.userName?.message}
          slotProps={{ inputLabel: { shrink: true } }}
          variant="outlined"
        />
        <TextField
          label="Email Address"
          type="email"
          fullWidth
          margin="normal"
          {...register('emailAddress', {
            required: 'Email Address is required',
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Invalid email address',
            },
          })}
          error={!!errors.emailAddress}
          helperText={errors.emailAddress?.message}
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
        <TextField
          label="Confirm Password"
          type="password"
          fullWidth
          margin="normal"
          {...register('confirmPassword', {
            required: 'Confirm Password is required',
            validate: (value, formValues) =>
              value === formValues.password || 'Passwords do not match',
          })}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          slotProps={{ inputLabel: { shrink: true } }}
          variant="outlined"
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            mt: 3,
            background: 'linear-gradient(45deg, #0f3d6eff 30%, #21CBF3 90%)',
            color: 'white',
            fontWeight: 'bold',
            '&:hover': {
              background: 'linear-gradient(45deg, #21CBF3 30%, #0f304bff 90%)',
            },
          }}
          disabled={loading}
        >
          {loading ? 'Signing Up...' : 'Get Started Now'}
        </Button>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Typography variant="body2" textAlign="center">
        By signing up, you agree to our{' '}
        <Link href="#" underline="hover" sx={{ cursor: 'pointer' }}>
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="#" underline="hover" sx={{ cursor: 'pointer' }}>
          Privacy Policy
        </Link>
        .
      </Typography>
      <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
        Already have an account?{' '}
        <Link href="#" onClick={onSignInClick} underline="hover" sx={{ cursor: 'pointer' }}>
          Log In
        </Link>
      </Typography>
    </Box>
  );
};

export default SignUpForm;
