const ScoreEvent = {
  holeEnd: 'holeEnd',
  roundEnd: 'roundEnd',
};

class EventMessage {
  constructor(from, type, hole, score, totalScore) {
    this.from = from;
    this.type = type;
    this.hole = hole;
    this.score = score;
    this.totalScore = totalScore;
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
        this.broadcastEvent(userName, ScoreEvent.roundEnd, this.holeNumber, score, this.totalScore);
        this.holeNumber = 1;
        this.totalScore = 0;
      } else {
        this.broadcastEvent(userName, ScoreEvent.holeEnd, this.holeNumber, score, this.totalScore);
        this.holeNumber += 1;
      }
    }, 5000);
  }

  broadcastEvent(from, type, hole, score, totalScore) {
    const event = new EventMessage(from, type, hole, score, totalScore);
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

    this.events.forEach((e) => {
      this.handlers.forEach((handler) => {
        handler(e);
      });
    });
  }
}

const ScoreNotifier = new ScoreEventNotifier();
export { ScoreEvent, ScoreNotifier };