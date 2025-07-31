import { useContext } from 'react';
import type { ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Home from './pages/home';
import Profile from './pages/profile';
import Landing from './pages/landing';
import SignIn from './pages/signin';
import SignUp from './pages/signup';
import Tasks from './pages/tasks';
import NewTask from './pages/newTask';
import CompletedTasks from './pages/completedTask';
import Trash from './pages/trash';
import UpdateTask from './pages/updateTask';
import { AuthContext } from './context/AuthContext';
import { useAppInitialization } from './hooks/useAppInitialization';
import Header from './components/landingarea/header';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useContext(AuthContext)!;
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  return <>{children}</>;
};

const App = () => {
  const location = useLocation();
  
  
  useAppInitialization();

  const showHeader = location.pathname !== '/home' && location.pathname !== '/tasks';

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        
        <Route path="/" element={<Landing />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/newTask"
          element={
            <ProtectedRoute>
              <NewTask />
            </ProtectedRoute>
          }
          />
          <Route
            path="/completedTasks"
            element={
              <ProtectedRoute>
                <CompletedTasks />
              </ProtectedRoute>
            }
          /> 
        <Route
          path="/trash"
          element={
            <ProtectedRoute>
              <Trash />
            </ProtectedRoute>
          }
        />
        <Route
          path="/updateTask/:id"
          element={
            <ProtectedRoute>
              <UpdateTask />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
