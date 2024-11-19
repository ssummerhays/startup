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
  const [city, setCity] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [displayError, setDisplayError] = React.useState(null);

  const navigate = useNavigate();

  async function createNewTournament() {
    const body = {
      tournamentName: createName,
      courseName: golfCourseName,
      city: city,
      country: country,
      maxPlayers: maxPlayers,
      email: props.email
    }
    const response = await fetch('/api/tournaments/create', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (response?.status === 200) {
      localStorage.setItem('tournamentName', createName);
      props.onNewTournament(createName);
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
      let tournament = null;
      for (let i = 0; i < body.length; i++) {
        let current = body[i];
        if (current.tournamentName == joinName) {
          tournament = current;
        }
      }
      
      if (tournament !== null) {

        const bodyData = {
          tournamentName: joinName,
          email: props.email,
        };

        const newResponse = await fetch('/api/tournaments/player', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(bodyData)
        });
        if (newResponse?.status === 200) {
          localStorage.setItem('tournamentName', joinName);
          props.onNewTournament(tournament.tournamentName);
          navigate('/leaderboard');
        } else {
          console.log(newResponse);
          const body = await newResponse.json();
          setDisplayError(body.msg);
        }
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
              <div className="input-group mb-3">
                  <input type="text" placeholder="Golf Course Name" className="form-control" value={golfCourseName} 
                  onChange={(e) => setGolfCourseName(e.target.value)}/>
              </div>
              <div className='city-country'>
                <div className="input-group city">
                    <input type="text" placeholder="City" className="form-control" value={city} 
                    onChange={(e) => setCity(e.target.value)}/>
                </div>
                <div className="input-group country">
                    <input type="text" placeholder="Country" className="form-control" value={country} 
                    onChange={(e) => setCountry(e.target.value)}/>
                </div>
              </div>
              
              <Button variant="primary" onClick={() => createNewTournament()} 
              disabled={!createName || !maxPlayers || !golfCourseName || !city}>Create New Tournament</Button>
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