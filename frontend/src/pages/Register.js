import React from 'react';
import Header from '../components/Header'; // ดึง Header มาใช้

function Register() {
  return (
    <div className="App auth-page" style={{ backgroundColor: 'white', minHeight: '100vh' }}>
      <Header onSignIn={() => {}} onRegister={() => {}} />
      <div className="form-container">
        <h1 className="form-title" style={{ color: '#000' }}>Register</h1>
        <form>
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
          <button type="submit" className="btn register">Create Account</button>
        </form>
      </div>
    </div>
  );
}

export default Register;