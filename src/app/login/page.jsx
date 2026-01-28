'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function LoginPage() {
  const [step, setStep] = useState('email'); // 'email' or 'otp'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true, // Auto-signup if not exists
        },
      });
      
      if (error) throw error;
      
      // Move to next step
      setStep('otp');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      });

      if (error) throw error;

      // Success! Redirect to home
      router.push('/');
      router.refresh();
    } catch (err) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '80vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        padding: '2.5rem',
        borderRadius: '16px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        width: '100%',
        maxWidth: '400px',
        border: '1px solid #e5e5e5'
      }}>
        {step === 'email' ? (
          <>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '8px', textAlign: 'center' }}>
              Welcome Back
            </h1>
            <p style={{ color: '#666', marginBottom: '24px', textAlign: 'center' }}>
              Enter your email to receive a login code
            </p>

            <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '0.9rem' }}>Email Address</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'border-color 0.2s',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'black'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
                />
              </div>

              {error && <p style={{ color: '#dc2626', fontSize: '0.875rem' }}>{error}</p>}

              <Button type="submit" variant="primary" fullWidth disabled={loading}>
                {loading ? 'Sending Code...' : 'Continue'}
              </Button>
            </form>
          </>
        ) : (
          <>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '8px', textAlign: 'center' }}>
              Check your inbox
            </h1>
            <p style={{ color: '#666', marginBottom: '24px', textAlign: 'center' }}>
              We sent a 6-digit code to <strong>{email}</strong>
            </p>

            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '0.9rem' }}>Enter OTP Code</label>
                <input
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.trim())}
                  required
                  maxLength={6}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                    fontSize: '1.25rem',
                    textAlign: 'center',
                    letterSpacing: '0.5em',
                    fontWeight: '600'
                  }}
                />
              </div>

              {error && <p style={{ color: '#dc2626', fontSize: '0.875rem', textAlign: 'center' }}>{error}</p>}

              <Button type="submit" variant="primary" fullWidth disabled={loading}>
                {loading ? 'Verifying...' : 'Login'}
              </Button>

              <button 
                type="button" 
                onClick={() => setStep('email')}
                style={{ 
                  background: 'none', border: 'none', color: '#666', 
                  textDecoration: 'underline', cursor: 'pointer', fontSize: '0.875rem'
                }}
              >
                Change Email
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
