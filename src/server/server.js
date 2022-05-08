const io = require('socket.io')(3000, {
    cors: {
        origin: ['http://localhost:8080', '*'],
        
    }
});

io.on('connection', socket => {
    console.log(socket.id);

    socket.on('join-room', async (room, player) => {
        console.log(`${player}(${socket.id}) joined <${room}> room`);
        socket.data.username = player;
        const roomPlayers = await io.in(room).fetchSockets();
        let namesArray = [];
        for (let i = 0; i < roomPlayers.length; i++) {
            console.log(roomPlayers[i].data.username);
            namesArray.push(roomPlayers[i].data.username);
        }
        if (namesArray.length < 2) {
            console.log(namesArray);
            socket.join(room);
            namesArray.push(player);
            socket.to(room).emit("player-joined", player);
            socket.emit("player-list", namesArray);
        } else {
            socket.emit("full-room");
        }
    });

    socket.on('send-message', (message, room, player) => {
        console.log(player + " said " + message);
        socket.to(room).emit("receive-message", player + ": " + message)
    });

    socket.on('leave-room', (room, playerName) => {
        console.log(playerName + "left the room.");
        socket.to(room).emit("player-left", playerName);
        socket.leave(room);
    });

    socket.on('start-game', (connectedPlayers, room, playersColors) => {
        io.to(room).emit('start-game', connectedPlayers, playersColors);
    });

    socket.on('move-current-player', (currentPlayer, diceValue, room) => {
        console.log("in server bos", currentPlayer, room);
        socket.to("a").emit('update-current-player', currentPlayer);
    });
})

// const sockets = io.fetchSockets();

// sockets.then(s => {
//     console.log("sockets: ", s[0].data.username);
// })







