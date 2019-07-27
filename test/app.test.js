const io = require('socket.io-client');
const chai = require('chai');

const expect = chai.expect;
let socket;


beforeEach(function (done) {
  socket = io('http://localhost:3000', {
    forceNew: true
  });

  socket.on('connect', function () {
    console.log('okay berhasil connect');
    done();
  })

  socket.on('disconnect', function () {
    console.log('disconnected...');
  })
});

afterEach(function (done) {
  // Cleanup
  if (socket.connected) {
    console.log('disconnecting...');
    socket.disconnect();
  } else {
    // There will not be a connection unless you have done() in beforeEach, socket.on('connect'...)
    console.log('no connection to break...');
  }
  done();
});

describe('Try on first socket test', function () {
  it('should log hehe', function (done) {
    console.log('hehe');
    done();
  })
});