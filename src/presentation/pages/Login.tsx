import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../../application/context/AuthContext';
import { Logo } from '../components/UI';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSuccess = (credentialResponse: any) => {
    if (credentialResponse.credential) {
      const decoded: any = jwtDecode(credentialResponse.credential);
      const userData = {
        id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
      };
      login(credentialResponse.credential, userData);
      navigate('/app', { replace: true });
    }
  };

  const handleError = () => {
    console.error('Login Failed');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" style={{ backgroundColor: 'var(--bg-color)' }}>
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center">
        <div className="mb-8">
          <Logo />
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-2" style={{ color: 'var(--text-primary)' }}>
          Welcome Back
        </h2>
        <p className="text-center text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
          Sign in to access your dashboard securely.
        </p>

        <div className="w-full flex justify-center py-4">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            useOneTap
            shape="rectangular"
            theme="outline"
            size="large"
          />
        </div>

        <div className="mt-8 pt-6 w-full text-center border-t border-gray-100">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
