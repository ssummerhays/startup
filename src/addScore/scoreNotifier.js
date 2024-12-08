const ScoreEvent = {
  holeEnd: 'holeEnd',
  roundEnd: 'roundEnd',
};

class EventMessage {
  constructor(from, type, hole, score, totalScore, tournamentName) {
    this.from = from;
    this.type = type;
    this.hole = hole;
    this.score = score;
    this.totalScore = totalScore;
    this.tournamentName = tournamentName;
  }
}

class ScoreEventNotifier {
  events = [];
  handlers = [];
  holeNumber = 1;
  totalScore = 0;

  constructor() {
    let port = window.location.port;
    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    this.socket = new WebSocket(`${protocol}://${window.location.hostname}:${port}/ws`);
    this.socket.onopen = (event) => {
      const message = JSON.stringify({ tournamentName: event.tournamentName });
      this.socket.send(message);
    }
    this.socket.onclose = (event) => {}
    this.socket.onmessage = async (msg) => {
      try {
        const event = JSON.parse(await msg.data.text());
        this.receiveEvent(event);
      } catch {}
    };
  }

  broadcastEvent(from, type, hole, score, totalScore, tournamentName) {
    const event = new EventMessage(from, type, hole, score, totalScore, tournamentName);
    this.socket.send(JSON.stringify(event));
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