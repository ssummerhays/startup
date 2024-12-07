const { WebSocketServer } = require('ws');
const uuid = require('uuid');

function peerProxy(httpServer) {
    const wss = new WebSocketServer({noServer: true});

    httpServer.on('upgrade', (request, socket, head) => {
        wss.handleUpgrade(request, socket, head, function done(ws) {
            wss.emit('connection', ws, request);
        });
    });

    let connections = [];

    wss.on('connection', (ws) => {
        const connection = { id: uuid.v4(), tournament: null, alive: true, ws: ws };

        wss.on('message', (data) => {
            try {
                const message = JSON.parse(data);
                if (message.tournament) {
                    connection.tournament = message.tournament;
                }
            } catch (err) {
                //Message does not contain tournament
            }
        });
        
        connections.push(connection);

        wss.on('message', function message(data) {
            connections.forEach((c) => {
                if (c.tournament === connection.tournament && c.id !== connection.id) {
                    c.ws.send(data);
                }
            });
        });

        wss.on('close', () => {
            const pos = connections.findIndex((o, i) => o.id === connection.id);

            if (pos >= 0) {
                connections.splice(pos, 1);
            }
        });

        ws.on('pong', () => {
            connection.alive = true;
        });
    });

    setInterval(() => {
        connections.forEach((c) => {
            if (!c.alive) {
                c.ws.terminate();
            } else {
                c.alive = false;
                c.ws.ping();
            }
        });
    }, 10000);
}

module.exports = { peerProxy };