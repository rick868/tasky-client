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

  const handleSignInSubmit = async (data: { emailOrUserName: string; password: string }) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:4000/api/auth/login', {
        emailOrUsername: data.emailOrUserName,
        password: data.password,
      });

      const userWithToken = { ...response.data.user, token: response.data.token };
      login(userWithToken);
      navigate('/home');
    } catch (err) {
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
