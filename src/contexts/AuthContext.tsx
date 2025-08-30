import React, { createContext, useContext, useState, useEffect } from 'react';

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

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    const mockUser: User = {
      id: '1',
      email,
      name: email.split('@')[0],
      profileComplete: localStorage.getItem('profileComplete') === 'true'
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
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

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
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

  return (
    <AuthContext.Provider value={{ user, login, register, requestOTP, verifyOTPAndRegister, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};