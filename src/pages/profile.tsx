import React, { useState, useContext } from 'react';
import { Container, Typography, Box, Button, TextField } from '@mui/material';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user, logout, updateUserDetails, updatePassword, updateProfilePicture } = useContext(AuthContext);

  const [editUserDetails, setEditUserDetails] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    userName: user?.userName || '',
    emailAddress: user?.emailAddress || '',
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
  });

  const [passwordError, setPasswordError] = useState('');

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);

  const handleUserDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditUserDetails({
      ...editUserDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleUserDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserDetails(editUserDetails);
    if (profilePicture) {
      updateProfilePicture(profilePicture);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = updatePassword(passwords.currentPassword, passwords.newPassword);
    if (!success) {
      setPasswordError('Current password is incorrect');
      return;
    }
    setPasswordError('');
    setPasswords({ currentPassword: '', newPassword: '' });
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(file);
      setProfilePicturePreview(URL.createObjectURL(file));
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Profile Page
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Profile Picture
        </Typography>
        {profilePicturePreview ? (
          <Box component="img" src={profilePicturePreview} alt="Profile Preview" sx={{ width: 150, height: 150, borderRadius: '50%', mb: 2 }} />
        ) : (
          <Typography>No profile picture uploaded</Typography>
        )}
        <Button variant="contained" component="label">
          Upload Profile Picture
          <input type="file" hidden accept="image/*" onChange={handleProfilePictureChange} />
        </Button>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Update Personal Details
        </Typography>
        <Box component="form" onSubmit={handleUserDetailsSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
          <TextField
            label="First Name"
            name="firstName"
            value={editUserDetails.firstName}
            onChange={handleUserDetailChange}
            required
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={editUserDetails.lastName}
            onChange={handleUserDetailChange}
            required
          />
          <TextField
            label="Username"
            name="userName"
            value={editUserDetails.userName}
            onChange={handleUserDetailChange}
            required
          />
          <TextField
            label="Email Address"
            name="emailAddress"
            value={editUserDetails.emailAddress}
            onChange={handleUserDetailChange}
            required
            type="email"
          />
          <Button type="submit" variant="contained" color="primary">
            Update Details
          </Button>
        </Box>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Update Password
        </Typography>
        <Box component="form" onSubmit={handlePasswordSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
          <TextField
            label="Current Password"
            name="currentPassword"
            type="password"
            value={passwords.currentPassword}
            onChange={handlePasswordChange}
            required
          />
          <TextField
            label="New Password"
            name="newPassword"
            type="password"
            value={passwords.newPassword}
            onChange={handlePasswordChange}
            required
          />
          {passwordError && (
            <Typography color="error" variant="body2">
              {passwordError}
            </Typography>
          )}
          <Button type="submit" variant="contained" color="primary">
            Update Password
          </Button>
        </Box>
      </Box>

      <Button variant="contained" color="secondary" onClick={logout}>
        Log Out
      </Button>
    </Container>
  );
};

export default Profile;
