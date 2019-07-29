const io = require('socket.io-client');
const { http, appRoom, activePlayer } = require('../app')
let socket1;
let socket2;
let socket3;

afterAll((done) => {
  http.close(() => {
    console.log('exit server')
    done()
  })
})

describe('Socket test suit for Room', function () {
  beforeEach(function (done) {
    socket1 = io('http://localhost:3333', {
      forceNew: true
    });

    socket2 = io('http://localhost:3333', {
      forceNew: true
    });

    socket3 = io('http://localhost:3333', {
      forceNew: true
    });
  
    socket1.on('connect', function () {
      socket2.on('connect', function () {
        socket3.on('connect', function () {
          done();
        })
      })
    })
    
    // deleteAllRooms()
    // socket1.on('disconnect', function () {
    //   console.log('socket1 disconnected...');
    // })

    // socket2.on('disconnect', function () {
    //   console.log('socket2 disconnected...');
    // })

    // socket3.on('disconnect', function () {
    //   console.log('socket3 disconnected...');
    // })
  });
  
  afterEach(function (done) {
    

    // Cleanup
    if (socket1.connected) {
      socket1.disconnect();
    } else {
      // There will not be a connection unless you have done() in beforeEach, socket.on('connect'...)
      console.log('no connection to break...');
    }

    if (socket2.connected) {
      socket2.disconnect();
    } else {
      // There will not be a connection unless you have done() in beforeEach, socket.on('connect'...)
      console.log('no connection to break...');
    }

    if (socket3.connected) {
      socket3.disconnect();
    } else {
      // There will not be a connection unless you have done() in beforeEach, socket.on('connect'...)
      console.log('no connection to break...');
    }


    done();
  });

  test('one user joined a room, callback parameter should be true', () => {
    return new Promise((resolve, reject) => {
      socket1.on('listRoom', (rooms) => {
        console.log('testing', rooms)
        try {
          expect(rooms[0].name).toEqual('room1')
        } catch(err) {
          reject(err)
        }
        resolve()
      })

      socket1.emit(`joinRoom`, {roomName: 'room1', playerName: 'playerName'}, (value) => {
        expect(value).toEqual(true);  
      })
      
    })
  });

  test('two user joined a room, both user callback parameter should be true', () => {
    return new Promise((resolve, reject) => {
      socket1.on('listRoom', (rooms) => {
        try {
          expect(rooms[0].name).toEqual('room1')
        } catch(err) {
          reject(err)
        }
        socket2.on('listRoom', (rooms) => {
          try {
            expect(rooms[0].name).toEqual('room1')
          } catch(err) {
            reject(err)
          }
          resolve()
        });
      });

      socket1.emit(`joinRoom`, {roomName: 'room1', playerName: 'Nobita'}, (value) => {
        expect(value).toEqual(true);  
      });

      socket2.emit(`joinRoom`, {roomName: 'room1', playerName: 'Dekisugi'}, (value) => {
        expect(value).toEqual(true);  
      });
      
    })
  });

});