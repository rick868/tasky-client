import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SignInForm from '../components/auth/signin';
import { AuthContext } from '../context/AuthContext';

const SignIn = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignInSubmit = async (data: { identifier: string; password: string }) => {
    setLoading(true);
    setError('');
    try {
      interface User {
        id: string;
        username: string;
        email: string;
      }

      interface LoginResponse {
        user: User;
        token: string;
      }

      const response = await axios.post<LoginResponse>('http://localhost:4000/api/auth/login', {
        emailOrUsername: data.identifier,
        password: data.password,
      });

      const userWithToken = {
        id: response.data.user.id,
        firstName: '', 
        lastName: '',  
        userName: response.data.user.username,
        emailAddress: response.data.user.email,
        token: response.data.token,
      };
      login(userWithToken);
      navigate('/home');
    } catch {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/signup');
  };

  return <SignInForm onSubmit={handleSignInSubmit} loading={loading} onSignUpClick={handleSignUpClick} error={error} />;
};

export default SignIn;
