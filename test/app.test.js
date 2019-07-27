const io = require('socket.io-client');
const chai = require('chai');
let socket;



describe('Try on first socket test', function () {
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
  test('same room cannot joined by m', function (done) {

    console.log(`socket1`, socket1.id);
    console.log(`socket2`, socket2.id);
    console.log(`socket3`, socket3.id);
    

    socket1.emit(`join-room`, 'room-1',function(value){
      console.log(value);
      socket2.emit(`join-room`, 'room-1',function(value){
        console.log(value);
        socket3.emit(`join-room`, 'room-2',function(value){
          console.log(value);
          done();
        });
      });
      // done();
    });
    
  })
});