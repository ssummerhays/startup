import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RecentScores } from './recentScores';
import './addScore.css';
import { Button, Modal } from 'react-bootstrap';

export function AddScore(props) {
  const [holeNumber, setHoleNumber] = React.useState(props.holeNumber);
  const [scoreToPar, setScoreToPar] = React.useState(0);
  const [showModal, setShowModal] = React.useState(false);

  const navigate = useNavigate();

  function addNewScore(holeNumber, scoreToPar) {
    props.onAddNewScore(holeNumber, scoreToPar);
    if (holeNumber !== 18) {
      setHoleNumber(holeNumber + 1);
    }
  }

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  }

  function clearTotalScore() {
    props.onClearTotalScore();
    setShowModal(false);
    setHoleNumber(1);
    setScoreToPar(0);
  }

  return (
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
              <Button variant='primary' onClick={() => addNewScore(holeNumber, scoreToPar)} disabled={holeNumber < 1 || holeNumber > 18}>Submit</Button>
            <Button variant='secondary' onClick={() => navigate('/leaderboard')}>Return</Button>
            </div>
            <Button variant='danger' onClick={handleOpenModal}>Clear Total Score</Button>
          </div>
      </div>
      <div>
        <h2>Recent Scores</h2>
        <RecentScores />
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Clear Total Score</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to clear your total score?</Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleCloseModal}>Cancel</Button>
          <Button variant='danger' onClick={clearTotalScore}>Clear Total Score</Button>
        </Modal.Footer>
      </Modal>

    </main>
  );
}