import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { profileApi } from '../utils/api';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, getAuthToken, refreshToken, logout } = useAuth();
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    const validateAuth = async () => {
      const token = getAuthToken();
      
      if (!token || !user) {
        setIsAuthenticated(false);
        setIsValidating(false);
        return;
      }

      try {
        // Check if token is expired by trying to decode it
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        
        if (tokenPayload.exp < currentTime) {
          console.log('Token expired, attempting refresh...');
          const refreshed = await refreshToken();
          if (!refreshed) {
            console.log('Token refresh failed, logging out...');
            logout();
            setIsAuthenticated(false);
          } else {
            console.log('Token refreshed successfully');
            setIsAuthenticated(true);
            
            // Check for profile after successful authentication
            try {
              await profileApi.getProfile(user.id);
              setHasProfile(true);
            } catch (profileError) {
              console.log('No profile found for user:', profileError);
              setHasProfile(false);
            }
          }
        } else {
          setIsAuthenticated(true);
          
          // Check for profile after successful authentication
          try {
            await profileApi.getProfile(user.id);
            setHasProfile(true);
          } catch (profileError) {
            console.log('No profile found for user:', profileError);
            setHasProfile(false);
          }
        }
      } catch (error) {
        console.error('Error validating token:', error);
        setIsAuthenticated(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateAuth();
  }, [user, getAuthToken, refreshToken, logout]);

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Validating session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasProfile) {
    return <Navigate to="/app/profile-setup" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;