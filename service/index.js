const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const DB = require('./database.js');
const { peerProxy } = require('./peerProxy.js')

const authCookieName = 'token';

const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());

app.use(cookieParser());

app.use(express.static('public'));

app.set('trust proxy', true);

var apiRouter = express.Router();
app.use(`/api`, apiRouter);

apiRouter.post('/auth/create', async (req, res) => {
    const user = await DB.getUser(req.body.email);
    if (user !== null) {
        res.status(409).send({msg: "existing user"});
    } else {
        const user = await DB.createUser(req.body.name, req.body.email, req.body.password);

        setAuthCookie(res, user.token);
        
        res.send({ id: user._id });
    }
});

apiRouter.post('/auth/login', async (req, res) => {
  const user = await DB.getUser(req.body.email);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      setAuthCookie(res, user.token);
      res.send({ id: user._id });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

apiRouter.delete('/auth/logout', (req, res) => {
    res.clearCookie(authCookieName);
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

secureApiRouter.get('/users', async (req, res) => {
    const users = await DB.getAllUsers();
    res.send(users);
});

secureApiRouter.post('/user/reset', async (req, res) => {
    await DB.resetUser(req.body.email);
});

secureApiRouter.post('/tournaments/create', async (req, res) => {
    const tournament = await DB.getTournament(req.body.tournamentName);
    const user = await DB.getUser(req.body.email);
    if (tournament !== null) {
        res.status(409).send({ msg: "existing tournament name" });
    } else {
        if (user.currentTournament === "") {
            const tournament = await DB.createTournament(
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

secureApiRouter.get('/tournaments', async (req, res) => {
    const tournamentList = await DB.getAllTournaments();
    res.send(tournamentList);
});

secureApiRouter.post('/tournaments/player', async (req, res) => {
    const result = await DB.addPlayer(req.body.tournamentName, req.body.email);

    if (result === "max") {
        res.status(409).send({ msg: "Error: This tournament is full. Please create a new tournament or join a different tournament"});
    } else if (result === "finish") {
        res.status(409).send({ msg: "Already in a tournament. Finish your current tournament before starting another."})
    } else {
        res.send({});
    }
})

secureApiRouter.post('/tournaments/score', async (req, res) => {
    const user = await DB.getUser(req.body.email);
    const total = user.totalScore + req.body.recentScore;
    let parBreaker = null;
    const score = {
        name: user.name,
        total: total,
        thru: req.body.hole
    }
    if (parseInt(score.thru, 10) !== parseInt(user.currentHole, 10) + 1) {
        return res.status(409).send({ msg: `Hole is out of order. Please enter a score for hole ${parseInt(user.currentHole, 10) + 1}`})
    }

    if (req.body.recentScore < 0) {
        parBreaker = {
            name: user.name,
            parBreakers: user.parBreakers + 1
        }
    }

    const result = await DB.updateTournamentScores(user.currentTournament, score, parBreaker);
    await DB.updateUserScores(user, score);

    res.send(result);
})

secureApiRouter.get('/tournaments/score', async (req, res) => {
    const tournament = await DB.getTournament(req.body.tournamentName);

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

const httpService = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

peerProxy(httpService);