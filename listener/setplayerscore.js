
const emitRoomPlayerScore = require('../emitter/room.playerscore')
const emitIsGameFinished = require('../emitter/room.isgamefinished')

module.exports  = ({
  io, appRoom
}) => {
  return playerDataObj => {

    if (!appRoom[playerDataObj.room]) {
      return
    }
    
    let index = appRoom[playerDataObj.room].players.findIndex(p => p.name === playerDataObj.player)
    let room = appRoom[playerDataObj.room]
    let player1 = room.players[0]
    let player2 = room.players[1]

    room.players[index].hit = playerDataObj.hit
    room.players[index].miss = playerDataObj.miss
  
    // console.log('MASHOK SINI', room.players[index].missScores);
    if (player1.miss == '5') {
      winner = player2.name
      emitIsGameFinished(io, playerDataObj.room, winner, room.players)
    } else if (player2.miss == '5') {
      winner = player1.name
      emitIsGameFinished(io, playerDataObj.room, winner, room.players)
    } else if (player1.hit == '10') {
      winner = player1.name
      emitIsGameFinished(io, playerDataObj.room, winner, room.players)
    } else if (player2.hit == '10') {
      winner = player2.name
      emitIsGameFinished(io, playerDataObj.room, winner, room.players)
    }

    emitRoomPlayerScore(io, playerDataObj.room, room.players)
  }
}