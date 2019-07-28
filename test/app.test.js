const io = require('socket.io-client');
const { http } = require('../app')

afterAll((done) => {
  http.close(() => {
    console.log('exit server')
    done()
  })
})

describe('Socket test suit for Room', function () {
  beforeEach(function (done) {
    socket1 = io('http://localhost:3000', {
      forceNew: true
    });

    socket2 = io('http://localhost:3000', {
      forceNew: true
    });

    socket3 = io('http://localhost:3000', {
      forceNew: true
    });
  
    socket1.on('connect', function () {
      socket2.on('connect', function () {
        socket3.on('connect', function () {
          done();
        })
      })
    })
  
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
      socket1.emit(`join-room`, 'room-1', (value) => {
        expect(value).toEqual(true);
        resolve()
      });
    })
  });

  // test("two user joined a room, second user's callback parameter should be true", () => {
  //   return new Promise((resolve, reject) => {
  //     socket1.emit(`join-room`, 'room-1', (value1) => {
  //       expect(value1).toEqual(true);
  //       socket2.emit(`join-room`, 'room-1', (value2) => {
  //         console.log('masukkkkkkkkkkkkkk')
  //         expect(value2).toEqual(true);
  //         console.log('pppppppppppppppppppppp')
  //         resolve()
  //       });
  //     });
  //   })
  // });

  test("three user joined a room, third socket's callback parameter should be false", function (done) {
    socket1.emit(`join-room`, 'room-1',function(value1){
      expect(value1).toEqual(true);
      socket2.emit(`join-room`, 'room-1',function(value2){
        expect(value2).toEqual(true);
        socket3.emit(`join-room`, 'room-1',function(value3){
          expect(value3).toEqual(false);
          done();
        });
      });
    });
  })

  test("check user in the room after one user joined, value of user's callback param should be 1 ", function (done) {
    socket1.emit(`join-room`, 'room-1',function(value){
      socket1.emit(`checkPlayer`);
    });

    socket1.on(`checkPlayer`, function(value){
      expect(value).toEqual(1);
      done();
    })
  });

  test("check user in the room after two user joined same room, value of both user's callback param should be 2 ", function (done) {
    socket1.emit(`join-room`, 'room-1',function(value){
      socket2.emit(`join-room`, 'room-1',function(value){
        
        socket1.on(`checkPlayer`, function(value1){
          expect(value1).toEqual(2);
          socket2.on(`checkPlayer`, function(value2){
            expect(value2).toEqual(2);
            done();
          })
        })
        socket1.emit(`checkPlayer`);
        socket2.emit(`checkPlayer`);
      });
    });

  });

});