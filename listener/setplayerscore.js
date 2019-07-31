
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
    let activePlayerTotalEmit = activePlayer && activePlayer.hit + activePlayer.miss;

    if (activePlayer && activePlayerTotalEmit <= 5) {
      activePlayer.hit = playerDataObj.hit
      activePlayer.miss = playerDataObj.miss
    }

    let player1score  
    let player1totalEmit
    if (player1) {
      player1totalEmit = player1.hit + player1.miss
      player1score = player1.hit - player1.miss
      
    }
    let player2score
    let player2totalEmit
    if (player2) {
      player2totalEmit = player2.hit + player2.miss
      player2score = player2.hit - player2.miss
    }
    
    
    if (allPlayerActive && player1totalEmit >= 5 && player2totalEmit >= 5) {
      if (player1score > player2score) {
        winner = player1.name
      } else {
        winner = player2.name
      }
      emitIsGameFinished(io, playerDataObj.room, winner, room.players)
    }

    emitRoomPlayerScore(io, playerDataObj.room, room.players)
  }
}