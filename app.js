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
  
  socket.on('join-room', function(roomName, cb){
    if (!io.nsps['/'].adapter.rooms['roomName']) {
      socket.join(roomName);
      console.log(`masuk ${roomName}`);
      cb(true)
    } else if (io.nsps['/'].adapter.rooms[roomName]['length'] < 2) {
      socket.join(roomName);
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