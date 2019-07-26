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
  
  socket.on('join-room-1', function(){
    if (!io.nsps['/'].adapter.rooms['room-1']) {
      socket.join('room-1');
      console.log(io.nsps['/'].adapter);
      console.log('masuk room 1');
    } else if (io.nsps['/'].adapter.rooms['room-1']['length'] < 2) {
      socket.join('room-1');
      console.log('masuk room 1');
    } else {
      console.log('udah penuh bang');
    }
    
  })

  socket.on('increment', function(value){
    let roomsKeys = Object.keys(io.nsps['/'].adapter.rooms);
    let roomName = roomsKeys[roomsKeys.length-1];
    io.to(roomName).emit('increment', value);
  })

  socket.on('join-room-2', function(){
    if (!io.nsps['/'].adapter.rooms['room-2']) {
      socket.join('room-2');
      console.log(Object.keys(io.nsps['/'].adapter.rooms)[Object.keys(io.nsps['/'].adapter.rooms).length-1]);
      console.log('masuk room 2');
    } else if (io.nsps['/'].adapter.rooms['room-2']['length'] < 3) {
      socket.join('room-2');
      console.log('masuk room 2');
    }
  })

  socket.on('disconnect', function() {
    console.log('a user disconnected')
  })

  socket.on('setCounter', function(value) {
    io.emit('setCounter');
  })
});

http.listen(port, function(){
  console.log('listening to port', port);
});