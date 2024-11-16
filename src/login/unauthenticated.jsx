import React from 'react';

import Button from 'react-bootstrap/Button';
import { MessageDialog } from './messageDialog';

export function Unauthenticated(props) {
  const [userName, setUserName] = React.useState(props.userName);
  const [email, setEmail] = React.useState(props.email);
  const [password, setPassword] = React.useState('');
  const [displayError, setDisplayError] = React.useState(null);

  async function loginUser() {

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ name: userName, email: email, password: password }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    if (response?.status === 200) {
      localStorage.setItem('userName', userName);
      localStorage.setItem('email', email);
      props.onLogin(userName, email);
    } else {
      const body = await response.json();
      setDisplayError(`⚠ Error: ${body.msg}`);
    }
  }

  async function createUser() {
    const response = await fetch('/api/auth/create', {
      method: 'POST',
      body: JSON.stringify({ name: userName, email: email, password: password }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    if (response?.status === 200) {
      localStorage.setItem('userName', userName);
      localStorage.setItem('email', email);
      props.onLogin(userName, email);
    } else {
      const body = await response.json();
      setDisplayError(`⚠ Error: ${body.msg}`);
    }
  }

  return (
    <>
      <div>
        <div className="input-group mb-3">
            <input type="text" placeholder="Firstname Lastname" className="form-control" value={userName} onChange={(e) => setUserName(e.target.value)}/>
        </div>
        <div className="input-group mb-3">
            <input type="text" placeholder="email@example.com" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)}/>
        </div>
        <div className="input-group mb-3">
            <input type="password" placeholder="password" className="form-control"  onChange={(e) => setPassword(e.target.value)}/>
        </div>
        <Button variant='primary' onClick={() => loginUser()} disabled={!userName || !email || !password}>
          Login
        </Button>
        <Button variant='secondary' onClick={() => createUser()} disabled={!userName || !email || !password}>
          Create
        </Button>
      </div>

      <MessageDialog message={displayError} onHide={() => setDisplayError(null)} />
    </>
  );
}