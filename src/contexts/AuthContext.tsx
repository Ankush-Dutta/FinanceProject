// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  profileComplete: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  requestOTP: (email: string) => Promise<string>;
  verifyOTPAndRegister: (otp: string, otpToken: string, userData: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Record<string, unknown>) => void;
  refreshToken: () => Promise<boolean>;
  getAuthToken: () => string | null;
  isLoading: boolean;
  checkAutoLogin: () => Promise<void>;

  // NEW: forgot / reset password
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getAuthToken = useCallback((): string | null => {
    return localStorage.getItem('authToken');
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('profileComplete');
    localStorage.removeItem('profileData');
  }, []);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const storedRefreshToken = localStorage.getItem('refreshToken');
      if (!storedRefreshToken) {
        return false;
      }

      const response = await fetch('https://spendmate.shubhodip.in/users/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'Meowmeowmeow123456789'
        },
        body: JSON.stringify({
          refreshToken: storedRefreshToken
        }),
      });

      if (!response.ok) {
        // Refresh token is invalid, logout user
        logout();
        return false;
      }

      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      console.log('Token refreshed successfully');
      return true;
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
      return false;
    }
  }, [logout]);

  const checkAutoLogin = useCallback(async () => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('authToken');
    const refreshTokenValue = localStorage.getItem('refreshToken');
    
    if (savedUser && token) {
      try {
        // Validate token
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        
        if (tokenPayload.exp < currentTime) {
          console.log('Token expired, attempting refresh...');
          if (refreshTokenValue) {
            const refreshed = await refreshToken();
            if (refreshed) {
              setUser(JSON.parse(savedUser));
            } else {
              // Clear invalid tokens
              localStorage.removeItem('authToken');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('user');
            }
          }
        } else {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error validating token:', error);
        // Clear invalid data
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, [refreshToken]);

  useEffect(() => {
    checkAutoLogin();
  }, [checkAutoLogin]);

  // Auto refresh token every 25 minutes
  useEffect(() => {
    let refreshInterval: number | null = null;

    const startTokenRefresh = () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }

      // Refresh token every 25 minutes (25 * 60 * 1000 milliseconds)
      refreshInterval = setInterval(async () => {
        const token = getAuthToken();
        const refreshTokenValue = localStorage.getItem('refreshToken');
        
        if (token && refreshTokenValue && user) {
          console.log('Auto-refreshing token (25 minute interval)...');
          try {
            const success = await refreshToken();
            if (success) {
              console.log('Token auto-refreshed successfully');
            } else {
              console.log('Auto token refresh failed, stopping interval');
              if (refreshInterval) {
                clearInterval(refreshInterval);
                refreshInterval = null;
              }
            }
          } catch (error) {
            console.error('Error during auto token refresh:', error);
            if (refreshInterval) {
              clearInterval(refreshInterval);
              refreshInterval = null;
            }
          }
        } else {
          console.log('No valid session found, stopping token refresh interval');
          if (refreshInterval) {
            clearInterval(refreshInterval);
            refreshInterval = null;
          }
        }
      }, 25 * 60 * 1000) as unknown as number; // 25 minutes
    };

    // Start the refresh interval when user is logged in
    if (user && getAuthToken() && localStorage.getItem('refreshToken')) {
      startTokenRefresh();
    }

    // Cleanup interval on unmount or when user logs out
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [user, refreshToken, getAuthToken]); // Re-run when user state changes

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login for:', email);
      
      const response = await fetch('https://spendmate.shubhodip.in/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'Meowmeowmeow123456789'
        },
        body: JSON.stringify({
          email,
          password
        }),
      });

      console.log('Login response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Login failed');
      }

      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const textResponse = await response.text();
        throw new Error(textResponse || 'Login failed');
      }

      console.log('Login response data:', data);

      // Store tokens
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);

      // Decode JWT to get user information (basic decode, not secure verification)
      let userFromToken;
      try {
        const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));
        userFromToken = {
          id: tokenPayload.userId || tokenPayload.sub || 'unknown',
          email: tokenPayload.email || email,
          name: tokenPayload.name || email.split('@')[0],
          profileComplete: false // You might get this from user profile API
        };
      } catch {
        console.warn('Could not decode JWT token, using fallback user data');
        userFromToken = {
          id: 'user_id',
          email,
          name: email.split('@')[0],
          profileComplete: false
        };
      }

      setUser(userFromToken);
      localStorage.setItem('user', JSON.stringify(userFromToken));
      
      console.log('Login successful, user set:', userFromToken);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    // This function is now just for compatibility, actual registration happens in verifyOTPAndRegister
    console.log('Register called with:', { email, password, name });
  };

  const requestOTP = async (email: string): Promise<string> => {
    try {
      console.log('Requesting OTP for email:', email);
      
      const requestBody = {
        email,
        type: 'signup'
      };
      
      console.log('Request body:', requestBody);
      
      const response = await fetch('https://spendmate.shubhodip.in/users/otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'Meowmeowmeow123456789'
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${data.message || 'Failed to request OTP'}`);
      }

      if (data.status === 'success') {
        console.log('OTP token received:', data.otpToken);
        return data.otpToken;
      } else {
        throw new Error(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error requesting OTP:', error);
      throw error;
    }
  };

  const verifyOTPAndRegister = async (otp: string, otpToken: string, userData: { name: string; email: string; password: string }): Promise<void> => {
    try {
      console.log('Starting OTP verification process...');
      console.log('OTP:', otp);
      console.log('Email:', userData.email);
      
      // Step 1: Verify OTP using the API
      const verifyResponse = await fetch('https://spendmate.shubhodip.in/users/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'Meowmeowmeow123456789'
        },
        body: JSON.stringify({
          otp: otp,
          otpToken: otpToken
        }),
      });

      console.log('OTP verification response status:', verifyResponse.status);
      console.log('OTP verification response headers:', verifyResponse.headers.get('content-type'));

      let verifyData;
      const contentType = verifyResponse.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        // Response is JSON
        verifyData = await verifyResponse.json();
      } else {
        // Response is plain text
        const textResponse = await verifyResponse.text();
        console.log('OTP verification text response:', textResponse);
        
        // Check if the response indicates success
        if (verifyResponse.ok && textResponse.includes('User saved')) {
          verifyData = { status: 'success', message: textResponse };
        } else {
          verifyData = { status: 'error', message: textResponse };
        }
      }
      
      console.log('OTP verification parsed data:', verifyData);

      if (!verifyResponse.ok) {
        throw new Error(`OTP verification failed: ${verifyData.message || 'Invalid OTP'}`);
      }

      if (verifyData.status !== 'success') {
        throw new Error(verifyData.message || 'OTP verification failed');
      }

      console.log('OTP verified successfully, proceeding with registration...');
      
      // Step 2: Register the user only if OTP verification succeeds
      const registerResponse = await fetch('https://spendmate.shubhodip.in/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'Meowmeowmeow123456789'
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          phone: null,
          password: userData.password
        }),
      });

      console.log('Registration response status:', registerResponse.status);
      console.log('Registration response headers:', registerResponse.headers.get('content-type'));

      let registerData;
      const registerContentType = registerResponse.headers.get('content-type');
      
      if (registerContentType && registerContentType.includes('application/json')) {
        // Response is JSON
        registerData = await registerResponse.json();
      } else {
        // Response is plain text
        const textResponse = await registerResponse.text();
        console.log('Registration text response:', textResponse);
        
        if (registerResponse.ok) {
          registerData = { status: 'success', message: textResponse, id: Date.now().toString() };
        } else {
          registerData = { status: 'error', message: textResponse };
        }
      }
      
      console.log('Registration parsed data:', registerData);

      if (!registerResponse.ok) {
        throw new Error(`Registration failed: ${registerData.message || 'Failed to register user'}`);
      }
      
      // Create user object and set in context
      const newUser: User = {
        id: registerData.id || Date.now().toString(),
        email: userData.email,
        name: userData.name,
        profileComplete: false
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      console.log('User registered and logged in successfully');
    } catch (error) {
      console.error('Error during OTP verification and registration:', error);
      throw error;
    }
  };

  const updateProfile = (data: Record<string, unknown>) => {
    if (user) {
      const updatedUser = { ...user, profileComplete: true };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem('profileComplete', 'true');
      localStorage.setItem('profileData', JSON.stringify(data));
    }
  };

  // NEW: resetPassword implementation
  const resetPassword = async (email: string): Promise<void> => {
    try {
      console.log('Requesting password reset for:', email);
      const response = await fetch('https://spendmate.shubhodip.in/users/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'Meowmeowmeow123456789'
        },
        body: JSON.stringify({ email })
      });

      // Some backends respond with 200 + JSON, some with 204, handle both
      if (!response.ok) {
        // Try to parse JSON error, fallback to text
        let errText = `HTTP ${response.status}`;
        try {
          const data = await response.json();
          errText = data.message || JSON.stringify(data);
        } catch {
          try {
            errText = await response.text();
          } catch {
            /* noop */
          }
        }
        throw new Error(errText || 'Failed to request password reset');
      }

      // If server returns JSON success message, you may parse and return it if needed
      console.log('Password reset request submitted successfully for', email);
    } catch (error) {
      console.error('Error in resetPassword:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      requestOTP, 
      verifyOTPAndRegister, 
      logout, 
      updateProfile, 
      refreshToken, 
      getAuthToken,
      isLoading,
      checkAutoLogin,
      resetPassword // <-- exposed here
    }}>
      {children}
    </AuthContext.Provider>
  );
};
