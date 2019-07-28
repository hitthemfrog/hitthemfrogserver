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
  io,
  socket,
  socketRooms,
  appRoom
}) => {

  return (data, cb) => {
    let {
      roomName,
      playerName
    } = data

    // console.log({ roomName, playerName, cb })
    let selectedRoom = socketRooms[roomName]
    if (!selectedRoom) {
      socket.join(roomName)
      appRoom[roomName] = createRooms(roomName, playerName)
      activePlayer[socket.id] = {
        playerName,
        roomName
      }

      console.log('di dalam join room, player name', activePlayer[socket.id].playerName);
      // console.log('ini activePlayer'. activePlayer);
      cb(true)
    } else if (selectedRoom && selectedRoom.length < 2 && !isPlayerInRoom(appRoom[roomName], playerName)) {
      socket.join(roomName)
      appRoom[roomName].players.push(createPlayer(playerName))
      activePlayer[socket.id] = {
        playerName,
        roomName
      }
      // console.log('ini activePlayer');

      console.log('di dalam join room, player name', activePlayer[socket.id].playerName);
      cb(true)
    } else {
      cb(false)
    }

    // console.log('ini activePlayer', activePlayer);

    let roomKeys = Object.keys(appRoom)
    let rooms = roomKeys.map(e => appRoom[e])
    io.emit('listRoom', rooms)
  }
}