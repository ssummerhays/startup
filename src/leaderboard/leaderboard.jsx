import React from 'react';
import { Link } from 'react-router-dom';
import './leaderboard.css'

export function Leaderboard() {
  return (
    <main className='leaderboard-main'>
      <div className="player-name">
        <div>
          <span className="player-title">Player:</span><span> John Smith</span>
        </div>
        <Link to="/addScore"><button className="btn btn-primary btn-sm">Add Score</button></Link>
      </div>
      
      <h1>The Masters: <span>4 Players</span></h1>
      

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
              <tbody>
              <tr>
                  <td>1</td>
                  <td>John Smith</td>
                  <td>-3</td>
                  <td>15</td>
              </tr>
              <tr>
                  <td>2</td>
                  <td>James Johnson</td>
                  <td>-1</td>
                  <td>16</td>
              </tr>
              <tr>
                  <td>3</td>
                  <td>Matthew Jones</td>
                  <td>E</td>
                  <td>16</td>
              </tr>
              <tr>
                  <td>4</td>
                  <td>Eli Mitchell</td>
                  <td>+3</td>
                  <td>15</td>
              </tr>
              </tbody>
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
              <tbody>
                <tr>
                    <td>1</td>
                    <td>John Smith</td>
                    <td>4</td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>Matthew Jones</td>
                    <td>2</td>
                </tr>
                <tr>
                    <td>3</td>
                    <td>James Johnson</td>
                    <td>1</td>
                </tr>
                <tr>
                    <td>4</td>
                    <td>Eli Mitchell</td>
                    <td>0</td>
                </tr>
              </tbody>
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