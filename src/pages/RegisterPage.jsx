import Navbar from '../components/Navbar'

export default function RegisterPage() {
  return (
    <div className="register-page">
      <Navbar />
      <main className="register-main">
        <section className="register-card">
          <h2>Register</h2>
          <form className="register-form" action="#" method="post">
            <input type="text" placeholder="Username" required />
            <input type="password" placeholder="Password" required />
            <input type="password" placeholder="Confirm Password" required />
            <input type="email" placeholder="Email" required />
            <button type="submit">Create Account</button>
          </form>
          <p className="register-footer">
            Already have an account? <a href="/signin">Sign In</a>
          </p>
        </section>
      </main>
    </div>
  )
}
