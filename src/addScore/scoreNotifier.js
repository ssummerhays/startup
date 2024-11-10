const ScoreEvent = {
  holeEnd: 'holeEnd',
  roundEnd: 'roundEnd',
};

class EventMessage {
  constructor(from, type, hole, score, totalScore, scores, useScores, parBreakers) {
    this.from = from;
    this.type = type;
    this.hole = hole;
    this.score = score;
    this.totalScore = totalScore;
    this.scores = scores;
    this.useScores = useScores;
    this.parBreakers = parBreakers;
  }
}

class ScoreEventNotifier {
  events = [];
  handlers = [];
  holeNumber = 1;
  totalScore = 0;

  constructor() {
    // Simulate chat messages that will eventually come over WebSocket
    setInterval(() => {
      const score = Math.floor(Math.random() * 7 - 2);
      this.totalScore += score;
      
      const userName = 'Fake User';
      if (this.holeNumber === 18) {
        this.broadcastEvent(userName, ScoreEvent.roundEnd, this.holeNumber, score, this.totalScore, null, false, null);
        this.holeNumber = 1;
        this.totalScore = 0;
      } else {
        this.broadcastEvent(userName, ScoreEvent.holeEnd, this.holeNumber, score, this.totalScore, null, false, null);
        this.holeNumber += 1;
      }
    }, 5000);
  }

  broadcastEvent(from, type, hole, score, totalScore, scores, useScores, parBreakers) {
    const event = new EventMessage(from, type, hole, score, totalScore, scores, useScores, parBreakers);
    this.receiveEvent(event);
  }

  addHandler(handler) {
    this.handlers.push(handler);
  }

  removeHandler(handler) {
    this.handlers = this.handlers.filter((h) => h !== handler);
  }

  receiveEvent(event) {
    this.events.push(event);

    if (event.score < 0 && event.parBreakers) {
        let DNE = true;
        for (const [i, breaker ] of event.parBreakers.entries()) {
            if (breaker.name === event.from) {
                breaker.amount += 1;
                DNE = false;
            }
        }
        if (DNE) {
            const parBreakData = {
                name: event.from,
                amount: 1,
            }
            event.parBreakers.push(parBreakData);
        }
        localStorage.setItem('parBreakers', event.parBreakers);
        
    }

    if (event.useScores) {
        const score = {
        name: event.from,
        totalScore: event.totalScore,
        hole: event.hole
        }
        event.scores.push(score);
        const newScores = JSON.stringify(event.scores);
        localStorage.setItem('scores', newScores);
    }

    this.events.forEach((e) => {
      this.handlers.forEach((handler) => {
        handler(e);
      });
    });
  }
}

const ScoreNotifier = new ScoreEventNotifier();
export { ScoreEvent, ScoreNotifier };