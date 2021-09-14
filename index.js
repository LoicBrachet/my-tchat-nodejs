const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.use(express.static('public'));


io.on('connection', (socket) => {
    //on affiche à tous les utilisateurs qu'une personne vient de se connecter, excepté la personne qui se connecte
    socket.broadcast.emit('new', 'un utilisateur vient de se connecter');
    //on affiche qu'un utilisateur s'est déconnecté
    socket.on('disconnect', function() {
        socket.broadcast.emit('new', 'Un utilisateur s\est déconnecté')
    });
    //on affiche les messages à tous les utilisateurs
    socket.on('chat message', (msg) => {
        io.emit('received_message', msg);
    });
    //on affiche qu'un utilisateur écrit un message
    socket.on('typing', (tpg) => {
        socket.broadcast.emit('typing', tpg)
    });

})

server.listen(3000, () => {
    console.log('écoute sur *:3000');
});