import Navbar from '../components/Navbar'

export default function SignInPage() {
  return (
    <div className="signin-page">
      <Navbar />
      <main className="signin-main">
        <section className="signin-card">
          <h2>Sign In</h2>
          <form className="signin-form" action="/home" method="get">
            <input type="text" placeholder="Username or Email" required />
            <input type="password" placeholder="Password" required />
            <button type="submit">Sign In</button>
          </form>
          <p className="signin-footer">
            Don&apos;t have an account? <a href="/register">Register</a>
          </p>
        </section>
      </main>
    </div>
  )
}
