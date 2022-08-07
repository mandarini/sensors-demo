'use strict';

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
const port = process.env.PORT || 3000;

function onConnection(socket) {
  socket.on('drawing', (data) => {
    console.log('Received: ', data);
    return socket.broadcast.emit('drawing', data);
  });
  socket.on('disconnect', () => console.log('Client disconnected'));
}

io.on('connection', onConnection);

http.listen(port, () => console.log('listening on port: ' + port));
