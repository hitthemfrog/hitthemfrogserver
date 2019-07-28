const express = require('express')
const app = express()
const port = 3000
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const joinRoom = require('./listener/joinroom')
const setPlayerScore = require('./listener/setplayerscore')

/**
 * types: createRooms() dari types.js
 */


const appRoom = {}
  

io.on('connection', function (socket) {
  console.log('a user connected');
  const nsp = io.of('/')
  const socketRooms = nsp.adapter.rooms

  socket.on('joinRoom', joinRoom({ io, socket, socketRooms, appRoom }))
  socket.on('setPlayerScore', setPlayerScore({ io, appRoom}))
  socket.on('checkRoom', () => {
    console.log('emitted')
    let roomKeys = Object.keys(appRoom)
    let rooms = roomKeys.map(e => appRoom[e])
    io.emit('listRoom', rooms)
  })

  socket.on('disconnect', function () {
    console.log('a user disconnected')
  })

});

http.listen(port, function () {
  console.log('listening to port', port);
});