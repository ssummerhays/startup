import React from 'react';
import { Link } from 'react-router-dom';
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
            <Link to="/leaderboard">
                <button className="btn btn-primary" type="submit">Create New Tournament</button>
            </Link>
            </form>
        </div>
        <div className="join-tournament">
            <h2>Join Tournament</h2>
            <form method="get" action="leaderboard.html">
            <div className="input-group">
                <input className="form-control" type="text" placeholder="Tournament ID" />
            </div>
            <Link to="/leaderboard">
                <button className="btn btn-primary" type="submit">Join Tournament</button>
            </Link>
            
            </form>
        </div>
    </main>
  );
}