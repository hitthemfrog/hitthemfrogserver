// const express = require('express');
// const app = express();
// const port = 3000;
// const http = require('http').createServer(app);
// const io = require('socket.io')(http);
//buat upload image
const cors = require('cors')
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
})
}

const avail_room = []




// io.on('connection', function(socket){
const express = require('express')
const app = express()
const port = 3232
const { GAME_STATUS, createPlayer, createRooms } = require('./types')
const { isPlayerInRoom } = require('./helpers')
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const joinRoom = require('./listener/joinroom')

/**
 * types: createRooms() dari types.js
 */
const appRoom = {}


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

app.use((err, req, res, next) => {
  console.error(err)
})

io.on('connection', function (socket) {
  console.log('a user connected');
  const nsp = io.of('/')
  const socketRooms = nsp.adapter.rooms

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

  // socket.on('createRooms', function(data) {
  socket.on('createRooms', function (data) {
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
    })
    io.emit('createRooms', avail_room)
  })

  socket.on('joinRoom', joinRoom({ socket, socketRooms, appRoom }))

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

  socket.on('setPlayerScore', playerDataObj => {
    if (appRoom[playerDataObj.room]) {
      let index = appRoom[playerDataObj.room].players.findIndex(p => p.name === playerDataObj.player)

      appRoom[playerDataObj.room].players[index].hitScores = playerDataObj.hit
      appRoom[playerDataObj.room].players[index].missScores = playerDataObj.miss

      io.to(playerDataObj.room).emit('playersData', appRoom[playerDataObj.room].players)
    }
    
    // console.log(appRoom[playerDataObj.room].players)
  })


  socket.on('disconnect', function () {
    console.log('a user disconnected')
  })

});

http.listen(port, function () {
  console.log('listening to port', port);
});