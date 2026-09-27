import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Lock } from 'lucide-react';

interface LoginPageProps {
  onLogin: (pass: string) => boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  onSuccess,
  onCancel,
}) => {
  const [password, setPassword] = useState('');
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    const ok = onLogin(password);
    if (ok) {
      onSuccess();
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setPassword('');
    }
  };

  return (
    <div
      className="h-[calc(100vh-8rem)] w-full flex items-center justify-center p-4 bg-[#d9d9d9] overflow-hidden"
      style={{ backgroundColor: '#d9d9d9' }}
    >
      <motion.form
        onSubmit={handleSubmit}
        animate={shake ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xs sm:max-w-sm flex flex-col items-center justify-center space-y-4"
      >
        <div className="relative w-full flex items-center">
          <input
            ref={inputRef}
            type="password"
            value={password || ''}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter password..."
            className="w-full pl-5 pr-12 py-3.5 text-center text-slate-900 bg-white border border-slate-300/90 rounded-2xl focus:outline-none focus:border-slate-800 shadow-sm transition-all text-sm tracking-widest placeholder:text-slate-400 placeholder:tracking-normal font-mono-numbers"
          />
          <button
            type="submit"
            disabled={!password}
            className={`absolute right-1.5 p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
              password
                ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm'
                : 'bg-slate-200 text-slate-400 hover:bg-slate-300'
            }`}
            title="Submit Password"
            aria-label="Submit Password"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.form>
    </div>
  );
};
