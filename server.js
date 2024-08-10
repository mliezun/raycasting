'use strict';

var http = require("http"),
    { Server: SocketIOServer } = require("socket.io"),
    fs = require("fs"),
    path = require("path");

var port = 3456;

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
    console.log('Server listening on port ' + port);
});

var io = new SocketIOServer(app);
var connections = []

io.sockets.on("connection", function(socket) {
    console.log('Player Conectado: ', socket.id)

	socket.on('start', (data, callback) => {
        const { posX, posY, dirX, dirY } = data
        const serverSocketId = socket.id
        const players = connections.map(playerSocker => ({
            serverSocketId: playerSocker.id,
            ...playerSocker.data
        }))
        

        callback({ serverSocketId, players })

        socket.data = {
            serverSocketId: socket.id,
            ...data
        }

        connections.push(socket);

        io.sockets.emit('new_player', { serverSocketId, posX, posY, dirX, dirY })
    })

    socket.on('player_position_to_server', data => {
        const { serverSocketId, posX, posY, dirX, dirY } = data

        if (serverSocketId === socket.id) {
            socket.data = data
        }

        io.sockets.emit('player_position_to_client', { serverSocketId, posX, posY, dirX, dirY })
    })
})
