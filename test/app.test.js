const io = require('socket.io-client');
const chai = require('chai');
let socket;

describe('Socket test suit', function () {
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
  
    socket1.on('disconnect', function () {
      console.log('socket1 disconnected...');
    })

    socket2.on('disconnect', function () {
      console.log('socket2 disconnected...');
    })

    socket3.on('disconnect', function () {
      console.log('socket3 disconnected...');
    })
  });
  
  afterEach(function (done) {
    // Cleanup
    if (socket1.connected) {
      console.log('disconnecting...');
      socket1.disconnect();
    } else {
      // There will not be a connection unless you have done() in beforeEach, socket.on('connect'...)
      console.log('no connection to break...');
    }

    if (socket2.connected) {
      console.log('disconnecting...');
      socket2.disconnect();
    } else {
      // There will not be a connection unless you have done() in beforeEach, socket.on('connect'...)
      console.log('no connection to break...');
    }

    if (socket3.connected) {
      console.log('disconnecting...');
      socket3.disconnect();
    } else {
      // There will not be a connection unless you have done() in beforeEach, socket.on('connect'...)
      console.log('no connection to break...');
    }
    done();
  });

  test('one user joined a room, callback param should be true', function (done) {
    socket1.emit(`join-room`, 'room-1',function(value){
      expect(value).toEqual(true);
      done();
    });
  });

  test("three user joined a room, third socket's callback param should be false", function (done) {
    socket1.emit(`join-room`, 'room-1',function(value){
      socket2.emit(`join-room`, 'room-1',function(value){
        socket3.emit(`join-room`, 'room-1',function(value){
          expect(value).toEqual(false);
          done();
        });
      });
    });
  })
});