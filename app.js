const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors')
const http = require('http').createServer(app);
const io = require('socket.io')(http);
//buat upload image
const Multer = require('multer');
const multer = Multer({
    storage: Multer.MemoryStorage,
    limits: {
        fileSize: 10 * 1024 * 1024, // Maximum file size is 10MB
    },
});
const multerConf = {
  storage: Multer.diskStorage({
  destination: function (req, file, next) {
    next(null, './public/user/picture')
  },
  filename: function (req, file, next) {
      console.log(req)
      let { socketId, roomName } = req.body
      const ext = file.mimetype.split('/')[1]
      next(null, `${socketId}-${roomName}.${ext}`);
  }
}),
fileFilter: function(req, file, next){
    if (!file){
        next();
    }
    const image = file.mimetype.startsWith('image/');
    if (image){
        next(null, true)
    }
    else{
        next({message:"File type not supported"}, false)
    }
}
}
const avail_room = []

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res, next) => {
  res.status(200).json('HELLO HIT THEM FROG');
})

app.post("/uploadimage", Multer(multerConf).single('image'), (req, res, next) => {
  // console.log(req.body, " ini req.body")

  console.log(req.file, " ini req.file")
});



io.on('connection', function(socket){
  console.log('a user connected');
  
  // socket.on('checkRooms', function() {
  //   console.log('checkRooms ke trigger')
  //   io.emit('checkRooms', io.sockets.adapter.rooms)
  //   // io.emit('checkRooms', avail_room)
  // })

  socket.on('getPlayersInROom', function(value) {
    console.log('getPlayersInROom ke trigger')
    console.log('value' , value)
    let playerInRoom = avail_room.filter(el => (el.name === value.roomname ))
    // avail_room.forEach(el => {
    //   console.log(el.name, "----------")
    // })
    console.log(playerInRoom, " player")
    io.emit('getPlayersInROom', playerInRoom)
  })

  socket.on('listRooms', function() {
    console.log('listRooms ke trigger')
    io.emit('listRooms', avail_room)
  })

  socket.on('createRooms', function(data) {
    console.log('createRooms ke trigger')
    // let roomsObject = io.sockets.adapter.rooms
    // let roomsKey = Object.keys(roomsObject)
    // let roomList = roomsKey.map(e => roomsObject[e])
    // io.emit('createRooms', roomList)
    console.log(data)
    avail_room.push({
      name: data.roomName,
      status: 'waiting',
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