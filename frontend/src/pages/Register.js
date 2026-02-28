import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

function Register() {
  const navigate = useNavigate();

  return (
    <div className="App auth-page">
      <Header onSignIn={() => navigate('/login')} onRegister={() => navigate('/register')} />
      <main className="auth-content">
        <section className="auth-card">
        <h1 className="form-title">Register</h1>
        <form className="auth-form">
          <label>
            Username
            <input type="text" name="username" required />
          </label>
          <label>
            Name
            <input type="text" name="name" required />
          </label>
          <label>
            Email
            <input type="email" name="email" required />
          </label>
          <label>
            Password
            <input type="password" name="password" required />
          </label>
          <label>
            Confirm Password
            <input type="password" name="confirmPassword" required />
          </label>
          <button type="submit" className="auth-submit">Create Account</button>
        </form>
        <p className="alt-action">
          Already have an account?{' '}
          <button type="button" className="link-button" onClick={() => navigate('/login')}>
            SIGN IN
          </button>
        </p>
        </section>
      </main>
    </div>
  );
}

export default Register;