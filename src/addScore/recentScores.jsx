import React from 'react';

import { ScoreEvent, ScoreNotifier } from './scoreNotifier';

export function RecentScores() {
  const [events, setEvent] = React.useState([]);

  React.useEffect(() => {
    ScoreNotifier.addHandler(handleGameEvent);

    return () => {
      ScoreNotifier.removeHandler(handleGameEvent);
    };
  });

  function handleGameEvent(event) {
    let newEvents = [event, ...events];
    if (newEvents.length > 10) {
      newEvents = newEvents.slice(0, 10);
    }
    setEvent(newEvents);
  }

  function createMessageArray() {
    const messageArray = [];
    for (const [i, event] of events.entries()) {
      let message = 'unknown';
      if (event.type === ScoreEvent.holeEnd) {
        if (event.score === 0) {
            message = ` scored E on hole ${event.hole}`;
        } else if (event.score < 0) {
           message = ` scored ${event.score} on hole ${event.hole}`;
        } else {
            message = ` scored +${event.score} on hole ${event.hole}`;
        }
        
      } else if (event.type === ScoreEvent.roundEnd) {
        if (event.totalScore === 0) {
            message = ` finished E`;
        } else if (event.totalScore < 0) {
            message = ` finished ${event.totalScore}`;
        } else {
            message = ` finished +${event.totalScore}`;
        }
      }

      messageArray.push(
        <div key={i} className='event'>
          <span className={'player-event'}>{event.from.split('@')[0]}</span>
          {message}
        </div>
      );
    }
    return messageArray;
  }

  return (
      <div id='player-messages'>{createMessageArray()}</div>
  );
}