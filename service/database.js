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