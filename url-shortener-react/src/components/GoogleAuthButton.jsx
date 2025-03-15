import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import api from '../api/api';
import { useStoreContext } from '../contextApi/ContextApi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const GoogleAuthButton = () => {
  const { setToken, setUser } = useStoreContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        console.log("Google OAuth success:", tokenResponse);
        
        // Get user info from Google
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });
        
        const userInfo = await userInfoResponse.json();
        console.log("Google user info:", userInfo);
        
        // Send to our backend
        const response = await api.post('/api/auth/public/google', {
          token: tokenResponse.access_token,
          email: userInfo.email,
          name: userInfo.name,
          imageUrl: userInfo.picture
        });
        
        console.log("Backend response:", response.data);
        
        // Save token and redirect
        localStorage.setItem('JWT_TOKEN', JSON.stringify(response.data.token));
        setToken(response.data.token);
        
        // Set user info if needed
        const userToStore = {
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture
        };
        
        localStorage.setItem('USER_INFO', JSON.stringify(userToStore));
        setUser(userToStore);
        
        toast.success('Successfully logged in with Google!');
        navigate('/dashboard');
      } catch (error) {
        console.error('Google login error:', error);
        if (error.response) {
          console.error('Error response:', error.response.data);
        }
        toast.error('Failed to login with Google. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google login error:', error);
      toast.error('Failed to login with Google. Please try again.');
      setIsLoading(false);
    },
    flow: 'implicit' // Use implicit flow for simpler integration
  });

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={isLoading}
      className={`flex items-center justify-center gap-2 w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50 transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      <FcGoogle className="text-xl" />
      <span>{isLoading ? 'Connecting...' : 'Continue with Google'}</span>
    </button>
  );
};

export default GoogleAuthButton; 