const express = require('express');
const app = express();
const port = 3000;
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const players = {
  'abc': {

  }
}

const avail_room = []

app.get('/', (req, res, next) => {
  res.status(200).json('HELLO HIT THEM FROG');
})

io.on('connection', function(socket){
  console.log('a user connected');
  
  // socket.on('checkRooms', function() {
  //   console.log('checkRooms ke trigger')
  //   io.emit('checkRooms', io.sockets.adapter.rooms)
  //   // io.emit('checkRooms', avail_room)
  // })

  socket.on('createRooms', function(data) {
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
    },)
    io.emit('createRooms', avail_room)
  })

  socket.on('join-room', function(roomName, cb){
    // console.log('join room ketrigger', roomName, player, cb)
    // if (players[player]) {
      
    // }
    // players[player] = 0
    if (!io.nsps['/'].adapter.rooms[roomName]) {
      socket.join(roomName);
      // console.log(io.nsps['/'].adapter);
      console.log(`masuk ${roomName}`);
      cb(true)
    } else if (io.nsps['/'].adapter.rooms[roomName]['length'] < 2) {
      socket.join(roomName);
      // console.log(io.nsps['/'].adapter);
      console.log(`masuk ${roomName}`);
      cb(true)
    } else {
      cb(false)
    }
    
  })

  socket.on('checkPlayer', function() {
    let roomsKeys = Object.keys(io.nsps['/'].adapter.rooms);
    let roomName = roomsKeys[roomsKeys.length-1];
    let playerAmount = io.nsps['/'].adapter.rooms[roomName]['length'];
    io.emit('checkPlayer', playerAmount);
  });

  socket.on('checkBeforeEnter', function(value){done();
    if (io.nsps['/'].adapter.rooms[value] == undefined) {
      // console.log(`${value} ADUH undefineed`);
      io.emit(`checkBeforeEnter-${value}`, 0);
    } else {
      // console.log(`${value} dia ENGGA undefineed`);
      let playerAmount = io.nsps['/'].adapter.rooms[value]['length'];
      io.emit(`checkBeforeEnter-${value}`, playerAmount);
    }
  })

  socket.on('increment', function(value){
    let roomsKeys = Object.keys(io.nsps['/'].adapter.rooms);
    let roomName = roomsKeys[roomsKeys.length-1];
    io.to(roomName).emit('increment', value);
  })
  
  socket.on('setCounter', function() {
    io.emit('setCounter');
  })

  socket.on('disconnect', function() {
    console.log('a user disconnected')
  })

});

http.listen(port, function(){
  console.log('listening to port', port);
});