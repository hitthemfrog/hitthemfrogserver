module.exports = (io, roomid, roomPlayers) => {
  io.to(roomid).emit('playerScores', roomPlayers)
}