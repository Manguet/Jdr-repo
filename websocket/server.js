const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3001 });

wss.on('connection', function connection(ws) {
    console.log('Nouvelle connexion établie');

    ws.on('message', function incoming(message) {
        console.log('Message reçu:', message.toString());

        // Renvoi du message à tous les clients connectés
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });
});

console.log('WebSocket server démarré sur le port 3001');
