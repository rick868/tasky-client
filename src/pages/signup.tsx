import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignUpForm from '../components/auth/signup';
import { AuthContext } from '../context/AuthContext';

const SignUp = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSignUpSubmit = (data: {
    firstName: string;
    lastName: string;
    userName: string;
    emailAddress: string;
    password: string;
  }) => {
    setLoading(true);
    // Simulate signup API call
    setTimeout(() => {
      // For demo, create a user object from signup data
      const user = {
        firstName: data.firstName,
        lastName: data.lastName,
        userName: data.userName,
        emailAddress: data.emailAddress,
        token: 'dummy-token',
      };
      login(user);
      setLoading(false);
      navigate('/home');
    }, 1000);
  };

  const handleSignInClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/home');
  };

  return <SignUpForm onSubmit={handleSignUpSubmit} loading={loading} onSignInClick={handleSignInClick} />;
};

export default SignUp;
