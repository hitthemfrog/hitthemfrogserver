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
const activePlayer = {}


io.on('connection', function (socket) {
  console.log('a user connected');
  const nsp = io.of('/')
  const socketRooms = nsp.adapter.rooms

  socket.on('joinRoom', joinRoom({
    activePlayer,
    io,
    socket,
    socketRooms,
    appRoom
  }))
  socket.on('setPlayerScore', setPlayerScore({
    io,
    appRoom
  }))
  socket.on('checkRoom', () => {
    console.log('emitted')
    let roomKeys = Object.keys(appRoom)
    let rooms = roomKeys.map(e => appRoom[e])
    io.emit('listRoom', rooms)
  })

  socket.on('disconnect', function () {
    if (activePlayer[socket.id]) {
    //   console.log('dari socket disconnect active player', activePlayer[socket.id]);
    //   console.log('dari socket disconnect with room', activePlayer[socket.id]['roomName']);
      let roomName = activePlayer[socket.id].roomName;
      let playerName = activePlayer[socket.id].playerName;
      console.log('INI NAMA PEMAIN', playerName);
      
      if (appRoom[roomName].players.length == 1) {
        delete appRoom[roomName];
        let roomKeys = Object.keys(appRoom)
        let rooms = roomKeys.map(e => appRoom[e])
        io.emit('listRoom', rooms)
      } 
      else if (appRoom[roomName].players.length == 2) {
        let playerIndex = appRoom[roomName].players.findIndex(e => e.name === playerName);
        appRoom[roomName].players.splice(playerIndex, 1);
        console.log('check room kehapus belom,', appRoom[roomName].players);
        let roomKeys = Object.keys(appRoom)
        let rooms = roomKeys.map(e => appRoom[e])
        io.emit('listRoom', rooms)
      }
    }

    
    console.log('a user disconnected')
  })

});

http.listen(port, function () {
  console.log('listening to port', port);
});