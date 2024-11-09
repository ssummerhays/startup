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

  constructor() {
    // Simulate chat messages that will eventually come over WebSocket
    setInterval(() => {
      const score = Math.floor(Math.random() * 7 - 2);
      const totalScore = Math.floor(Math.random() * 25 - 6);
      
      const userName = 'Fake User';
      if (this.holeNumber === 18) {
        this.broadcastEvent(userName, ScoreEvent.roundEnd, this.holeNumber, score, totalScore);
        this.holeNumber = 1;
      } else {
        this.broadcastEvent(userName, ScoreEvent.holeEnd, this.holeNumber, score, totalScore);
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