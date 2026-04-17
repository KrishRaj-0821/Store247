'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { Mail, Phone, Lock, User as UserIcon, Shield, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [isRegister, setIsRegister] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [step, setStep] = useState<'request' | 'verify'>('request');
  
  // Form states
  const [phone, setPhone] = useState('9876543210'); // Demo phone
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('admin123'); // Demo password
  
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isAdmin) {
      // Admin Login
      if (!email || !password) return toast.error('Enter email and password');
      setLoading(true);
      try {
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'admin-login', email, password })
        });
        const data = await res.json();
        if (data.success) {
          login(data.user);
          toast.success('Welcome Admin!');
          router.push('/admin');
        } else {
          toast.error(data.error);
        }
      } finally {
        setLoading(false);
      }
      return;
    }

    // Customer OTP Flow
    if (!phone) return toast.error('Enter phone number');
    if (isRegister && !name) return toast.error('Enter your name');
    
    setLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send-otp', phone })
      });
      const data = await res.json();
      if (data.success) {
        setStep('verify');
        // Pre-fill OTP for easy testing
        setOtp(data.devOtp);
        toast.success(`OTP Sent! (Demo: ${data.devOtp})`);
      } else {
        toast.error(data.error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return toast.error('Enter OTP');
    
    setLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify-otp', phone, otp, name, email })
      });
      const data = await res.json();
      if (data.success) {
        login(data.user);
        toast.success(`Welcome ${data.user.name}!`);
        router.push('/');
      } else {
        toast.error(data.error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-4 left-4">
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-green-600 transition-colors font-medium">
          <ArrowLeft size={16} /> Back to Store
        </Link>
      </div>

      <div className="max-w-4xl w-full mx-auto bg-white rounded-[2rem] shadow-xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left: Image (hidden on mobile) */}
        <div className="hidden md:flex md:w-1/2 bg-green-50 p-12 flex-col justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-amber-500/10" />
          <div className="relative z-10">
            <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">
              Quality Groceries,<br/>Delivered Fresh.
            </h2>
            <p className="text-slate-600 mb-8">Join thousands of happy customers in 854318 and experience hassle-free shopping.</p>
            
            <div className="space-y-4">
              {[
                { i: '🚀', t: 'Superfast Delivery' },
                { i: '✅', t: '100% Quality Assured' },
                { i: '💵', t: 'Best Prices Guaranteed' }
              ].map((item) => (
                <div key={item.t} className="flex items-center gap-3 bg-white/60 backdrop-blur-sm p-3 rounded-xl shadow-sm border border-white">
                  <span className="text-xl">{item.i}</span>
                  <span className="font-semibold text-slate-700 text-sm">{item.t}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Decorative shapes */}
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-green-500/20 rounded-full blur-3xl" />
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl" />
        </div>

        {/* Right: Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-black text-slate-900">
              {isAdmin ? 'Admin Login' : (isRegister ? 'Create Account' : 'Welcome Back')}
            </h3>
            <p className="text-slate-500 text-sm mt-2">
              {isAdmin ? 'Manage your store' : 'Login with your phone number'}
            </p>
          </div>

          <form onSubmit={step === 'request' ? handleRequestOtp : handleVerifyOtp} className="space-y-5">
            
            {step === 'request' && (
              <>
                {isAdmin ? (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Admin Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field pl-10" placeholder="admin@skgeneral.com" required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input-field pl-10" placeholder="••••••••" required />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="input-field pl-10" placeholder="98765 43210" required maxLength={10} />
                      </div>
                    </div>
                    {isRegister && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Full Name</label>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input type="text" value={name} onChange={e => setName(e.target.value)} className="input-field pl-10" placeholder="John Doe" required />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {step === 'verify' && !isAdmin && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase leading-relaxed">
                  Enter OTP sent to {phone} <br/>
                  <span className="text-amber-600 lowercase">(Demo mode: OTP is pre-filled)</span>
                </label>
                <div className="relative flex justify-center">
                  <input
                    type="text"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    className="input-field text-center text-2xl font-bold tracking-[0.5em] py-4"
                    maxLength={6}
                    placeholder="------"
                    required
                  />
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 text-base mt-2">
              {loading ? <Loader2 size={18} className="animate-spin" /> : (
                step === 'verify' ? 'Verify OTP & Login' : (isAdmin ? 'Login as Admin' : (isRegister ? 'Send OTP' : 'Request OTP'))
              )}
            </button>
          </form>

          {step === 'request' && (
            <div className="mt-8 text-center text-sm text-slate-500 border-t border-slate-100 pt-6">
              {!isAdmin && (
                <p className="mb-4">
                  {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                  <button onClick={() => setIsRegister(!isRegister)} className="font-semibold text-green-600 hover:text-green-700 transition-colors">
                    {isRegister ? 'Login here' : 'Sign up now'}
                  </button>
                </p>
              )}
              
              <button 
                onClick={() => { setIsAdmin(!isAdmin); setStep('request'); }} 
                className={`inline-flex items-center gap-1.5 font-medium transition-colors ${isAdmin ? 'text-green-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {isAdmin ? <><UserIcon size={14} /> Back to Customer Login</> : <><Shield size={14} /> Admin access</>}
              </button>
            </div>
          )}

          {step === 'verify' && (
            <div className="mt-6 text-center">
              <button onClick={() => setStep('request')} className="text-sm text-green-600 hover:text-green-700 font-medium">
                Change Phone Number
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
