const express = require('express');
const app = express();
const port = 3000;
const { GAME_STATUS, createPlayer, createRooms } = require('./types')
const { isPlayerInRoom } = require('./helpers')
const http = require('http').createServer(app);
const io = require('socket.io')(http);

/**
 * {
 *   name: nama room
 *   players: []
 *   statusGame: 
 * }
 */
const room = {}


io.on('connection', function (socket) {
  console.log('a user connected');
  const nsp = io.of('/')

  // socket.on('checkRooms', function() {
  //   console.log('checkRooms ke trigger')
  //   io.emit('checkRooms', io.sockets.adapter.rooms)
  //   // io.emit('checkRooms', avail_room)
  // })

  socket.on('createRooms', function (data) {
    console.log('createRooms ke trigger')
    // let roomsObject = io.sockets.adapter.rooms
    // let roomsKey = Object.keys(roomsObject)
    // let roomList = roomsKey.map(e => roomsObject[e])
    // io.emit('createRooms', roomList)
    console.log(data)
    avail_room.push({
      name: data.roomName,
      players: [
        {
          playerName: data.player,
          score: 0
        }
      ]
    })
    io.emit('createRooms', avail_room)
  })

  socket.on('joinRoom', (data, cb) => {
    let {roomName, playerName} = data
    console.log({roomName, playerName, cb})
    let selectedRoom = nsp.adapter.rooms[roomName]
    if (!selectedRoom) {
      socket.join(roomName);
      room[roomName] = createRooms(roomName, playerName)
      cb(true)
    } else if (selectedRoom && selectedRoom.length < 2 && !isPlayerInRoom(room[roomName], playerName)) {
      room[roomName].players.push(createPlayer(playerName))
      cb(true)
    } else {
      cb(false)
    }
    socket.emit('listRoom', room)
  })

  socket.on('checkPlayer', function () {
    let roomsKeys = Object.keys(nsp.adapter.rooms);
    let roomName = roomsKeys[roomsKeys.length - 1];
    let playerAmount = nsp.adapter.rooms[roomName]['length'];
    io.emit('checkPlayer', playerAmount);
  });

  socket.on('checkBeforeEnter', function (value) {
    done();
    if (nsp.adapter.rooms[value] == undefined) {
      // console.log(`${value} ADUH undefineed`);
      io.emit(`checkBeforeEnter-${value}`, 0);
    } else {
      // console.log(`${value} dia ENGGA undefineed`);
      let playerAmount = nsp.adapter.rooms[value]['length'];
      io.emit(`checkBeforeEnter-${value}`, playerAmount);
    }
  })

  socket.on('increment', function (value) {
    let roomsKeys = Object.keys(nsp.adapter.rooms);
    let roomName = roomsKeys[roomsKeys.length - 1];
    io.to(roomName).emit('increment', value);
  })

  socket.on('setCounter', function () {
    io.emit('setCounter');
  })

  socket.on('disconnect', function () {
    console.log('a user disconnected')
  })

});

http.listen(port, function () {
  console.log('listening to port', port);
});