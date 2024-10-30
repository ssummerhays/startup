import React from 'react';
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
            <label for="score">Score</label>
            <input type="number" id="score" className="input-group mb-3" min="1" max="99"/>
          </div>
          <button className="btn btn-primary" type="submit">Submit</button>
        </form>
      </div>
      <div>
        <h2>Recent Scores</h2>
        <div><span className="player-name">John</span> birdied 15</div>
        <div><span className="player-name">James</span> parred 16</div>
        <div><span className="player-name">Matthew</span> bogeyed 16</div>
        <div><span className="player-name">Eli</span> birdied 15</div>
      </div>

    </main>
  );
}