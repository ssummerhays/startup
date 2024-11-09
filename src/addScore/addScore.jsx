import React from 'react';
import { Link } from 'react-router-dom';
import { RecentScores } from './recentScores';
import './addScore.css';

export function AddScore() {
  return (
    <main className='addScore-main'>
      <div>
        <h2>Add a Score</h2>
        <form method="get" action="leaderboard.html">
          <div>
            <label for="hole-number">Hole#</label>
            <input className="input-group mb-3" type="number" id="hole-number" min="1" max="18"/>
          </div>
          <div>
            <label for="score">Score to Par</label>
            <input type="number" id="score" className="input-group mb-3" min="-4" max="10"/>
          </div>
          <Link to="/leaderboard"><button className="btn btn-primary" type="submit">Submit</button></Link>
          
        </form>
      </div>
      <div>
        <h2>Recent Scores</h2>
        <RecentScores />
      </div>

    </main>
  );
}