import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignInForm from '../components/auth/signin';
import { AuthContext } from '../context/AuthContext';
import { authApi } from '../services/api';

const SignIn = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignInSubmit = async (data: { identifier: string; password: string }) => {
    setLoading(true);
    setError('');
    try {
      const response = await authApi.login(data.identifier, data.password);

      const userWithToken = {
        id: response.user.id,
        firstName: response.user.firstName || '', 
        lastName: response.user.lastName || '',  
        userName: response.user.username,
        emailAddress: response.user.email,
        token: response.token,
      };
      login(userWithToken);
      navigate('/home');
    } catch (error: any) {
      setError(error.response?.data?.error || 'Invalid credentials');
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
