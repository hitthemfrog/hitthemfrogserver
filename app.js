const express = require('express')
const app = express()
const port = process.env.PORT || 3333
const http = require('http').createServer(app)
const io = require('socket.io').listen(http)
const joinRoom = require('./listener/joinroom')
const setPlayerScore = require('./listener/setplayerscore')
const disconnect = require('./listener/disconnect')
const emitListRoom = require('./emitter/listroom')
const Multer = require('multer');
const multerConf = {
  storage: Multer.diskStorage({
    destination: function (req, file, next) {
      next(null, './public')
    },
    filename: function (req, file, next) {
      console.log(req)
      let {
        socketId,
        roomName
      } = req.body
      const ext = file.mimetype.split('/')[1]
      next(null, `${socketId}-${roomName}.${ext}`);
    }
  })
}

app.post("/uploadimage", Multer(multerConf).single('image'), (req, res, next) => {
  console.log(req.file, " ini req.file")
});

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

});

http.listen(port, function () {
  console.log('listening to port', port);
});

module.exports = {
  http,
  appRoom,
  activePlayer
}