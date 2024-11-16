import React from 'react';
import { useNavigate } from 'react-router-dom';

import Button from 'react-bootstrap/Button';

import './authenticated.css';

export function Authenticated(props) {
  const navigate = useNavigate();

  function logout() {
    const email = localStorage.getItem('email');
    console.log(email);
    fetch(`/api/auth/logout`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: `{"email":"${email}"}`
    })
      .catch(() => {
        // Logout failed. Assuming offline
      })
      .finally(() => {
        localStorage.removeItem('userName');
        localStorage.removeItem('email')
        props.onLogout();
      });
  }

  return (
    <div>
      <div className='playerName'>{props.userName}</div>
      <Button variant='primary' onClick={() => navigate('/newTournament')}>
        Tournaments
      </Button>
      <Button variant='secondary' onClick={() => logout()}>
        Logout
      </Button>
    </div>
  );
}