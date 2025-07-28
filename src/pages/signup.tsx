import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SignUpForm from '../components/auth/signup';

const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleSignUpSubmit = async (data: {
    firstName: string;
    lastName: string;
    userName: string;
    emailAddress: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      await axios.post('https://tasky-server-8tsc.onrender.com/api/auth/register', {
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.userName,
        email: data.emailAddress,
        password: data.password,
      });
      setLoading(false);
      navigate('/signin');
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const handleSignInClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/signin');
  };

  return <SignUpForm onSubmit={handleSignUpSubmit} loading={loading} onSignInClick={handleSignInClick} />;
};

export default SignUp;