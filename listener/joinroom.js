// template listener
// export sebuah function
// kemudian return sebuah function yang menerima param data & callback
const { isPlayerInRoom } = require('../helpers')
const { createRooms, createPlayer } = require('../types')

module.exports = ({
  socket, socketRooms, room
}) => {
  
  return (data, cb) => {
    let { roomName, playerName } = data

    console.log({ roomName, playerName, cb })
    let selectedRoom = socketRooms[roomName]
    if (!selectedRoom) {
      socket.join(roomName)
      room[roomName] = createRooms(roomName, playerName)
      cb(true)
    } else if (selectedRoom && selectedRoom.length < 2 && !isPlayerInRoom(room[roomName], playerName)) {
      room[roomName].players.push(createPlayer(playerName))
      cb(true)
    } else {
      cb(false)
    }
    socket.emit('listRoom', room)
  }
}