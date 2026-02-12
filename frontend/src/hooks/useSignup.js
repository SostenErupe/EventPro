import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (name, email, username, password, role, contactInfo) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, username, password, role, contactInfo })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      // Save user and token
      const userData = data.user ? data : { user: data, token: data.token };
      const userPayload = userData.user || userData;
      const tokenPayload = userData.token || data.token;
      
      dispatch({ type: 'LOGIN', payload: { user: userPayload, token: tokenPayload } });
      
      // Store in both storages
      sessionStorage.setItem('user', JSON.stringify(userPayload));
      if (tokenPayload) sessionStorage.setItem('token', tokenPayload);
      localStorage.setItem('user', JSON.stringify(userPayload));
      if (tokenPayload) localStorage.setItem('token', tokenPayload);
      
      return data;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { signup, isLoading };
};