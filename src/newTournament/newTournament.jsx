import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import './newTournament.css'

export function NewTournament(props) {
  const [tournamentName, setTournamentName] = React.useState(props.tournamentName);
  const [maxPlayers, setMaxPlayers] = React.useState(props.maxPlayers);
  const [golfCourseName, setGolfCourseName] = React.useState(props.courseName);

  const navigate = useNavigate();

  async function createNewTournament() {
    localStorage.setItem('tournamentName', tournamentName);
    localStorage.setItem('maxPlayers', maxPlayers);
    localStorage.setItem('courseName', golfCourseName);
    props.onNewTournament(tournamentName, maxPlayers, golfCourseName);
    navigate('/leaderboard')
  }
  async function joinTournament() {
    localStorage.setItem('tournamentName', tournamentName);
    props.onNewTournament(tournamentName, maxPlayers, null);
    navigate('/leaderboard')
  }

  return (
    <main className='newTournament-main'>
        <div className="new-tournament">
            <h2>Create New Tournament</h2>
            <div className="input-group mb-3">
                <input type="text" placeholder="Tournament Name" className="form-control" value={tournamentName} onChange={(e) => setTournamentName(e.target.value)}/>
            </div>
            <div className="input-group mb-3">
                <input type="number" placeholder="Max Players" className="form-control" min="1" value={maxPlayers} onChange={(e) => setMaxPlayers(e.target.value)}/>
            </div>
            <div className="input-group">
                <input type="text" placeholder="Golf Course Name" className="form-control" value={golfCourseName} onChange={(e) => setGolfCourseName(e.target.value)}/>
            </div>
            <Button variant="primary" onClick={() => createNewTournament()} disabled={!tournamentName || !maxPlayers || !golfCourseName}>Create New Tournament</Button>
        </div>
        <div className="join-tournament">
            <h2>Join Tournament</h2>
            <div className="input-group">
                <input className="form-control" type="text" placeholder="Tournament Name" value={tournamentName} onChange={(e) => setTournamentName(e.target.value)}/>
            </div>
            <Button variant='primary' onClick={() => joinTournament()} disabled={!tournamentName || !maxPlayers || !golfCourseName}>Join Tournament</Button>
        </div>
    </main>
  );
}