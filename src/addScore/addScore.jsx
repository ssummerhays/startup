import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RecentScores } from './recentScores';
import './addScore.css';
import { Button } from 'react-bootstrap';
import { MessageDialog } from '../login/messageDialog';

export function AddScore(props) {
  const [holeNumber, setHoleNumber] = React.useState(1);
  const [scoreToPar, setScoreToPar] = React.useState(0);
  const [displayError, setDisplayError] = React.useState(null);
  const [userName, setUserName] = React.useState("");
  const [user, setUser] = React.useState({});

  const navigate = useNavigate();

  React.useEffect(() => {
    async function getUserData() {
      const response = await fetch('/api/users', {
        method: 'GET',
        headers: { 'content-type': 'application/json' }
      });

      const body = await response.json();
      
      let user = null;
      for (let i = 0; i < body.length; i++) {
        let current = body[i];
        if (current.email == props.email) {
          user = current;
        }
      }
      
      setUserName(user.userName);
      setHoleNumber(parseInt(user.currentHole, 10) + 1);
      setUser(user);
    }

    getUserData();
  }, [userName] );


  async function addNewScore(holeNumber, scoreToPar) {
    const body = {
      email: props.email,
      recentScore: scoreToPar,
      hole: holeNumber
    }
    const response = await fetch('/api/tournaments/score', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (response.status === 200) {
      props.onAddNewScore(holeNumber, scoreToPar);
      if (holeNumber !== 18) {
        setHoleNumber(holeNumber + 1);
      }
    } else {
      const body = await response.json();
      setDisplayError(`Error: ${body.msg}`);
    }
  }

  return (
    <>
      <main className='addScore-main'>
        <div className='add-new-scores'>
          <h2>Add a Score</h2>
            <div>
              <label htmlFor="hole-number">Hole#</label>
              <input 
                className="input-group mb-3" 
                type="number" id="hole-number" 
                min="1" 
                max="18" 
                value={holeNumber} 
                onChange={(e) => setHoleNumber(parseInt(e.target.value), 10)}
              />
            </div>
            <div>
              <label htmlFor="score">Score to Par</label>
              <input 
                type="number" 
                id="score" 
                className="input-group mb-3" 
                min="-4" max="10" 
                value={scoreToPar} 
                onChange={(e) => setScoreToPar(parseInt(e.target.value), 10)}
              />
            </div>
            <div className='buttons'>
              <div>
                <Button variant='primary' onClick={() => addNewScore(holeNumber, scoreToPar)} disabled={holeNumber < 1 || holeNumber > 18 || user.currentTournament !== props.tournamentName}>Submit</Button>
              <Button variant='secondary' onClick={() => navigate('/leaderboard')}>Return</Button>
              </div>
            </div>
        </div>
        <div>
          <h2>Recent Scores</h2>
          <RecentScores />
        </div>

      </main>
      <MessageDialog message={displayError} onHide={() => setDisplayError(null)}/>
    </>
  );
}