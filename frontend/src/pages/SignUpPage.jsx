import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router';
import { Mail, Lock, User, Loader2, KeyRound } from 'lucide-react';

const SignUpPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState('register'); // 'register' or 'confirm'
  const [loading, setLoading] = useState(false);

  const { signup, confirmSignup, login } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signup(formData);
      if (result.userConfirmed) {
        // Auto-confirmed — log in immediately
        await login({ email: formData.email, password: formData.password });
        navigate('/');
      } else {
        // Needs email verification
        setStep('confirm');
      }
    } catch (err) {
      // error toast is handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await confirmSignup({ email: formData.email, code: verificationCode });
      // After confirmation, log in
      await login({ email: formData.email, password: formData.password });
      navigate('/');
    } catch (err) {
      // error toast is handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-[0_0_40px_rgba(0,255,157,0.1)]">
        
        {step === 'register' && (
          <>
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Create Account</h2>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Full Name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00FF9D]/50 focus:border-transparent transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="email" 
                  placeholder="Email"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00FF9D]/50 focus:border-transparent transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="password" 
                  placeholder="Password (min 8 chars, upper, lower, number, symbol)"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00FF9D]/50 focus:border-transparent transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#00FF9D] text-black font-semibold py-3 rounded-xl hover:bg-[#00cc7d] transition-all flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(0,255,157,0.3)] hover:shadow-[0_0_30px_rgba(0,255,157,0.5)] disabled:opacity-70"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Sign Up</span>}
              </button>
            </form>



            <p className="text-gray-400 text-center mt-6">
              Already have an account? <Link to="/login" className="text-[#00FF9D] hover:underline">Log in</Link>
            </p>
          </>
        )}

        {step === 'confirm' && (
          <>
            <h2 className="text-3xl font-bold text-white mb-2 text-center">Verify Email</h2>
            <p className="text-gray-400 text-center mb-6">Enter the code sent to <span className="text-[#00FF9D]">{formData.email}</span></p>
            <form onSubmit={handleConfirm} className="space-y-4">
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Verification Code"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00FF9D]/50 focus:border-transparent transition-all text-center text-xl tracking-widest"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#00FF9D] text-black font-semibold py-3 rounded-xl hover:bg-[#00cc7d] transition-all flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(0,255,157,0.3)] hover:shadow-[0_0_30px_rgba(0,255,157,0.5)] disabled:opacity-70"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Verify & Sign In</span>}
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
};

export default SignUpPage;
