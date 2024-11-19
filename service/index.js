const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const DB = require('./database.js');
const { Db } = require('mongodb');

const authCookieName = 'token';

let users = {};
let tournamentList = {};

const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());

app.use(cookieParser());

app.use(express.static('public'));

app.set('trust proxy', true);

var apiRouter = express.Router();
app.use(`/api`, apiRouter);

apiRouter.post('/auth/create', async (req, res) => {
    const user = DB.getUser;
    if (user === null) {
        res.status(409).send({msg: "existing user"});
    } else {
        const user = DB.createUser(req.body.name, req.body.email, req.body.password);

        setAuthCookie(res, user.token);
        
        res.send({ id: user._id });
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

const secureApiRouter = express.Router();
apiRouter.use(secureApiRouter);

secureApiRouter.use(async (req, res, next) => {
  const authToken = req.cookies[authCookieName];
  const user = await DB.getUserByToken(authToken);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

apiRouter.get('/users', (req, res) => {
    res.send(users);
});

secureApiRouter.post('/tournaments/create', (req, res) => {
    const tournament = DB.getTournament(req.body.tournamentName);
    const user = DB.getUser(req.body.email);
    if (tournament) {
        res.status(409).send({ msg: "existing tournament name" });
    } else {
        if (user.currentTournament === "") {
            const tournament = DB.createTournament(
                req.body.tournamentName, 
                req.body.courseName, 
                req.body.city, 
                req.body.country, 
                req.body.maxPlayers, 
                req.body.email
            );
            res.send(tournament);
        } else {
            res.status(409).send({ msg: "Already in a tournament. Finish your current tournament before starting another."})
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

apiRouter.post('/tournaments/score', (req, res) => {
    const user = users[req.body.email];
    const tournament = tournamentList[user.currentTournament];
    const total = user.totalScore + req.body.recentScore;
    const score = {
        name: user.name,
        total: total,
        thru: req.body.hole
    }
    if (parseInt(score.thru, 10) !== parseInt(user.currentHole, 10) + 1) {
        return res.status(409).send({ msg: `Hole is out of order. Please enter a score for hole ${parseInt(user.currentHole, 10) + 1}`})
    }
    user.recentScore = req.body.recentScore;
    user.totalScore = score.total;
    user.thru = req.body.hole;
    if (req.body.recentScore < 0) {
        const parBreaker = {
            name: user.name,
            parBreakers: user.parBreakers + 1
        }
        user.parBreakers += 1;

        let found = false;
        const parBreakers = tournament.parBreakers;
        for (let i = 0; i < parBreakers.length; i++) {
            let currentParBreaker = tournament.parBreakers[i];
            if (currentParBreaker.name === parBreaker.name) {
                tournament.parBreakers[i] = parBreaker;
                found = true;
                break;
            }
        }
    
        if (!found) {
            tournament.parBreakers.push(parBreaker);
        }
        tournament.parBreakers.sort((a, b) => b.parBreakers - a.parBreakers);
    }

    if (parseInt(req.body.hole, 10) === 18) {
        score.thru = 'F';
        user.recentScore = 0;
        user.totalScore = 0;
        user.parBreakers = 0;
        user.currentHole = 0;
        user.currentTournament = "";
    }

    let found = false;
    const scores = tournament.scores;
    for (let i = 0; i < scores.length; i++) {
        let currentScore = tournament.scores[i];
        if (currentScore.name === score.name) {
            tournament.scores[i] = score;
            found = true;
            break;
        }
    }
    if (!found) {
        tournament.scores.push(score);
    }
    tournament.scores.sort((a, b) => a.total - b.total);

    user.currentHole += 1;

    const result = {
        scores: tournament.scores,
        parBreakers: tournament.parBreakers,
    }

    res.send(result);
})

apiRouter.get('/tournaments/score', (req, res) => {
    const tournament = tournamentList[req.body.tournamentName];

    const result = {
        scores: tournament.scores,
        parBreakers: tournament.parBreakers
    }
    res.send(result);
});

app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});