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

async function getUser(email) {
    return await userCollection.findOne({ email: email });
}

async function getAllUsers() {
    return await userCollection.find({}).toArray();
}

async function getUserByToken(token) {
    return await userCollection.findOne({ token: token });
}

async function getTournament(tournamentName) {
    return await tournamentCollection.findOne({ tournamentName: tournamentName });
}

async function getAllTournaments() {
    return await tournamentCollection.find({}).toArray();
}

async function createUser(username, email, password) {
    const passwordHash = await bcrypt.hash(password, 10);

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

        await userCollection.updateOne(filter, update);
        tournamentCollection.insertOne(tournament)
        return tournament
}

async function updateTournamentScores(tournamentName, score, parBreaker) {
    const tournament = await getTournament(tournamentName);
    const scores = tournament.scores;
    const parBreakers = tournament.parBreakers

    let found = false;

    if (parBreaker !== null) {
        for (let i = 0; i < parBreakers.length; i++) {
            let currentParBreaker = parBreakers[i];
            if (currentParBreaker.name === parBreaker.name) {
                parBreakers[i] = parBreaker;
                found = true;
                break;
            }
        }

        if (!found) {
            parBreakers.push(parBreaker);
        }
        parBreakers.sort((a, b) => b.parBreakers - a.parBreakers);

        const parBreakerFilter = { tournamentName: tournamentName };
        const parBreakerUpdate = {
            $set: { parBreakers: parBreakers },
        };

        await tournamentCollection.updateOne(parBreakerFilter, parBreakerUpdate);
    }

    found = false;
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

    await tournamentCollection.updateOne(filter, update);
    const result = {
        scores: scores,
        parBreakers: parBreakers
    }

    return result;

}

async function addPlayer(tournamentName, email) {
    const tournament = await getTournament(tournamentName);
    const player = await getUser(email);

    if (!tournament.players.includes(email)) {
        if (tournament.players.length >= tournament.maxPlayers) {
            return "max";
        } else if (player.currentTournament === "") {
                tournament.players.push(email);
                player.currentTournament = tournamentName;

                const filterTournament = { tournamentName: tournamentName };
                await tournamentCollection.replaceOne(filterTournament, tournament);

                const filterUser = { email: email };
                await userCollection.replaceOne(filterUser, player);
                return "success";
        } else {
            return "finish";
        }
    } else {
        return "success";
    }
}

async function resetUser(email) {
    const user = await getUser(email);
    user.recentScore = 0;
    user.totalScore = 0;
    user.parBreakers = 0;
    user.currentHole = 0;
    user.currentTournament = "";

    const filter = { email: user.email };

    await userCollection.replaceOne(filter, user);
}

async function updateUserScores(user, score) {
    const totalBefore = user.totalScore;
    const newTotal = score.total;
    const recent = newTotal - totalBefore;

    user.recentScore = recent;
    user.totalScore = newTotal;
    user.currentHole += 1;
    if (recent < 0) {
        user.parBreakers += 1;
    }

    const filter = { email: user.email };


    await userCollection.replaceOne(filter, user);

}

module.exports = {
    getUser,
    getAllUsers,
    getUserByToken,
    resetUser,
    getTournament,
    getAllTournaments,
    createUser,
    createTournament,
    updateTournamentScores,
    addPlayer,
    updateUserScores
}