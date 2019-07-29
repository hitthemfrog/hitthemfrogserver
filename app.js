const express = require('express')
const app = express()
const port = process.env.PORT || 3333
const expresshttp = require('http')
let http 

if (process.env.NODE_ENV === 'production') {
  const httpscred = require('./https.cred')
  http = expresshttp.createServer(httpscred, app)
} else {
  http = expresshttp.createServer(app)
}

app.get('/', (req, res, next) => res.json('hello hit them frog'))

const io = require('socket.io').listen(http)
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

module.exports = {
  http,
  appRoom,
  activePlayer
}