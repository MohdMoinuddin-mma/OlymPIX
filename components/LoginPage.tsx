import React, { useState } from 'react';
import { AuthLayout, GlassInput, PrimaryButton } from './AuthComponents';

interface LoginPageProps {
  onLoginSuccess: (username: string) => void;
  onBack: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Dummy validation
    if (username.trim() === '' || password.trim() === '') {
      setError('Please fill in all fields.');
      return;
    }
    // Dummy success
    console.log('Logging in with:', { username, password });
    onLoginSuccess(username);
  };

  return (
    <AuthLayout title="Welcome Back">
      <form onSubmit={handleSubmit} className="space-y-6">
        <GlassInput
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <GlassInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-400 text-center text-sm">{error}</p>}
        <div className="pt-4">
          <PrimaryButton type="submit">
            Login
          </PrimaryButton>
        </div>
      </form>
      <div className="text-center mt-6">
        <button onClick={() => alert('Feature not implemented yet!')} className="text-sm text-gray-400 hover:text-[#00E0FF] transition">
          Forgot password?
        </button>
        <p className="text-sm text-gray-400 mt-4">
          Don't have an account?{' '}
          <button onClick={onBack} className="font-semibold text-[#C8F560] hover:underline">
            Go Back
          </button>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;