import React from 'react';
import './newTournament.css'

export function NewTournament() {
  return (
    <main className='newTournament-main'>
        <div className="new-tournament">
            <h2>Create New Tournament</h2>
            <form method="get" action="leaderboard.html">
            <div className="input-group mb-3">
                <input type="text" placeholder="Tournament Name" className="form-control"/>
            </div>
            <div className="input-group">
                <input type="number" placeholder="Max Players" className="form-control" min="1"/>
            </div>
            <button className="btn btn-primary" type="submit">Create New Tournament</button>
            </form>
        </div>
        <div className="join-tournament">
            <h2>Join Tournament</h2>
            <form method="get" action="leaderboard.html">
            <div className="input-group">
                <input className="form-control" type="text" placeholder="Tournament ID" />
            </div>
            <button className="btn btn-primary" type="submit">Join Tournament</button>
            </form>
        </div>
    </main>
  );
}