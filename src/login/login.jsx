import React from 'react';

import { Unauthenticated } from './unauthenticated';
import { Authenticated } from './authenticated';
import { AuthState } from './authState';

import './login.css'

export function Login({ userName, email, authState, onAuthChange }) {
  return (
    <main className='login-main'>
      <div>
        {authState !== AuthState.Unknown && <h1>Golf Leaderboard</h1>}
        {authState === AuthState.Authenticated && (
          <Authenticated userName={userName} email={email} onLogout={() => onAuthChange(userName, email, AuthState.Unauthenticated)} />
        )}
        {authState === AuthState.Unauthenticated && (
          <Unauthenticated
            userName={userName}
            email={email}
            onLogin={(loginUserName, loginEmail) => {
              onAuthChange(loginUserName, loginEmail, AuthState.Authenticated);
            }}
          />
        )}
      </div>
    </main>
  );
}