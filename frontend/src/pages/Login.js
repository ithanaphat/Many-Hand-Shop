import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';

function Login({ onLoginSuccess }) {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const identifier = formData.get('identifier');
    const password = formData.get('password');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: identifier, password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        alert(data.message || 'Sign in failed');
        return;
      }
    } catch (error) {
      alert('Cannot connect to server');
      return;
    }

    if (onLoginSuccess) {
      onLoginSuccess();
    }
    navigate('/home-user');
  };

  return (
    <div className="App auth-page">
      <Header onSignIn={() => {}} onRegister={() => navigate('/register')} />
      <main className="auth-content">
        <section className="auth-card">
          <h1 className="form-title">Sign In</h1>
          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Username or Email
              <input type="text" name="identifier" required />
            </label>
            <label>
              Password
              <input type="password" name="password" required />
            </label>
            <button type="submit" className="auth-submit">Login</button>
          </form>
          <p className="alt-action">
            Don't have an account?{' '}
            <button type="button" className="link-button" onClick={() => navigate('/register')}>
              REGISTER
            </button>
          </p>
        </section>
      </main>
    </div>
  );
}

export default Login;
