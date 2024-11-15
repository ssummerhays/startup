import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { MessageDialog } from '/src/login/messageDialog.jsx'
import './newTournament.css'

export function NewTournament(props) {
  const [createName, setCreateName] = React.useState("");
  const [joinName, setJoinName] = React.useState(props.recentTournamentName);
  const [maxPlayers, setMaxPlayers] = React.useState("");
  const [golfCourseName, setGolfCourseName] = React.useState("");
  const [displayError, setDisplayError] = React.useState(null);

  const navigate = useNavigate();

  async function createNewTournament() {
    const tournament = {
      tournamentName: createName,
      courseName: golfCourseName,
      maxPlayers: maxPlayers,
    }
    const response = await fetch('/api/tournaments/create', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(tournament)
    });

    if (response?.status === 200) {
      localStorage.setItem('tournamentName', createName);
      navigate('/leaderboard');
    } else {
      const body = await response.json();
      setDisplayError(`Error: ${body.msg}`);
    }
    
  }
  async function joinTournament() {
    const response = await fetch('/api/tournaments', {
      method: 'GET',
      headers: { 'content-type': 'application/json' }
    });

    const body = await response.json();
    
    if (response?.status === 200) {
      const tournament = body[joinName];
      if (tournament) {
        localStorage.setItem('tournamentName', joinName);
        props.onNewTournament(tournament.tournamentName);
        navigate('/leaderboard');
      } else {
        setDisplayError(`Error: no tournament with the name ${joinName} exists`);
      }
    } else {
      setDisplayError(`Error: ${body.msg}`);
    }
  }

  return (
    <>
      <main className='newTournament-main'>
          <div className="new-tournament">
              <h2>Create New Tournament</h2>
              <div className="input-group mb-3">
                  <input type="text" placeholder="Tournament Name" className="form-control" value={createName} 
                  onChange={(e) => setCreateName(e.target.value)}/>
              </div>
              <div className="input-group mb-3">
                  <input type="number" placeholder="Max Players" className="form-control" min="1" value={maxPlayers} 
                  onChange={(e) => setMaxPlayers(e.target.value)}/>
              </div>
              <div className="input-group">
                  <input type="text" placeholder="Golf Course Name" className="form-control" value={golfCourseName} 
                  onChange={(e) => setGolfCourseName(e.target.value)}/>
              </div>
              <Button variant="primary" onClick={() => createNewTournament()} disabled={!createName || !maxPlayers || !golfCourseName}>Create New Tournament</Button>
          </div>
          <div className="join-tournament">
              <h2>Join Tournament</h2>
              <div className="input-group">
                  <input className="form-control" type="text" placeholder="Tournament Name" value={joinName} 
                  onChange={(e) => setJoinName(e.target.value)}/>
              </div>
              <Button variant='primary' onClick={() => joinTournament()} disabled={!joinName}>Join Tournament</Button>
          </div>
      </main>
      <MessageDialog message={displayError} onHide={() => setDisplayError(null)}/>
    </>
    
  );
}