/**
 * semua tipe yang dipake di aplikasi didefine lewat sini
 */

const GAME_STATUS = {
  CREATED: 'CREATED',
  STARTED: 'STARTED',
  FINISHED: 'FINISHED',
}

function createPlayer(name) {
  return {
    name,
    hit: 0,
    miss: 0
  }
}

function createRooms(name, firstPlayerName, gameType, gameLevel) {
  return {
    name,
    players: [createPlayer(firstPlayerName)],
    gameStatus: GAME_STATUS.CREATED,
    gameType: gameType,
    gameLevel: gameLevel
  }
}

module.exports = {
  GAME_STATUS,
  createPlayer,
  createRooms
}