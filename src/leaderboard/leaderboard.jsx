import React from 'react';
import { Link } from 'react-router-dom';
import './leaderboard.css'

export function Leaderboard({userName, tournamentName, maxPlayers, scores, parBreakers }) {

  
  let scoreRows = [];
  let rawScoreData = [];
  let users = [];
  if (scores.length) {
    scores.sort((a, b) => b.hole - a.hole);
    for (const [i, score] of scores.entries()) {
      let thru = score.hole;
      if (score.hole === 18) {
        thru = 'F';
      }
      if (!users.includes(score.name)) {
        const data = {
          dataName: score.name,
          dataScore: score.totalScore,
          dataThru: thru
        }
        rawScoreData.push(data);
        users.push(score.name);
      }
    }
    rawScoreData.sort((a, b) => {
      const scoreA = parseInt(a.dataScore, 10);
      const scoreB = parseInt(b.dataScore, 10);
      return scoreA - scoreB;
    });
    for (const [i, data] of rawScoreData.entries()) {
      scoreRows.push(
        <tr key={i + 1}>
          <td>{i + 1}</td>
          <td>{data.dataName}</td>
          <td>{data.dataScore}</td>
          <td>{data.dataThru}</td>
        </tr>
      );
    }

  } else {
    scoreRows.push(
      <tr key='0'>
        <td colSpan='4'>No Score Data Available</td>
      </tr>
    );
  }

  const parBreakerRows = [];
  if (parBreakers.length) {
    for (const [i, parBreaker] of parBreakers.entries()) {
      scoreRows.push(
        <tr key={i+1}>
          <td>{i+1}</td>
          <td>{parBreaker.name}</td>
          <td>{parBreaker.score}</td>
        </tr>
      );
    }
  } else {
    parBreakerRows.push(
      <tr key='0'>
        <td colSpan='3'>No Par Breakers Yet</td>
      </tr>
    );
  }

  return (
    <main className='leaderboard-main'>
      <div className="player-name">
        <div>
          <span className="player-title">Player:</span><span> {userName}</span>
        </div>
        <Link to="/addScore"><button className="btn btn-primary btn-sm">Add Score</button></Link>
      </div>
      
      <h1>{tournamentName}: <span>{maxPlayers} Player Max</span></h1>
      

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
          <h5>At <span>GolfCoursePlaceholder</span></h5>    
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
                        <td>83°</td>
                        <td><span>☀️</span>Sunny</td>
                    </tr>
                </tbody>
            </table>
          </div>
        </div>  
      </div>
      
    </main>
  );
}