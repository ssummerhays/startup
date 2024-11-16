const express = require('express');
const uuid = require('uuid');
const app = express();

let users = {};
let tournamentList = {};

const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());

app.use(express.static('public'));

var apiRouter = express.Router();
app.use(`/api`, apiRouter);

apiRouter.post('/auth/create', async (req, res) => {
    const user = users[req.body.email];
    if (user) {
        res.status(409).send({msg: "existing user"});
    } else {
        const user = { 
            email: req.body.email,
            name: req.body.name,
            password: req.body.password,
            recentScore: 0,
            totalScore: 0,
            parBreakers: 0,
            currentHole: 1,
            currentTournament: "",
            token: uuid.v4()
        };
        users[user.email] = user;
        
        res.send({ token: user.token });
    }
});

apiRouter.post('/auth/login', async (req, res) => {
  const user = users[req.body.email];
  if (user) {
    if (req.body.password === user.password) {
      user.token = uuid.v4();
      res.send({ token: user.token });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

apiRouter.delete('/auth/logout', (req, res) => {
    const user = users[req.body.email];
    if (user) {
        delete user.token;
    }
    res.status(204).end();
});

apiRouter.get('/users', (req, res) => {
    res.send(users);
});

apiRouter.post('/tournaments/create', (req, res) => {
    const tournament = tournamentList[req.body.tournamentName];
    const user = users[req.body.email];
    if (tournament) {
        res.status(409).send({ msg: "existing tournament name" });
    } else {
        const tournament = {
            tournamentName: req.body.tournamentName,
            courseName: req.body.courseName,
            maxPlayers: req.body.maxPlayers,
            players: []
        };

        if (!tournament.players.includes(req.body.email)) {
            if (tournament.players.length === tournament.maxPlayers) {
                res.status(409).send({ msg: "Error: This tournament is full. Please create a new tournament or join a different tournament"});
            } else if (user.currentTournament === "") {
                tournament.players.push(req.body.email);
                user.currentTournament = req.body.tournamentName;
                tournamentList[req.body.tournamentName] = tournament;
                res.send(tournament);
            } else {
                res.status(409).send({ msg: "Already in a tournament. Finish your current tournament before starting another."})
            }
        } else {
            res.send(tournament);
        }
    }
});

apiRouter.get('/tournaments', (req, res) => {
    res.send(tournamentList);
});

apiRouter.post('/tournaments/player', (req, res) => {
    const tournament = tournamentList[req.body.tournamentName];
    const user = users[req.body.email];
    if (!tournament.players.includes(req.body.email)) {
        if (tournament.players.length >= tournament.maxPlayers) {
            res.status(409).send({ msg: "Error: This tournament is full. Please create a new tournament or join a different tournament"});
        } else if (user.currentTournament === "") {
                tournament.players.push(req.body.email);
                user.currentTournament = req.body.tournamentName;
                res.send({});
        } else {
            res.status(409).send({ msg: "Already in a tournament. Finish your current tournament before starting another."})
        }
    } else {
        res.send({});
    }
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});