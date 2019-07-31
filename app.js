const express = require('express')
const app = express()
const port = process.env.PORT || 3333
const fs = require('fs')
const cors = require('cors')
let http 

if (process.env.NODE_ENV === 'production') {
  const httpscred = require('./https.cred')
  http = require('https').createServer(httpscred, app)
} else {
  http = require('http').createServer(app)
}

app.use(cors())
app.get('/', (req, res, next) => res.json('hello hit them frog'))
app.use('/userimg', express.static('public'))

const io = require('socket.io').listen(http)
const joinRoom = require('./listener/joinroom')
const setPlayerScore = require('./listener/setplayerscore')
const disconnect = require('./listener/disconnect')
const emitListRoom = require('./emitter/listroom')
const Multer = require('multer');

const memoryStorage = {
  storage: Multer.MemoryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Maximum file size is 10MB
  },
}

app.post("/uploadimage", 
  Multer(memoryStorage).single('image'),
  (req, res, next) => {
    let { username } = req.body
    if (fs.existsSync('public/' + `${username}.png`)) {
      next({message: 'username exists'})
    } else {
      fs.writeFileSync(`public/${username}.png`, req.file.buffer)
      next()
    }
  },
  (req, res, next) => {
    res.json(true)
  }
);

app.use((err, req, res, next) => {
  console.error(err.message)
  res.status(500).json(err.message)
})

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

  socket.on('leaveRoom', function(roomName) {
    socket.leave(roomName, () => {
      delete appRoom[roomName];
      emitListRoom(io, appRoom);
    });
  });
});

http.listen(port, function () {
  console.log('listening to port', port);
});

module.exports = {
  http,
  appRoom,
  activePlayer
}