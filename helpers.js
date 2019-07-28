function isPlayerInRoom (room, player) {
  return room.players.findIndex(e => e.name === player) !== -1
}

module.exports = {
  isPlayerInRoom
}