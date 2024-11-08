import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { NewTournament } from './newTournament/newTournament';
import { Leaderboard } from './leaderboard/leaderboard';
import { AddScore } from './addScore/addScore';

export default function App() {
  return (
    <BrowserRouter>
        <div className='body'>
            <header className="container-fluid">
                <nav className="navbar bg-dark fixed-top navbar-dark">
                    <a className="navbar-brand" href="#">GolfLeaderboard<sup>&reg;</sup></a>
                    <menu className="navbar-nav">
                    <li className="nav-item"><NavLink className="nav-link" to=''>Login</NavLink></li>
                    <li className="nav-item"><NavLink className="nav-link" to="newTournament">New Tournament</NavLink></li>
                    <li className="nav-item"><NavLink className="nav-link" to="leaderboard">Leaderboard</NavLink></li>
                    <li className="nav-item"><NavLink className="nav-link" to="addScore">Add Score</NavLink></li>
                    </menu>
                </nav>
            </header>

            <Routes>
                <Route path='/' element={<Login />} exact />
                <Route path='/newTournament' element={<NewTournament />} />
                <Route path='/leaderboard' element={<Leaderboard />} />
                <Route path='/addScore' element={<AddScore />} />
                <Route path='*' element={<NotFound />} />
            </Routes>

            <footer className="bg-dark">
                <div className="container-fluid">
                    <span className="text-white-50">Spencer Summerhays</span>
                    <a className="text-white-50" href="https://github.com/ssummerhays/startup">GitHub</a>
                </div>
            </footer>
        </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return <main className='container-fluid text-center'>404: Return to sender. Address unknown.</main>;
}