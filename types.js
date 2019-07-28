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
    score: 0
  }
}

function createRooms(name, firstPlayerName) {
  return {
    name,
    players: [createPlayer(firstPlayerName)],
    gameStatus: GAME_STATUS.CREATED
  }
}

module.exports = {
  GAME_STATUS,
  createPlayer,
  createRooms
}