
module.exports  = ({
  io, appRoom
}) => {

  return playerDataObj => {
    let index = appRoom[playerDataObj.room].players.findIndex(p => p.name === playerDataObj.player)
    let room = appRoom[playerDataObj.room]
    let player1 = room.players[0]
    let player2 = room.players[1]

    room.players[index].hitScores = playerDataObj.hit
    room.players[index].missScores = playerDataObj.miss
  
    if (player1.miss == '5') {
      io.to(playerDataObj.room).emit('isGameFinished', {
        winner: player2.name,
        score: {
          [player1.name]: player1.hitScores, 
          [player2.name]: player2.hitScores, 
        }
      })
    } else if (player2.miss == '5') {
      io.to(playerDataObj.room).emit('isGameFinished', {
        winner: player1.name,
        score: {
          [player1.name]: player1.hitScores,
          [player2.name]: player2.hitScores,
        }
      })
    } else if (player1.hit == '10') {
      io.to(playerDataObj.room).emit('isGameFinished', {
        winner: player1.name,
        score: {
          [player1.name]: player1.hitScores,
          [player2.name]: player2.hitScores,
        }
      })
    } else if (player2.hit == '10') {
      io.to(playerDataObj.room).emit('isGameFinished', {
        winner: player2.name,
        score: {
          [player1.name]: player1.hitScores,
          [player2.name]: player2.hitScores,
        }
      })
    }

    io.to(playerDataObj.room).emit('playersData', room.players)
    console.log(room.players)
  }
}