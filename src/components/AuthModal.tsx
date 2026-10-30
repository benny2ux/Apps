import React, { useState } from 'react';
import { appStore } from '../services/store';
import { Logo } from './Logo';
import { X, Mail, Lock, User as UserIcon, Calendar, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [dob, setDob] = useState('2000-01-01');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (mode === 'reset') {
      setStatusMsg({
        type: 'success',
        text: `Secure password reset instructions sent to ${email || 'your email'}.`
      });
      return;
    }

    if (mode === 'signup') {
      // Age verification check (13+)
      const birthYear = new Date(dob).getFullYear();
      const age = new Date().getFullYear() - birthYear;
      if (age < 13) {
        setStatusMsg({
          type: 'error',
          text: 'Under TIME UP safety policies, users must be at least 13 years old.'
        });
        return;
      }

      // Create new user
      const newUser = {
        id: `user_${Date.now()}`,
        username: username || 'new_creator',
        displayName: username || 'New Creator',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        bio: '✨ Connect. Create. Rise. Just joined TIME UP!',
        dob,
        ageVerified: true,
        isVerified: false,
        followersCount: 1,
        followingCount: 3,
        likesReceivedCount: 0,
        postsCount: 0,
        gifterLevel: 1,
        gifterXp: 0,
        isEnigmaEligible: false,
        isEnigmaPurchased: false,
        isEnigmaActive: false,
        creatorLeague: 'D2' as const,
        leagueCoinsReceived: 0,
        leagueTargetCoins: 5000,
        leagueChallengeExpiresAt: Date.now() + 48 * 3600 * 1000,
        leagueFragments: { blue: 1, red: 0, gold: 0, purple: 0 },
        walletCoins: 100, // Welcome gift coins
        creatorEarningsKsh: 0,
        creatorPendingKsh: 0,
        liveStrikes: 0,
        isLiveSuspended: false,
        isAccountSuspended: false,
        blockedUserIds: [],
        role: 'user' as const
      };

      appStore.users.push(newUser);
      appStore.currentUser = newUser;
      appStore.notify();

      setStatusMsg({
        type: 'success',
        text: 'Account created! Welcome to TIME UP. 100 bonus coins credited.'
      });
      setTimeout(() => {
        onClose();
      }, 1200);
      return;
    }

    // Login mode
    setStatusMsg({ type: 'success', text: 'Secure session authenticated. Welcome back!' });
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 select-none">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-purple-900 to-violet-800 text-white flex items-center justify-between">
          <Logo size="sm" withText={true} />
          <button onClick={onClose} className="p-1 rounded-full text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-4">
          <div className="text-center">
            <h3 className="font-display font-extrabold text-lg text-gray-900">
              {mode === 'login' ? 'Sign In to TIME UP' : mode === 'signup' ? 'Create Your Account' : 'Reset Password'}
            </h3>
            <p className="text-xs text-purple-700 font-semibold mt-0.5">
              Connect · Create · Rise
            </p>
          </div>

          {statusMsg && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 font-medium ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'bg-red-50 text-red-900 border border-red-200'
              }`}
            >
              {statusMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            {mode === 'signup' && (
              <div>
                <label className="font-bold text-gray-700 block mb-1">Username</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="e.g. StarCreator"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none font-semibold"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="font-bold text-gray-700 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none font-semibold"
                />
              </div>
            </div>

            {mode !== 'reset' && (
              <div>
                <label className="font-bold text-gray-700 block mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none font-semibold"
                  />
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label className="font-bold text-gray-700 block mb-1">Date of Birth & Age Verification</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={e => setDob(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none font-semibold"
                  />
                </div>
                <span className="text-[10px] text-gray-500 mt-1 block">
                  Protects minors and configures age-appropriate safety settings.
                </span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold shadow-md transition-all mt-2"
            >
              {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
            </button>
          </form>

          {/* Switchers */}
          <div className="flex items-center justify-between text-[11px] font-semibold text-purple-700 pt-2 border-t border-gray-100">
            {mode === 'login' ? (
              <>
                <button onClick={() => setMode('reset')} className="hover:underline">
                  Forgot password?
                </button>
                <button onClick={() => setMode('signup')} className="font-extrabold hover:underline">
                  Sign up free
                </button>
              </>
            ) : (
              <button onClick={() => setMode('login')} className="w-full text-center hover:underline">
                Already have an account? Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
