const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('startup');
const userCollection = db.collection('user');
const tournamentCollection = db.collection('tournament');

(async function testConnection() {
  await client.connect();
  await db.command({ ping: 1 });
})().catch((ex) => {
  console.log(`Unable to connect to database with ${url} because ${ex.message}`);
  process.exit(1);
});

function getUser(email) {
    return userCollection.findOne({ email: email });
}

function getUserByToken(token) {
    return userCollection.findOne({ token: token });
}

function getTournament(tournamentName) {
    return tournamentCollection.findOne({ tournamentName: tournamentName });
}

async function createUser(username, email, password) {
    const passwordHash = bcrypt.hash(password, 10);

    const user = { 
            email: email,
            name: username,
            password: passwordHash,
            recentScore: 0,
            totalScore: 0,
            parBreakers: 0,
            currentHole: 0,
            currentTournament: "",
            token: uuid.v4()
        };
    await userCollection.insertOne(user);

    return user;
}

async function createTournament(tournamentName, courseName, city, country, maxPlayers, email) {

    const tournament = {
            tournamentName: tournamentName,
            courseName: courseName,
            city: city,
            country: country,
            maxPlayers: maxPlayers,
            players: [email],
            scores: [],
            parBreakers: []
        };

        const filter = { email: email };

        const update = {
            $set: { currentTournament: tournamentName },
        };

        await userCollection.update(filter, update);
        tournamentCollection.insertOne(tournament)
}

async function updateTournamentScores(tournamentName, score) {
    const tournament = await getTournament(tournamentName);
    const scores = tournament.scores;

    for (let i = 0; i < scores.length; i++) {
        let currentScore = scores[i];
        if (currentScore.name === score.name) {
            scores[i] = score;
            found = true;
            break;
        }
    }
    if (!found) {
        scores.push(score);
    }
    scores.sort((a, b) => a.total - b.total);

    const filter = { tournamentName: tournamentName };

    const update = {
        $set: { scores: scores },
    };

    await tournamentCollection.update(filter, update);

}