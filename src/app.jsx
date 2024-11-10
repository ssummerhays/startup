import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import { BrowserRouter, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { Login } from './login/login';
import { NewTournament } from './newTournament/newTournament';
import { Leaderboard } from './leaderboard/leaderboard';
import { AddScore } from './addScore/addScore';
import { AuthState } from './login/authState';
import { ScoreEvent, ScoreNotifier } from './addScore/scoreNotifier';

export default function App() {
  const [userName, setUserName] = React.useState(localStorage.getItem('userName') || '');
  const [email, setEmail] = React.useState(localStorage.getItem('email') || '');
  const currentAuthState = userName ? AuthState.Authenticated : AuthState.Unauthenticated;
  const [authState, setAuthState] = React.useState(currentAuthState);
  const [tournamentName, setTournamentName] = React.useState(localStorage.getItem('tournamentName') || '');
  const [maxPlayers, setMaxPlayers] = React.useState(parseInt(localStorage.getItem('maxPlayers'), 10) || '');
  const [holeNumber, setHoleNumber] = React.useState(parseInt(localStorage.getItem('holeNumber'), 10) || 1);
  const [totalScore, setTotalScore] = React.useState(parseInt(localStorage.getItem('totalScore'), 10) || 0);

  const [scores, setScores] = React.useState([]);
  const [parBreakers, setParBreakers] = React.useState([]);

  React.useEffect(() => {
    const scoresText = localStorage.getItem('scores');
    if (scoresText) {
      setScores(JSON.parse(scoresText));
    }
  }, []);

  React.useEffect(() => {
    const parBreakersText = localStorage.getItem('parBreakers');
    if (parBreakersText) {
      try {
        setParBreakers(JSON.parse(parBreakersText));
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  return (
    <BrowserRouter>
        <div className='body'>
            <header className="container-fluid">
                <nav className="navbar bg-dark fixed-top navbar-dark">
                    <a className="navbar-brand" href="#">GolfLeaderboard<sup>&reg;</sup></a>
                    <menu className="navbar-nav">
                        <li className="nav-item"><NavLink className="nav-link" to=''>Login</NavLink></li>
                        {authState === AuthState.Authenticated && (
                            <li className="nav-item"><NavLink className="nav-link" to="newTournament">New Tournament</NavLink></li>
                        )}
                        {authState === AuthState.Authenticated && (
                            <li className="nav-item"><NavLink className="nav-link" to="leaderboard">Leaderboard</NavLink></li>
                        )}
                        {authState === AuthState.Authenticated && (
                            <li className="nav-item"><NavLink className="nav-link" to="addScore">Add Score</NavLink></li>
                        )}
                    </menu>
                </nav>
            </header>

            <Routes>
                <Route
                    path='/'
                    element={
                    <Login
                        userName={userName}
                        email={email}
                        authState={authState}
                        onAuthChange={(userName, email, authState) => {
                        setAuthState(authState);
                        setUserName(userName);
                        setEmail(email);
                        }}
                    />
                    }
                    exact
                />
                <Route 
                    path='/newTournament' 
                    element={
                    <NewTournament 
                        tournamentName={tournamentName}
                        maxPlayers={maxPlayers}
                        onNewTournament={(tournamentName, maxPlayers) => {
                            setTournamentName(tournamentName);
                            setMaxPlayers(maxPlayers);
                        }}
                    />
                    } 
                />
                <Route 
                    path='/leaderboard' 
                    element={
                    <Leaderboard 
                        userName={userName}
                        tournamentName={tournamentName}
                        maxPlayers={maxPlayers}
                        scores={scores}
                        parBreakers={parBreakers}
                    />
                    } 
                />
                <Route 
                    path='/addScore' 
                    element={
                    <AddScore
                        userName={userName}
                        totalScore={totalScore}
                        holeNumber={holeNumber}
                        onAddNewScore={(holeNumber, scoreToPar) => {
                            setHoleNumber(holeNumber);
                            const newTotalScore = scoreToPar + totalScore;
                            localStorage.setItem('totalScore', newTotalScore);
                            setTotalScore(newTotalScore);

                            if (holeNumber === 18) {
                                ScoreNotifier.broadcastEvent(userName, ScoreEvent.roundEnd, holeNumber, scoreToPar, newTotalScore, scores, true, parBreakers);
                            } else {
                                ScoreNotifier.broadcastEvent(userName, ScoreEvent.holeEnd, holeNumber, scoreToPar, newTotalScore, scores, true, parBreakers);
                            }
                        }}
                        onClearTotalScore={() => {
                            localStorage.setItem('totalScore', 0);
                            setTotalScore(0);
                        }}
                    />
                    } 
                />
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