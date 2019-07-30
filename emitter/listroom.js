module.exports = function (io, appRoom)  {
  let roomKeys = Object.keys(appRoom)
  let rooms = roomKeys.map(e => appRoom[e])
  console.log(rooms)
  io.emit('listRoom', rooms)
}