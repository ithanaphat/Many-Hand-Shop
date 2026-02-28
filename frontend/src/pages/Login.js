import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

function Login() {
  const navigate = useNavigate();

  return (
    <div className="App auth-page">
      <Header onSignIn={() => {}} onRegister={() => navigate('/register')} />
      <main className="auth-content">
        <section className="auth-card">
          <h1 className="form-title">Sign In</h1>
          <form className="auth-form">
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
