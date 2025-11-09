import React, { useState, useEffect } from 'react';
import { AuthLayout, GlassInput, PrimaryButton, PasswordInput, PasswordStrengthBar } from './AuthComponents';

interface RegisterPageProps {
  onRegisterSuccess: () => void;
  onBack: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegisterSuccess, onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (username.length < 3) {
        newErrors.username = "Username must be at least 3 characters.";
    }
    if (password.length < 8) {
        newErrors.password = "Password must be at least 8 characters.";
    } else if (passwordStrength < 2) {
        newErrors.password = "Password is too weak.";
    }
    if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log('Registering with:', { username, password });
      onRegisterSuccess();
    }
  };

  return (
    <AuthLayout title="Create Account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <GlassInput
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={errors.username}
          required
        />
        <PasswordInput
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onStrengthChange={setPasswordStrength}
          error={errors.password}
          required
        />
        <PasswordStrengthBar score={passwordStrength} />
        
        <PasswordInput
          placeholder="Re-enter Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          required
        />
        
        <div className="pt-4">
          <PrimaryButton type="submit">
            Continue
          </PrimaryButton>
        </div>
      </form>
      <div className="text-center mt-6">
        <p className="text-sm text-gray-400">
          Already have an account?{' '}
          <button onClick={onBack} className="font-semibold text-[#C8F560] hover:underline">
            Go Back
          </button>
        </p>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;