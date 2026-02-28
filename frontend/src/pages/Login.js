import React from 'react';
import Header from '../components/Header'; // ดึง Header มาใช้

function Login() {
  return (
    <div className="App auth-page" style={{ backgroundColor: 'white', minHeight: '100vh' }}>
      <Header onSignIn={() => {}} onRegister={() => {}} />
      <div className="form-container">
        <h1 className="form-title" style={{ color: '#000' }}>Sign In</h1>
        <form>
          <label>
            Username or Email
            <input type="text" name="identifier" required />
          </label>
          <label>
            Password
            <input type="password" name="password" required />
          </label>
          <button type="submit" className="btn signin">Login</button>
        </form>
        <p className="alt-action">
          Don’t have an account?{' '}
          <button className="link-button" onClick={() => window.location.href = '/register'}>
            SIGN UP
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;