const express = require('express')
const app = express()
const port = 3000
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const joinRoom = require('./listener/joinroom')
const setPlayerScore = require('./listener/setplayerscore')
const disconnect = require('./listener/disconnect')
const emitListRoom = require('./emitter/listroom')

/**
 * types: createRooms() dari types.js
 */
const appRoom = {}
const activePlayer = {}


io.on('connection', function (socket) {
  console.log('a user connected');
  const nsp = io.of('/')
  const socketRooms = nsp.adapter.rooms
  const socketListenerData = {
    activePlayer,
    io,
    socket,
    socketRooms,
    appRoom
  }

  socket.on('joinRoom', joinRoom(socketListenerData))
  socket.on('setPlayerScore', setPlayerScore(socketListenerData))
  socket.on('disconnect', disconnect(socketListenerData))
  socket.on('checkRoom', () => emitListRoom(io, appRoom))

});

http.listen(port, function () {
  console.log('listening to port', port);
});