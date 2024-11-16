import React from 'react';
import { Link } from 'react-router-dom';
import './leaderboard.css'

export function Leaderboard(props) {
  const [courseName, setCourseName] = React.useState("");
  const [city, setCity] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [players, setPlayers] = React.useState([]);
  const [scores, setScores] = React.useState([]);
  const [parBreakers, setParBreakers] = React.useState([])
  const [temp, setTemp] = React.useState('Loading...');
  const [weather, setWeather] = React.useState('Loading...');
  

  React.useEffect(() => {
    async function getTournamentData() {
      const response = await fetch('/api/tournaments', {
        method: 'GET',
        headers: { 'content-type': 'application/json' }
      });

      const body = await response.json();
      const tournament = body[props.tournamentName];
      setCourseName(tournament.courseName);
      setCity(tournament.city);
      setCountry(tournament.country);
      setPlayers(tournament.players);
      setScores(tournament.scores);
      setParBreakers(tournament.parBreakers);
    }

    getTournamentData();

    async function getWeatherData() {
      fetch(`https://wttr.in/${city}?format=j1`)
        .then((response) => response.json())
        .then((data) => {
          let current = data.current_condition[0];
          setTemp(current.temp_F);
          setWeather(current.weatherDesc[0].value);
        })
        .catch();
    }
    
    if (temp === 'Loading...') {
      getWeatherData();
    }

  }, [props.tournamentName, players, scores, parBreakers] );

  let scoreRows = [];
  for (let i = 0; i < scores.length; i++) {
    let score = scores[i];
    let printedScore = score.total;
    if (score.total === 0) {
      printedScore = 'E';
    } else if (score.total > 0) {
      printedScore = `+${score.total}`
    }
    scoreRows.push(
        <tr key={i + 1}>
          <td>{i + 1}</td>
          <td>{score.name}</td>
          <td>{printedScore}</td>
          <td>{score.thru}</td>
        </tr>
      );
  }
  if (scores.length === 0) {
    scoreRows.push(
      <tr key='0'>
        <td colSpan='4'>No Score Data Available</td>
      </tr>
    );
  }

  let parBreakerRows = [];
  for (let i = 0; i < parBreakers.length; i++) {
    let parBreaker = parBreakers[i];
    parBreakerRows.push(
        <tr key={i + 1}>
          <td>{i + 1}</td>
          <td>{parBreaker.name}</td>
          <td>{parBreaker.parBreakers}</td>
        </tr>
      );
  }
  if (parBreakers.length === 0) {
    parBreakerRows.push(
      <tr key='0'>
        <td colSpan='3'>No Par Breakers Yet</td>
      </tr>
    );
  }

  const playersStr = (players.length === 1)? 'player' : 'players'

  return (
    <main className='leaderboard-main'>
      <div className="player-name">
        <div>
          <span className="player-title">Player:</span><span> {props.userName}</span>
        </div>
        <Link to="/addScore"><button className="btn btn-primary btn-sm">Add Score</button></Link>
      </div>
      
      <h1>{props.tournamentName}<span>: {players.length} {playersStr}</span></h1>
      

      <div className="leaderboards">
        <div className="main-leaderboard">
          <table className="table table-dark table-hover table-striped-columns">
              <thead>
              <tr>
                  <th className="pos">Pos</th>
                  <th>Name</th>
                  <th className="score">Score</th>
                  <th className="thru">Thru</th>
              </tr>
              </thead>
              <tbody>{scoreRows}</tbody>
          </table>
        </div>
      
        <div className="par-breaker-leaderboard">
          <table className="table table-dark table-sm table-hover table-striped-columns"> 
              <thead>
                <tr>
                    <th className="place">#</th>
                    <th>Name</th>
                    <th className="par-breakers">Par Breakers</th>
                    
                </tr>
              </thead>
              <tbody>{parBreakerRows}</tbody>
          </table>
        </div>
      </div>

      <div className="course-info">
          <h5>At <span>{courseName}</span> in <span>{city}, {country}</span></h5>    
        <div>
          <img src="golfCoursePlaceholder.png" />
          <div className="weather-box">
            <table className="table table-dark table-sm table-striped-columns">
                <thead>
                    <tr>
                        <th>Temperature</th>
                        <th>Forecast</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td> {temp}° </td>
                        <td> {weather} </td>
                    </tr>
                </tbody>
            </table>
          </div>
        </div>  
      </div>
      
    </main>
  );
}