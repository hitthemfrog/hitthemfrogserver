function isPlayerInRoom (room, player) {
  console.log(room);
  
  return room.players.findIndex(e => e.name === player) !== -1
}

module.exports = {
  isPlayerInRoom
}