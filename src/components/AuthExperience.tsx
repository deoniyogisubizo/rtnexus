import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { UserRole, UserSession } from '../types';
import { Shield, CheckCircle, Chrome, Linkedin, Mail, Lock, ArrowLeft, Eye, EyeOff, BadgeCheck, XCircle, Lightbulb } from 'lucide-react';
import { signup, signin, checkUserExists, checkUsername, sendOtp, verifyOtp, resetPassword } from '../services/api';

interface AuthExperienceProps {
  onLoginSuccess: (session: UserSession) => void;
  initialTab?: 'login' | 'register';
  closeAuth?: () => void;
}

export default function AuthExperience({ onLoginSuccess, initialTab = 'login', closeAuth }: AuthExperienceProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);

  // Login state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Forgot password state
  const [showForgot, setShowForgot] = useState(false);
  const [fpStep, setFpStep] = useState<1 | 2 | 3 | 4>(1);
  const [fpIdentifier, setFpIdentifier] = useState('');
  const [fpOtp, setFpOtp] = useState('');
  const [fpNewPassword, setFpNewPassword] = useState('');
  const [fpConfirmPassword, setFpConfirmPassword] = useState('');
  const [fpError, setFpError] = useState('');
  const [fpMessage, setFpMessage] = useState('');

  // Signup state - step 1
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+250');
  const [countryOpen, setCountryOpen] = useState(false);
  const [localNumber, setLocalNumber] = useState('');
  const [phone, setPhone] = useState('');

  const countryOptions = [
    { code: '+250', label: '🇷🇼 +250' },
    { code: '+256', label: '🇺🇬 +256' },
    { code: '+254', label: '🇰🇪 +254' },
    { code: '+255', label: '🇹🇿 +255' },
    { code: '+257', label: '🇧🇮 +257' },
    { code: '+243', label: '🇨🇩 +243' },
    { code: '+1', label: '🇺🇸 +1' },
    { code: '+44', label: '🇬🇧 +44' },
    { code: '+33', label: '🇫🇷 +33' },
    { code: '+49', label: '🇩🇪 +49' },
    { code: '+86', label: '🇨🇳 +86' },
    { code: '+91', label: '🇮🇳 +91' },
    { code: '+234', label: '🇳🇬 +234' },
    { code: '+27', label: '🇿🇦 +27' },
  ];
  const [username, setUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupStep, setSignupStep] = useState<1 | 2>(1);

  // Signup state - step 2
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [agreement, setAgreement] = useState(false);

  // Username verification
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>([]);
  const usernameTimer = useRef<NodeJS.Timeout | null>(null);

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Pending OAuth user awaiting role selection
  const [pendingOAuth, setPendingOAuth] = useState<{ email: string; name: string } | null>(null);

  useEffect(() => {
    if (usernameTimer.current) clearTimeout(usernameTimer.current);
    if (!username || username.length < 3) {
      setUsernameStatus('idle');
      setUsernameSuggestions([]);
      return;
    }
    setUsernameStatus('checking');
    usernameTimer.current = setTimeout(async () => {
      const result = await checkUsername(username);
      setUsernameStatus(result.available ? 'available' : 'taken');
      setUsernameSuggestions(result.suggestions || []);
    }, 600);
    return () => { if (usernameTimer.current) clearTimeout(usernameTimer.current); };
  }, [username]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);
    const result = await signin(identifier, password);
    setLoading(false);
    if (!result.success) {
      setLoginError(result.message);
      return;
    }
    const session: UserSession = {
      email: result.user!.email,
      name: result.user!.name,
      role: result.user!.role as UserRole,
    };
    setSuccessMsg('Access granted. Redirecting to your workspace...');
    setTimeout(() => {
      onLoginSuccess(session);
      if (closeAuth) closeAuth();
    }, 1200);
  };

  const handleForgotCheck = async () => {
    setFpError('');
    setFpMessage('');
    if (!fpIdentifier.trim()) {
      setFpError('Enter your email or username.');
      return;
    }
    setLoading(true);
    const exists = await checkUserExists(fpIdentifier);
    setLoading(false);
    if (!exists.exists) {
      setFpError(exists.message);
      return;
    }
    setFpStep(2);
    setLoading(true);
    const otpResult = await sendOtp(fpIdentifier);
    setLoading(false);
    setFpMessage(otpResult.message);
  };

  const handleOtpVerify = async () => {
    setFpError('');
    if (fpOtp.length !== 6) {
      setFpError('Enter the full 6-digit OTP code.');
      return;
    }
    setLoading(true);
    const result = await verifyOtp(fpIdentifier, fpOtp);
    setLoading(false);
    if (!result.success) {
      setFpError(result.message);
      return;
    }
    setFpStep(3);
    setFpMessage('');
  };

  const handlePasswordReset = async () => {
    setFpError('');
    if (fpNewPassword.length < 6) {
      setFpError('Password must be at least 6 characters.');
      return;
    }
    if (fpNewPassword !== fpConfirmPassword) {
      setFpError('Passwords do not match.');
      return;
    }
    setLoading(true);
    const result = await resetPassword(fpIdentifier, fpNewPassword);
    setLoading(false);
    if (!result.success) {
      setFpError(result.message);
      return;
    }
    setFpStep(4);
  };

  const resetForgotFlow = () => {
    setShowForgot(false);
    setFpStep(1);
    setFpIdentifier('');
    setFpOtp('');
    setFpNewPassword('');
    setFpConfirmPassword('');
    setFpError('');
    setFpMessage('');
  };

  const handleSignupStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = localNumber.replace(/^0+/, '');
    setPhone(countryCode + cleaned);
    setSignupStep(2);
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await signup({
      fullName,
      email,
      phone,
      username,
      password: signupPassword,
      role: selectedRole,
    });
    setLoading(false);
    if (!result.success) {
      setLoginError(result.message);
      return;
    }
    setSuccessMsg(result.message + ' You can now sign in.');
    setTimeout(() => {
      setActiveTab('login');
      setSuccessMsg(null);
      setFullName('');
      setEmail('');
      setCountryCode('+250');
      setLocalNumber('');
      setPhone('');
      setUsername('');
      setSignupPassword('');
      setSignupStep(1);
      setSelectedRole('customer');
      setAgreement(false);
    }, 1500);
  };

  const handleSocialLogin = (provider: string) => {
    const clientId = import.meta.env[`VITE_${provider}_CLIENT_ID`] as string | undefined;
    if (!clientId) {
      setLoginError(`${provider} client ID not configured. Add VITE_${provider}_CLIENT_ID to .env.local`);
      return;
    }
    if (provider === 'GOOGLE') {
      if ((window as any).google?.accounts?.oauth2) {
        const tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'openid profile email',
          callback: (response: any) => {
            if (response.access_token) {
              fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: { Authorization: `Bearer ${response.access_token}` },
              })
                .then(r => r.json())
                .then(data => {
                  if (data.email) {
                    setPendingOAuth({ email: data.email, name: data.name || data.email });
                  }
                })
                .catch(() => {});
            }
          },
        });
        tokenClient.requestAccessToken();
      } else {
        const redirectUri = `${window.location.origin}/auth/callback`;
        const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=openid%20profile%20email&nonce=${Date.now()}`;
        window.location.href = url;
      }
      return;
    }
    const redirectUri = `${window.location.origin}/auth/callback`;
    let url = '';
    if (provider === 'MICROSOFT') {
      url = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token%20id_token&scope=openid%20profile%20email&nonce=${Date.now()}`;
    } else if (provider === 'LINKEDIN') {
      url = `https://www.linkedin.com/oauth/v2/authorization?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid%20profile%20email`;
    }
    if (url) window.location.href = url;
  };

  return (
    <div className="w-full max-w-4xl bg-white border border-gray-200 grid grid-cols-1 md:grid-cols-12 rounded-none overflow-y-auto md:overflow-hidden select-none font-sans text-left text-gray-900 shadow-2xl max-h-[90vh] md:max-h-none">
      
      {/* LEFT COLUMN: BRAND + SOCIAL SSO */}
      <div className="md:col-span-5 bg-[#111111] text-white p-4 sm:p-8 flex flex-col justify-between border-r border-[#3373AB] relative">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(circle, #3373AB 1px, transparent 1px)', 
            backgroundSize: '16px 16px' 
          }}></div>
        </div>

        <div className="z-10 text-left">
          <img src="/logo/logo.png" alt="RT Group" className="h-10 scale-300 ml-10 w-auto object-contain mb-6" />
          
          <StyledTyping>
            <div className="animation">hello again!</div>
          </StyledTyping>
          <p className="text-sm text-gray-400 font-light leading-relaxed font-sans">
            Sign in with your credentials or use a social single sign-on provider to access your workspace instantly.
          </p>

          <div className="space-y-3 mt-8 hidden md:block">
            <span className="text-sm font-mono text-gray-500 uppercase font-bold block mb-3">Sovereign Social Single Sign-on</span>
            
            <button onClick={() => handleSocialLogin('GOOGLE')} className="w-full bg-white hover:bg-gray-100 text-sm px-3.5 py-2.5 flex items-center gap-2.5 transition-all text-gray-700 font-sans border border-gray-200 rounded-none shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30">
              <Chrome size={15} className="text-[#4285F4]" />
              <span className="font-semibold">Continue with Google</span>
            </button>
            <button onClick={() => handleSocialLogin('MICROSOFT')} className="w-full bg-white hover:bg-gray-100 text-sm px-3.5 py-2.5 flex items-center gap-2.5 transition-all text-gray-700 font-sans border border-gray-200 rounded-none shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30">
              <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path fill="#F25022" d="M11.37 12.73H2.67V4.03h8.7v8.7z"/><path fill="#00A4EF" d="M21.37 12.73h-8.7V4.03h8.7v8.7z"/><path fill="#FFB900" d="M11.37 22.03H2.67v-8.7h8.7v8.7z"/><path fill="#7FBA00" d="M21.37 22.03h-8.7v-8.7h8.7v8.7z"/></svg>
              <span className="font-semibold">Continue with Microsoft</span>
            </button>
            <button onClick={() => handleSocialLogin('LINKEDIN')} className="w-full bg-[#0A66C2] hover:bg-[#004182] text-sm px-3.5 py-2.5 flex items-center gap-2.5 transition-all text-white font-sans border border-[#0A66C2] rounded-none shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30">
              <Linkedin size={15} className="text-white" />
              <span className="font-semibold">Continue with LinkedIn</span>
            </button>
          </div>
        </div>

        <div className="h-10 border-t border-neutral-800 hidden md:flex items-center justify-between text-sm font-mono text-gray-500 z-10 pt-4 mt-6">
          <span>ALGORITHM: SHA-512</span>
          <span>Sovereign Identity Key</span>
        </div>
      </div>

      {/* RIGHT COLUMN: LOGIN / REGISTER / OAUTH ROLE PICKER */}
      <div className="md:col-span-7 p-4 sm:p-8 flex flex-col justify-between">
        {pendingOAuth && (
          <div className="flex-1 flex flex-col justify-center">
            <div className="mb-6 text-center">
              <div className="h-12 w-12 bg-[#3373AB]/10 text-[#3373AB] flex items-center justify-center mx-auto mb-3">
                <Shield size={22} />
              </div>
              <h4 className="font-bold text-sm text-gray-900 uppercase tracking-wider">Welcome, {pendingOAuth.name.split(' ')[0]}!</h4>
              <p className="text-sm text-gray-500 mt-1 font-sans">{pendingOAuth.email}</p>
              <p className="text-sm text-gray-400 mt-3 font-sans">Choose your workspace to get started</p>
            </div>
            <div className="space-y-2.5">
              {[
                { role: 'customer' as UserRole, label: 'Marketplace Buyer', icon: '🛒', desc: 'Browse and purchase hardware from verified foundries.' },
                { role: 'student' as UserRole, label: 'RTTI Student', icon: '📚', desc: 'Enroll in courses, earn certifications, and access labs.' },
                { role: 'instructor' as UserRole, label: 'Research Instructor', icon: '🎓', desc: 'Create courses, grade exams, and host live webinars.' },
                { role: 'vendor' as UserRole, label: 'OEM Seller', icon: '🏭', desc: 'List products, manage inventory, and process orders.' },
                { role: 'advertiser' as UserRole, label: 'Sponsorship Partner', icon: '📢', desc: 'Run ad campaigns, track impressions, and manage budgets.' },
              ].map(opt => (
                <button
                  key={opt.role}
                  type="button"
                  onClick={() => {
                    const session: UserSession = { email: pendingOAuth.email, name: pendingOAuth.name, role: opt.role };
                    onLoginSuccess(session);
                    if (closeAuth) closeAuth();
                  }}
                  className="w-full bg-white border border-gray-200 hover:border-[#3373AB] hover:bg-[#3373AB]/5 px-4 py-3 flex items-center gap-3 transition-all text-left outline-none group"
                >
                  <span className="text-lg">{opt.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-800 group-hover:text-[#3373AB] transition-colors">{opt.label}</p>
                    <p className="text-sm text-gray-400 font-sans">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setPendingOAuth(null)}
              className="text-sm text-gray-400 hover:text-gray-600 text-center mt-4 underline outline-none"
            >
              ← Use a different account
            </button>
          </div>
        )}
        {!pendingOAuth && successMsg && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-16 text-emerald-800 animate-fade-in space-y-4 font-sans">
            <div className="h-12 w-12 bg-emerald-50 text-emerald-600 flex items-center justify-center rounded-none animate-bounce">
              <Shield size={24} />
            </div>
            <h4 className="font-bold text-sm text-gray-900 uppercase">{successMsg.includes('granted') ? 'ACCESS GRANTED' : 'ACCOUNT CREATED'}</h4>
            <p className="text-sm text-gray-500 max-w-sm font-light leading-relaxed">{successMsg}</p>
          </div>
        )}
        {!pendingOAuth && !successMsg && (
          <div>
            <div className="flex border-b border-gray-200 pb-3 mb-6 gap-6">
              <button 
                onClick={() => { setActiveTab('login'); setLoginError(''); }}
                className={`text-sm uppercase tracking-wider font-bold transition-colors pb-1 outline-none ${activeTab === 'login' ? 'border-b-2 border-[#3373AB] text-[#3373AB]' : 'text-gray-400 hover:text-gray-700'}`}
              >
                Sign In
              </button>
              <button 
                onClick={() => { setActiveTab('register'); setLoginError(''); }}
                className={`text-sm uppercase tracking-wider font-bold transition-colors pb-1 outline-none ${activeTab === 'register' ? 'border-b-2 border-[#3373AB] text-[#3373AB]' : 'text-gray-400 hover:text-gray-700'}`}
              >
                Create Account
              </button>
            </div>

            {/* LOGIN TAB */}
            {activeTab === 'login' && !showForgot && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-sm font-mono font-bold text-gray-400 uppercase block mb-1">
                    <Mail size={11} className="inline mr-1" />
                    Email / Username / Phone
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. user@email.com or username"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full bg-white border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#3373AB]"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-mono font-bold text-gray-400 uppercase block mb-1">
                    <Lock size={11} className="inline mr-1" />
                    Password
                  </label>
                  <div className="relative">
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#3373AB] pr-8"
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 outline-none">
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {loginError && (
                  <p className="text-sm text-red-500 font-sans">{loginError}</p>
                )}

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#111111] hover:bg-neutral-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-mono uppercase tracking-widest py-3 text-center transition-colors rounded-none outline-none"
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                </button>

                <div className="flex items-center justify-between pt-1">
                  <button type="button" onClick={() => { setShowForgot(true); setFpIdentifier(identifier); }} className="text-sm text-[#3373AB] hover:underline font-semibold outline-none">
                    Forgot account?
                  </button>
                  <button type="button" onClick={() => setActiveTab('register')} className="text-sm text-[#3373AB] hover:underline font-semibold outline-none">
                    Don't have an account? Sign up
                  </button>
                </div>
              </form>
            )}

            {/* FORGOT PASSWORD FLOW */}
            {activeTab === 'login' && showForgot && (
              <div className="space-y-4">
                <button onClick={resetForgotFlow} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 outline-none mb-2">
                  <ArrowLeft size={13} /> Back to sign in
                </button>

                {fpStep === 1 && (
                  <div>
                    <p className="text-sm text-gray-600 font-sans mb-4">Enter the email address or username associated with your account.</p>
                    <div>
                      <label className="text-sm font-mono font-bold text-gray-400 uppercase block mb-1">Email or Username</label>
                      <input 
                        type="text" 
                        placeholder="e.g. user@email.com"
                        value={fpIdentifier}
                        onChange={(e) => setFpIdentifier(e.target.value)}
                        className="w-full bg-white border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#3373AB]"
                      />
                    </div>
                    {fpError && <p className="text-sm text-red-500 font-sans mt-2">{fpError}</p>}
                    <button 
                      onClick={handleForgotCheck}
                      disabled={loading}
                      className="w-full bg-[#3373AB] hover:bg-[#255C8E] disabled:bg-gray-300 text-white text-sm font-mono uppercase tracking-widest py-3 text-center transition-colors rounded-none outline-none mt-4"
                    >
                      {loading ? 'Checking...' : 'Send OTP'}
                    </button>
                  </div>
                )}

                {fpStep === 2 && (
                  <div>
                    {fpMessage && <p className="text-sm text-emerald-600 font-sans mb-4">{fpMessage}</p>}
                    <p className="text-sm text-gray-600 font-sans mb-4">Enter the 6-digit verification code sent to your registered contact.</p>
                    <div>
                      <label className="text-sm font-mono font-bold text-gray-400 uppercase block mb-1">OTP Verification Code</label>
                      <input 
                        type="text" 
                        placeholder="000000"
                        maxLength={6}
                        value={fpOtp}
                        onChange={(e) => setFpOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="w-full bg-white border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#3373AB] tracking-widest text-center font-mono"
                      />
                    </div>
                    {fpError && <p className="text-sm text-red-500 font-sans mt-2">{fpError}</p>}
                    <button 
                      onClick={handleOtpVerify}
                      disabled={loading || fpOtp.length !== 6}
                      className="w-full bg-[#3373AB] hover:bg-[#255C8E] disabled:bg-gray-300 text-white text-sm font-mono uppercase tracking-widest py-3 text-center transition-colors rounded-none outline-none mt-4"
                    >
                      {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                  </div>
                )}

                {fpStep === 3 && (
                  <div>
                    <p className="text-sm text-gray-600 font-sans mb-4">Choose a new password for your account.</p>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-mono font-bold text-gray-400 uppercase block mb-1">New Password</label>
                        <input 
                          type="password" 
                          placeholder="At least 6 characters"
                          value={fpNewPassword}
                          onChange={(e) => setFpNewPassword(e.target.value)}
                          className="w-full bg-white border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#3373AB]"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-mono font-bold text-gray-400 uppercase block mb-1">Confirm New Password</label>
                        <input 
                          type="password" 
                          placeholder="Re-enter new password"
                          value={fpConfirmPassword}
                          onChange={(e) => setFpConfirmPassword(e.target.value)}
                          className="w-full bg-white border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#3373AB]"
                        />
                      </div>
                    </div>
                    {fpError && <p className="text-sm text-red-500 font-sans mt-2">{fpError}</p>}
                    <button 
                      onClick={handlePasswordReset}
                      disabled={loading}
                      className="w-full bg-[#3373AB] hover:bg-[#255C8E] disabled:bg-gray-300 text-white text-sm font-mono uppercase tracking-widest py-3 text-center transition-colors rounded-none outline-none mt-4"
                    >
                      {loading ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                )}

                {fpStep === 4 && (
                  <div className="text-center py-8 space-y-4">
                    <CheckCircle size={32} className="text-emerald-500 mx-auto" />
                    <h4 className="font-bold text-sm text-gray-900 uppercase">Password Updated</h4>
                    <p className="text-sm text-gray-500">Your password has been successfully reset.</p>
                    <button 
                      onClick={resetForgotFlow}
                      className="bg-[#3373AB] hover:bg-[#255C8E] text-white text-sm font-mono uppercase tracking-widest px-6 py-3 transition-colors rounded-none outline-none"
                    >
                      Back to Sign In
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* SIGNUP TAB - STEP 1 */}
            {activeTab === 'register' && signupStep === 1 && (
              <form onSubmit={handleSignupStep1} className="space-y-4">
                <p className="text-sm text-gray-500 font-mono mb-4 font-bold">Step 1 of 2 — Personal Information</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-mono font-bold text-gray-400 uppercase block mb-1">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Jane Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#3373AB]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-mono font-bold text-gray-400 uppercase block mb-1">Email</label>
                    <input 
                      type="email" 
                      placeholder="e.g. jane@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#3373AB]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-mono font-bold text-gray-400 uppercase block mb-1">Phone Number</label>
                    <div className="flex gap-2 relative">
                      <div className="relative flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => setCountryOpen(!countryOpen)}
                          className="h-full bg-white border border-gray-200 text-sm px-1.5 py-2 text-gray-700 outline-none focus:border-[#3373AB] hover:bg-gray-50 w-16 flex items-center gap-0.5 justify-center"
                        >
                          <span className="text-base leading-none">{countryOptions.find(c => c.code === countryCode)?.label.split(' ')[0]}</span>
                          <svg className={`w-2.5 h-2.5 text-gray-400 transition-transform ${countryOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        {countryOpen && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setCountryOpen(false)} />
                            <div className="absolute left-0 top-full mt-0.5 bg-white border border-gray-200 shadow-xl z-20 max-h-48 overflow-y-auto w-[140px]">
                              {countryOptions.map(opt => (
                                <button
                                  key={opt.code}
                                  type="button"
                                  onClick={() => { setCountryCode(opt.code); setCountryOpen(false); }}
                                  className={`w-full text-left px-2.5 py-1.5 text-sm hover:bg-gray-100 outline-none ${countryCode === opt.code ? 'bg-[#3373AB]/10 font-bold text-[#3373AB]' : 'text-gray-700'}`}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                      <input 
                        type="tel" 
                        placeholder="e.g. 788 123 456"
                        value={localNumber}
                        onChange={(e) => setLocalNumber(e.target.value.replace(/[^0-9]/g, ''))}
                        className="flex-1 bg-white border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#3373AB]"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-mono font-bold text-gray-400 uppercase block mb-1">Username (unique)</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="e.g. jane_doe"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={`w-full bg-white border px-3 py-2 text-sm text-gray-800 outline-none pr-8 ${
                          usernameStatus === 'available' ? 'border-emerald-500' :
                          usernameStatus === 'taken' ? 'border-red-400' :
                          'border-gray-200 focus:border-[#3373AB]'
                        }`}
                        required
                        minLength={3}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2">
                        {usernameStatus === 'checking' && (
                          <svg className="h-4 w-4 animate-spin text-gray-400" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        )}
                        {usernameStatus === 'available' && <BadgeCheck size={16} className="text-emerald-500" />}
                        {usernameStatus === 'taken' && <XCircle size={16} className="text-red-400" />}
                      </span>
                    </div>
                    {usernameStatus === 'taken' && usernameSuggestions.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <Lightbulb size={11} className="text-amber-500" />
                        <span className="text-sm text-gray-500">Suggestions:</span>
                        {usernameSuggestions.map((s, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => { setUsername(s); setUsernameStatus('idle'); }}
                            className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-1.5 py-0.5 font-mono border border-gray-200 outline-none"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                    {usernameStatus === 'available' && (
                      <p className="text-sm text-emerald-600 mt-1 font-medium">Username is available.</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-mono font-bold text-gray-400 uppercase block mb-1">Password</label>
                  <input 
                    type="password" 
                    placeholder="At least 6 characters"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full bg-white border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#3373AB]"
                    required
                    minLength={6}
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#3373AB] hover:bg-[#255C8E] text-white text-sm font-mono uppercase tracking-widest py-3 text-center transition-colors rounded-none outline-none"
                >
                  Continue — Workspace Setup
                </button>

                <p className="text-sm text-gray-400 text-center">
                  Already have an account?{' '}
                  <button type="button" onClick={() => setActiveTab('login')} className="text-[#3373AB] hover:underline font-semibold outline-none">Sign in</button>
                </p>
              </form>
            )}

            {/* SIGNUP TAB - STEP 2 */}
            {activeTab === 'register' && signupStep === 2 && (
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-500 font-mono font-bold">Step 2 of 2 — Role & Agreement</p>
                  <button type="button" onClick={() => setSignupStep(1)} className="text-sm text-[#3373AB] hover:underline outline-none">← Back</button>
                </div>

                <div className="bg-gray-50 p-3 border border-gray-200 space-y-1 mb-2">
                  <p className="text-sm text-gray-700 font-semibold">Reviewing:</p>
                  <p className="text-sm text-gray-500"><span className="font-semibold">Name:</span> {fullName}</p>
                  <p className="text-sm text-gray-500"><span className="font-semibold">Email:</span> {email}</p>
                  <p className="text-sm text-gray-500"><span className="font-semibold">Username:</span> {username}</p>
                </div>

                <div>
                  <label className="text-sm font-mono font-bold text-gray-400 uppercase block mb-1">Select Workspace Role</label>
                  <select 
                    value={selectedRole} 
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="w-full bg-white border border-gray-200 text-sm px-2.5 py-2 text-gray-700 outline-none focus:border-[#3373AB]"
                  >
                    <option value="all">All in One — Choose workspace on access</option>
                    <option value="customer">Marketplace Customer (Buyer)</option>
                    <option value="student">Accredited Student (RTTI Academic)</option>
                    <option value="instructor">Curricula Instructor (RTTI Lead)</option>
                    <option value="vendor">OEM Foundry Vendor (Seller)</option>
                    <option value="advertiser">Sponsorship Partner (Advertiser)</option>
                  </select>
                </div>

                <div className="flex gap-2 items-start mt-2">
                  <input 
                    type="checkbox" 
                    checked={agreement}
                    onChange={(e) => setAgreement(e.target.checked)}
                    className="h-3 w-3 mt-0.5 accent-[#3373AB] rounded-none cursor-pointer"
                    required
                  />
                  <p className="text-sm text-gray-500 font-sans leading-snug">
                    I agree to the ledger operations standards. Every compiled program and hardware dispatch complies with safety specifications.
                  </p>
                </div>

                {loginError && <p className="text-sm text-red-500 font-sans">{loginError}</p>}

                <button 
                  type="submit"
                  disabled={!agreement || loading}
                  className="w-full bg-[#111111] hover:bg-neutral-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-sm font-mono uppercase tracking-widest py-3 text-center transition-colors rounded-none outline-none"
                >
                  {loading ? 'Creating Account...' : 'Create Secure Account'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Mobile social login — bottom */}
        {!pendingOAuth && !successMsg && (
          <div className="md:hidden mt-6 pt-6 border-t border-gray-200">
            <span className="text-sm font-mono text-gray-400 uppercase font-bold block mb-3">Sovereign Social Single Sign-on</span>
            <div className="space-y-3">
              <button onClick={() => handleSocialLogin('GOOGLE')} className="w-full bg-yellow-100 hover:bg-yellow-200 text-sm px-3.5 py-2.5 flex items-center gap-2.5 transition-all text-yellow-800 font-sans border border-yellow-300 rounded-none shadow-sm hover:shadow-md">
                <Chrome size={15} className="text-yellow-700" />
                <span className="font-semibold">Continue with Google</span>
              </button>
              <button onClick={() => handleSocialLogin('MICROSOFT')} className="w-full bg-white hover:bg-gray-100 text-sm px-3.5 py-2.5 flex items-center gap-2.5 transition-all text-gray-700 font-sans border border-gray-200 rounded-none shadow-sm hover:shadow-md">
                <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path fill="#F25022" d="M11.37 12.73H2.67V4.03h8.7v8.7z"/><path fill="#00A4EF" d="M21.37 12.73h-8.7V4.03h8.7v8.7z"/><path fill="#FFB900" d="M11.37 22.03H2.67v-8.7h8.7v8.7z"/><path fill="#7FBA00" d="M21.37 22.03h-8.7v-8.7h8.7v8.7z"/></svg>
                <span className="font-semibold">Continue with Microsoft</span>
              </button>
              <button onClick={() => handleSocialLogin('LINKEDIN')} className="w-full bg-[#0A66C2] hover:bg-[#004182] text-sm px-3.5 py-2.5 flex items-center gap-2.5 transition-all text-white font-sans border border-[#0A66C2] rounded-none shadow-sm hover:shadow-md">
                <Linkedin size={15} className="text-white" />
                <span className="font-semibold">Continue with LinkedIn</span>
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

const StyledTyping = styled.div`
  @keyframes typing {
    from {
      width: 0;
    }
  }

  @keyframes blink-caret {
    50% {
      border-color: transparent;
    }
  }

  .animation {
    font:
      bold 200% Consolas,
      Monaco,
      monospace;
    border-right: 0.1em solid white;
    width: 13.2ch;
    margin: 0 0 0.5em 0;
    white-space: nowrap;
    overflow: hidden;
    animation:
      typing 5s steps(13, end),
      blink-caret 0.5s step-end infinite alternate;
  }
`;
