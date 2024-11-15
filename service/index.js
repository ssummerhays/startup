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
    const user = Object.values(users).find((u) => u.token === req.body.token);
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
    if (tournament) {
        res.status(409).send("existing tournament name");
    } else {
        const tournament = {
            tournamentName: req.body.tournamentName,
            courseName: req.body.courseName,
            maxPlayers: req.body.maxPlayers,
            players: []
        };
        tournamentList[req.body.tournamentName] = tournament;

        res.send(tournament);
    }
});

apiRouter.get('/tournaments', (req, res) => {
    res.send(tournamentList);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});