import React from 'react';

const Registration = () => {
  // Redirect to home page since sign up is handled via popup modal
  React.useEffect(() => {
    window.location.href = '/';
  }, []);

  return null;
};

export default Registration;
