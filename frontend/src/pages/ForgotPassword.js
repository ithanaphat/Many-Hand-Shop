import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password, confirmPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || 'No account found with this email');
        return;
      }
      setDone(true);
    } catch {
      setError('Cannot connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App auth-page">
      <Header onSignIn={() => navigate('/login')} onRegister={() => navigate('/register')} />
      <main className="auth-content">
        <section className="auth-card">

          {done ? (
            <>
              <div style={{ fontSize: '48px', marginBottom: '16px', textAlign: 'center' }}>✅</div>
              <h1 className="form-title">Password Reset!</h1>
              <p style={{ textAlign: 'center', color: '#666', marginBottom: '24px', fontSize: '14px' }}>
                Your password has been updated. You can now sign in.
              </p>
              <button type="button" className="auth-submit" onClick={() => navigate('/login')}>
                Go to Sign In
              </button>
            </>
          ) : (
            <>
              <h1 className="form-title">Reset Password</h1>

              {error && (
                <p style={{ color: '#e53e3e', fontSize: '13px', marginBottom: '12px', textAlign: 'center' }}>
                  {error}
                </p>
              )}

              <form className="auth-form" onSubmit={handleSubmit}>
                <label>
                  Email Address
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                  />
                </label>
                <label>
                  New Password
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder="At least 8 characters"
                  />
                </label>
                <label>
                  Confirm New Password
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder="Repeat your new password"
                  />
                </label>
                <button type="submit" className="auth-submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Reset Password'}
                </button>
              </form>

              <p className="alt-action">
                Remember your password?{' '}
                <button type="button" className="link-button" onClick={() => navigate('/login')}>
                  SIGN IN
                </button>
              </p>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default ForgotPassword;

