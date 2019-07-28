module.exports = function (io, appRoom)  {
  let roomKeys = Object.keys(appRoom)
  let rooms = roomKeys.map(e => appRoom[e])
  io.emit('listRoom', rooms)
}