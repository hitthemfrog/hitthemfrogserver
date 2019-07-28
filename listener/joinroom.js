const emitListRoom = require('../emitter/listroom')

// template listener
// export sebuah function
// kemudian return sebuah function yang menerima param data & callback
const {
  isPlayerInRoom
} = require('../helpers')
const {
  createRooms,
  createPlayer
} = require('../types')

module.exports = ({
  activePlayer,
  socket,
  socketRooms,
  appRoom
}) => {
  return (data, cb) => {
    let {
      roomName,
      playerName
    } = data

    let selectedRoom = socketRooms[roomName]
    
    if (!selectedRoom) {
      socket.join(roomName)
      appRoom[roomName] = createRooms(roomName, playerName)
      activePlayer[socket.id] = {
        playerName,
        roomName
      }
      cb(true)
      emitListRoom(io, appRoom)
    } else if (selectedRoom && selectedRoom.length < 2 && !isPlayerInRoom(appRoom[roomName], playerName)) {
      socket.join(roomName)
      appRoom[roomName].players.push(createPlayer(playerName))
      activePlayer[socket.id] = {
        playerName,
        roomName
      }
      emitListRoom(io, appRoom)
      cb(true)
    } else {
      cb(false)
    }
  }
}