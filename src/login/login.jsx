import React from 'react';
import { Link } from "react-router-dom"
import './login.css'

export function Login() {
  return (
    <main className="login-main">
        <div >
            <h1 className='h1-title'>GolfLeaderboard</h1>
            <form className='login-form' method="get" action="newTournament.html">
                <div className="input-group mb-3">
                    <input type="text" placeholder="Firstname Lastname" className="form-control"/>
                </div>
                <div className="input-group mb-3">
                    <input type="text" placeholder="email@example.com" className="form-control"/>
                </div>
                <div className="input-group mb-3">
                    <input type="password" placeholder="password" className="form-control"/>
                </div>
                <div>
                    <Link to="newTournament">
                        <button className="btn btn-primary" type="submit">Login</button>
                    </Link>
                    <Link to="newTournament">
                        <button className="btn btn-secondary" type="submit">Sign Up</button>
                    </Link>
                </div>
            </form>
        </div> 
    </main>
  );
}