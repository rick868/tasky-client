import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  Avatar,
  Alert,
  Divider,
  Grid,
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { userApi, authApi } from '../services/api';

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateUserDetails, logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.userName || '',
    email: user?.emailAddress || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await userApi.updateProfile(profileData);
      updateUserDetails(profileData);
      setSuccess('Profile updated successfully!');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      await authApi.updatePassword(passwordData.currentPassword, passwordData.newPassword);
      setSuccess('Password updated successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update password';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              mb: 2,
              bgcolor: 'primary.main',
              fontSize: '2rem',
            }}
          >
            {user?.userName?.charAt(0) || 'U'}
          </Avatar>
          
          <Typography component="h1" variant="h4" gutterBottom>
            Profile Settings
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
              {success}
            </Alert>
          )}

          <Grid container spacing={3} sx={{ width: '100%' }}>
            {/* Profile Information */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Profile Information
              </Typography>
              <Box component="form" onSubmit={handleProfileUpdate}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="firstName"
                  label="First Name"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleProfileChange}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleProfileChange}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  value={profileData.username}
                  onChange={handleProfileChange}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 2 }}
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </Button>
              </Box>
            </Grid>

            {/* Password Change */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Change Password
              </Typography>
              <Box component="form" onSubmit={handlePasswordUpdate}>
                <TextField
                  margin="normal"
                  fullWidth
                  name="currentPassword"
                  label="Current Password"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  name="newPassword"
                  label="New Password"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  name="confirmPassword"
                  label="Confirm New Password"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 2 }}
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Change Password'}
                </Button>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ width: '100%', my: 3 }} />

          <Box sx={{ width: '100%', textAlign: 'center' }}>
            <Button
              variant="outlined"
              color="error"
              onClick={handleLogout}
              sx={{ mr: 2 }}
            >
              Logout
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/home')}
            >
              Back to Dashboard
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Profile;
