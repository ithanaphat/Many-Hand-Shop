import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="left">
          <button className="brand-button" aria-label="Home">
            <img src="/mhs.png" alt="logo" className="logo" />
            <span className="brand">Many Hand Shop</span>
          </button>
        </div>

        <div className="center">
          <input
            className="search"
            type="search"
            placeholder="Search..."
            aria-label="Search"
          />
        </div>

        <div className="right auth-buttons">
          <button className="btn signin">sign in</button>
          <button className="btn register">register</button>
        </div>
      </header>
    </div>
  );
}

export default App;
