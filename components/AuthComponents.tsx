import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from './icons';

interface AuthLayoutProps {
  title: string;
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ title, children }) => (
  <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)]">
    <div className="w-full max-w-md mx-auto p-8 rounded-2xl bg-black/30 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50">
      <h1 className="text-3xl font-bold text-center text-white mb-6">{title}</h1>
      {children}
    </div>
  </div>
);


interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className={`w-full h-12 bg-[#C8F560] text-black font-bold uppercase tracking-widest text-sm transition-all duration-300 hover:bg-white focus:outline-none focus:ring-4 focus:ring-[#C8F560]/50 disabled:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
};


interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(({ error, ...props }, ref) => (
  <div className="w-full">
    <input
      ref={ref}
      {...props}
      className={`w-full px-4 py-3 bg-white/5 border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00E0FF] focus:bg-white/10 backdrop-blur-sm transition-all duration-300`}
    />
    {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
  </div>
));

interface PasswordInputProps extends GlassInputProps {
    onStrengthChange?: (score: number) => void;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(({ onStrengthChange, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    
    // Basic password strength check (for visual feedback only)
    const checkStrength = (password: string) => {
        let score = 0;
        if (!password) {
            onStrengthChange?.(0);
            return;
        }
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        onStrengthChange?.(score);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        checkStrength(e.target.value);
        if (props.onChange) {
            props.onChange(e);
        }
    };
    
    return (
        <div className="relative w-full">
            <GlassInput
                ref={ref}
                type={showPassword ? 'text' : 'password'}
                {...props}
                onChange={handleChange}
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                aria-label={showPassword ? "Hide password" : "Show password"}
            >
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
        </div>
    );
});


export const PasswordStrengthBar: React.FC<{ score: number }> = ({ score }) => {
    const strength = {
        0: { width: '0%', color: 'bg-gray-700', label: ''},
        1: { width: '25%', color: 'bg-red-500', label: 'Weak' },
        2: { width: '50%', color: 'bg-yellow-500', label: 'Medium' },
        3: { width: '75%', color: 'bg-sky-500', label: 'Strong' },
        4: { width: '100%', color: 'bg-lime-500', label: 'Very Strong' },
    }[score] || { width: '0%', color: 'bg-gray-700', label: '' };

    return (
        <div className="w-full">
            <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                <div 
                    className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
                    style={{ width: strength.width }}
                ></div>
            </div>
            {strength.label && <p className="text-xs text-right mt-1" style={{color: strength.color.replace('bg-', '').replace('-500', '')}}>{strength.label}</p>}
        </div>
    );
};