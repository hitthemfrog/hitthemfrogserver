module.exports = (io, roomid, winnerName, players) => {
  io.to(roomid).emit('isGameFinished', {
    winner: winnerName,
    score: players.reduce((acc, curr) => {
      acc[curr.name] = curr.hit - curr.miss
      return acc
    }, {})
  })
}