const emitListRoom = require('../emitter/listroom')

module.exports = ({
  activePlayer, appRoom, io, socket
}) => {
  return () => {
    if (activePlayer[socket.id]) {
      let roomName = activePlayer[socket.id].roomName;
      let playerName = activePlayer[socket.id].playerName;

      if (appRoom[roomName].players.length == 2) {
        let playerIndex = appRoom[roomName].players.findIndex(e => e.name === playerName);
        appRoom[roomName].players.splice(playerIndex, 1);
        emitListRoom(io, appRoom)
      }else {
        delete appRoom[roomName];
        emitListRoom(io, appRoom)
      }
      
    }
  }
}