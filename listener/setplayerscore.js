
const emitRoomPlayerScore = require('../emitter/room.playerscore')
const emitIsGameFinished = require('../emitter/room.isgamefinished')
const types = require('../types')

module.exports  = ({
  io, appRoom
}) => {
  return playerDataObj => {
    let room = appRoom[playerDataObj.room]
    if (!room) {
      return
    }

    if (room.gameStatus === types.GAME_STATUS.STARTED && room.players.length === 1) {
      emitIsGameFinished(io, playerDataObj.room, room.players[0].name, room.players)
      return
    }
    
    let index = room.players.findIndex(p => p.name === playerDataObj.player)
    let player1 = room.players[0]
    let player2 = room.players[1]
    let allPlayerActive = player1 && player2 
    let activePlayer = room.players[index];

    if (activePlayer) {
      activePlayer.hit = playerDataObj.hit
      activePlayer.miss = playerDataObj.miss
    }
    
    if (allPlayerActive && player1.miss == '5') {
      winner = player2.name
      emitIsGameFinished(io, playerDataObj.room, winner, room.players)
    } else if (allPlayerActive && player2.miss == '5') {
      winner = player1.name
      emitIsGameFinished(io, playerDataObj.room, winner, room.players)
    } else if (allPlayerActive && player1.hit == '10') {
      winner = player1.name
      emitIsGameFinished(io, playerDataObj.room, winner, room.players)
    } else if (allPlayerActive && player2.hit == '10') {
      winner = player2.name
      emitIsGameFinished(io, playerDataObj.room, winner, room.players)
    }

    emitRoomPlayerScore(io, playerDataObj.room, room.players)
  }
}