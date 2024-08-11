'use strict';

var http = require("http"),
    { Server: SocketIOServer } = require("socket.io"),
    fs = require("fs"),
    path = require("path");

var port = 8032;

var app = http.createServer(function(req, resp){
    // Obtén la ruta del archivo solicitado
    var filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    // Determina el tipo de contenido a servir
    var extname = String(path.extname(filePath)).toLowerCase();
    var mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
    };

    var contentType = mimeTypes[extname] || 'application/octet-stream';

    // Lee el archivo solicitado
    fs.readFile(filePath, function(err, data) {
        if (err) {
            if (err.code === 'ENOENT') {
                fs.readFile('./404.html', function(error, content) {
                    resp.writeHead(404, { 'Content-Type': 'text/html' });
                    resp.end(content, 'utf-8');
                });
            } else {
                resp.writeHead(500);
                resp.end('Sorry, check with the site admin for error: '+err.code+' ..\n');
            }
        } else {
            resp.writeHead(200, { 'Content-Type': contentType });
            resp.end(data, 'utf-8');
        }
    });

});

app.listen(port, () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
});

var io = new SocketIOServer(app);
var connections = []

io.sockets.on("connection", function(socket) {
    console.log('Player connected: ', socket.id)

	socket.on('start', (data, callback) => {
        const { posX, posY, dirX, dirY, lives } = data
        const serverSocketId = socket.id
        const players = connections.map(playerSocket => ({
            serverSocketId: playerSocket.id,
            ...playerSocket.data
        })).filter(player => player.lives > 0);
        

        callback({ serverSocketId, players })

        socket.data = {
            serverSocketId: socket.id,
            ...data
        }

        connections.push(socket);

        io.sockets.emit('new_player', { serverSocketId, posX, posY, dirX, dirY, lives })
    })

    socket.on('player_position_to_server', data => {
        const { serverSocketId, posX, posY, dirX, dirY, lives } = data

        if (serverSocketId === socket.id) {
            socket.data = data
        }

        if (lives === 0) {
            io.sockets.emit('player_position_to_client', { serverSocketId, posX: 0, posY: 0, dirX, dirY, lives });
        } else {
            io.sockets.emit('player_position_to_client', { serverSocketId, posX, posY, dirX, dirY, lives });
        }
    })

    socket.on('shoot_other_player', data => {
        const { serverSocketId, player } = data;

        if (player.lives === 0) {
            player.posX = 0;
            player.posY = 0;
            io.sockets.emit('player_position_to_client', player);

            const ix = connections.findIndex(playerSocket => playerSocket.id === player.serverSocketId)
            if (ix !== -1) {
                connections[ix].data = player;
            }
        } else {
            io.sockets.emit('player_position_to_client', player);
        }
    })

    socket.on("disconnect", function (reason) {
        const ix = connections.findIndex(playerSocket => playerSocket.id === socket.id);
        if (ix !== -1) {
            connections.splice(ix, 1);
            console.log("Player disconnected:", socket.id, reason)
            io.sockets.emit('player_position_to_client', {serverSocketId: socket.id, posX: 0, posY: 0, dirX: 0, dirY: 0, lives: 0});
        }
    })
})
