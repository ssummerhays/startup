import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

export default function App() {
  return (
    <div className='body'>
    
    <header className="container-fluid">
      <nav className="navbar bg-dark fixed-top navbar-dark">
        <a className="navbar-brand" href="#">GolfLeaderboard<sup>&reg;</sup></a>
        <menu className="navbar-nav">
          <li className="nav-item"><a class="nav-link active" href="index.html">Home</a></li>
          <li className="nav-item"><a class="nav-link" href="newTournament.html">New Tournament</a></li>
          <li className="nav-item"><a class="nav-link" href="leaderboard.html">Leaderboard</a></li>
          <li className="nav-item"><a class="nav-link" href="addScore.html">Add Score</a></li>
        </menu>
      </nav>
    </header>

    <main className="container-fluid text-center">
      App components go here
    </main>

    <footer className="bg-dark">
      <div className="container-fluid">
        <span className="text-white-50">Spencer Summerhays</span>
        <a className="text-white-50" href="https://github.com/ssummerhays/startup">GitHub</a>
      </div>
    </footer>

  </div>
  );
}