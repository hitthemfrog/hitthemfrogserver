const express = require('express');
const app = express();
const port = 3000;
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', (req, res, next) => {
  res.status(200).json('HELLO HIT THEM FROG');
})

io.on('connection', function(socket){
  console.log('a user connected');
  
  socket.on('join-room-1', function(cb){
    if (!io.nsps['/'].adapter.rooms['room-1']) {
      socket.join('room-1');

      // console.log('dari server',io.nsps['/'].adapter);
      console.log('masuk room 1');
      cb(true)
    } else if (io.nsps['/'].adapter.rooms['room-1']['length'] < 2) {
      socket.join('room-1');
      console.log('masuk room 1');
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

  socket.on('checkBeforeEnter', function(value){
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

  socket.on('join-room-2', function(cb){
    if (!io.nsps['/'].adapter.rooms['room-2']) {
      socket.join('room-2');
      console.log('masuk room 2');
      cb(true)
    } else if (io.nsps['/'].adapter.rooms['room-2']['length'] < 3) {
      socket.join('room-2');
      cb(true)
      console.log('masuk room 2');
    } else {
      cb(false)
    }
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