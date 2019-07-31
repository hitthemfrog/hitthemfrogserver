const io = require('socket.io-client');
const {
  http,
  appRoom,
  activePlayer
} = require('../app')
let socket1;
let socket2;
let socket3;

afterAll((done) => {
  http.close(() => {
    done()
  })
})

describe('Socket test suit', function () {
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

  });

  afterEach(function (done) {


    // Cleanup
    if (socket1.connected) {
      socket1.disconnect();
    } else {
      // There will not be a connection unless you have done() in beforeEach, socket.on('connect'...)
      // console.log('no connection to break...');
    }

    if (socket2.connected) {
      socket2.disconnect();
    } else {
      // There will not be a connection unless you have done() in beforeEach, socket.on('connect'...)
      // console.log('no connection to break...');
    }

    if (socket3.connected) {
      socket3.disconnect();
    } else {
      // There will not be a connection unless you have done() in beforeEach, socket.on('connect'...)
      // console.log('no connection to break...');
    }


    done();
  });

  test('set player score test, player wrong room', () => {
    return new Promise((resolve, reject) => {
      socket1.on('playerScores', (roomPlayers) => {
        try {
          expect(roomPlayers[0].hit).toEqual(0);
        } catch (err) {
          reject(err)
        }
        resolve()
      })

      socket1.emit(`joinRoom`, {
        roomName: 'room5',
        playerName: 'Nobita'
      }, (value1) => {
        socket2.emit(`joinRoom`, {
          roomName: 'room5',
          playerName: 'Dekisugi'
        }, (value2) => {
          socket1.emit(`setPlayerScore`, {
            player: 'Nobita',
            room: 'room20',
            hit: '1',
            miss: '1'
          });
          socket1.emit(`setPlayerScore`, {
            player: 'Dekisugi',
            room: 'room5',
            hit: '1',
            miss: '1'
          });
        });
      })
    })
  });

  test('set player score test, no winner', () => {
    return new Promise((resolve, reject) => {
      socket1.on('playerScores', (roomPlayers) => {
        try {
          expect(roomPlayers[0].name).toEqual('Nobita');
          expect(roomPlayers[1].name).toEqual('Dekisugi');
        } catch (err) {
          reject(err)
        }
        resolve()
      })

      socket1.emit(`joinRoom`, {
        roomName: 'room2',
        playerName: 'Nobita'
      }, (value1) => {
        socket2.emit(`joinRoom`, {
          roomName: 'room2',
          playerName: 'Dekisugi'
        }, (value2) => {
          socket1.emit(`setPlayerScore`, {
            player: 'Nobita',
            room: 'room2',
            hit: '1',
            miss: '1'
          });
          socket1.emit(`setPlayerScore`, {
            player: 'Dekisugi',
            room: 'room2',
            hit: '1',
            miss: '1'
          });
        });
      })
    })
  });

  test('set player score test, player 1 miss 5 times, player 2 win', () => {
    return new Promise((resolve, reject) => {
      socket1.on('isGameFinished', (winnerObject) => {
        try {
          expect(winnerObject.winner).toEqual('Dekisugi');
        } catch (err) {
          reject(err)
        }
        resolve()
      })

      socket1.emit(`joinRoom`, {
        roomName: 'room3',
        playerName: 'Nobita'
      }, (value1) => {
        socket2.emit(`joinRoom`, {
          roomName: 'room3',
          playerName: 'Dekisugi'
        }, (value2) => {
          socket1.emit(`setPlayerScore`, {
            player: 'Nobita',
            room: 'room3',
            hit: '1',
            miss: '5'
          });
          socket1.emit(`setPlayerScore`, {
            player: 'Dekisugi',
            room: 'room3',
            hit: '1',
            miss: '1'
          });
        });
      })
    })
  });

  test('set player score test, player 2 miss 5 times, player 1 win', () => {
    return new Promise((resolve, reject) => {
      socket1.on('isGameFinished', (winnerObject) => {
        try {
          expect(winnerObject.winner).toEqual('Nobita');
        } catch (err) {
          reject(err)
        }
        resolve()
      })

      socket1.emit(`joinRoom`, {
        roomName: 'room4',
        playerName: 'Nobita'
      }, (value1) => {
        socket2.emit(`joinRoom`, {
          roomName: 'room4',
          playerName: 'Dekisugi'
        }, (value2) => {
          socket1.emit(`setPlayerScore`, {
            player: 'Nobita',
            room: 'room4',
            hit: '1',
            miss: '1'
          });
          socket1.emit(`setPlayerScore`, {
            player: 'Dekisugi',
            room: 'room4',
            hit: '1',
            miss: '5'
          });
        });
      })
    })
  });

  test('set player score test, player 1 hit 10 times, player 1 win', () => {
    return new Promise((resolve, reject) => {
      socket1.on('isGameFinished', (winnerObject) => {
        try {
          expect(winnerObject.winner).toEqual('Nobita');
        } catch (err) {
          reject(err)
        }
        resolve()
      })

      socket1.emit(`joinRoom`, {
        roomName: 'room4',
        playerName: 'Nobita'
      }, (value1) => {
        socket2.emit(`joinRoom`, {
          roomName: 'room4',
          playerName: 'Dekisugi'
        }, (value2) => {
          socket1.emit(`setPlayerScore`, {
            player: 'Nobita',
            room: 'room4',
            hit: '10',
            miss: '1'
          });
          socket1.emit(`setPlayerScore`, {
            player: 'Dekisugi',
            room: 'room4',
            hit: '1',
            miss: '1'
          });
        });
      })
    })
  });

  test('set player score test, player 2 hit 10 times, player 2 win', () => {
    return new Promise((resolve, reject) => {
      socket1.on('isGameFinished', (winnerObject) => {
        try {
          expect(winnerObject.winner).toEqual('Dekisugi');
        } catch (err) {
          reject(err)
        }
        resolve()
      })

      socket1.emit(`joinRoom`, {
        roomName: 'room5',
        playerName: 'Nobita'
      }, (value1) => {
        socket2.emit(`joinRoom`, {
          roomName: 'room5',
          playerName: 'Dekisugi'
        }, (value2) => {
          socket1.emit(`setPlayerScore`, {
            player: 'Nobita',
            room: 'room5',
            hit: '1',
            miss: '1'
          });
          socket1.emit(`setPlayerScore`, {
            player: 'Dekisugi',
            room: 'room5',
            hit: '10',
            miss: '1'
          });
        });
      })
    })
  });

  test('one user joined a room, callback parameter should be true', () => {
    return new Promise((resolve, reject) => {
      socket1.on('listRoom', (rooms) => {
        try {
          expect(rooms[0].name).toEqual('room6')
        } catch (err) {
          reject(err)
        }
        resolve()
      })

      socket1.emit(`joinRoom`, {
        roomName: 'room6',
        playerName: 'playerName'
      }, (value) => {
        expect(value).toEqual(true);
      })

    })
  });

  test('two user joined a room, both user callback parameter should be true', () => {
    return new Promise((resolve, reject) => {
      socket1.on('listRoom', (rooms) => {
        try {
          expect(rooms[0].name).toEqual('room1')
        } catch (err) {
          reject(err)
        }
        socket2.on('listRoom', (rooms) => {
          try {
            expect(rooms[0].name).toEqual('room1')
          } catch (err) {
            reject(err)
          }
          resolve()
        });
      });

      socket1.emit(`joinRoom`, {
        roomName: 'room1',
        playerName: 'Nobita'
      }, (value) => {
        expect(value).toEqual(true);
      });

      socket2.emit(`joinRoom`, {
        roomName: 'room1',
        playerName: 'Dekisugi'
      }, (value) => {
        expect(value).toEqual(true);
      });
    })
  });

  test('three user joined a room, third user callback parameter should be false', () => {
    return new Promise((resolve, reject) => {
      socket1.on('listRoom', (rooms) => {
        try {
          expect(rooms[0].name).toEqual('room1')
        } catch (err) {
          reject(err)
        }
        socket2.on('listRoom', (rooms) => {
          try {
            expect(rooms[0].name).toEqual('room1')
          } catch (err) {
            reject(err)
          }
          socket3.on('listRoom', (rooms) => {
            try {
              expect(rooms[0].name).toEqual('room1')
            } catch (err) {
              reject(err)
            }
            resolve()
          });
        });
      });

      socket1.emit(`joinRoom`, {
        roomName: 'room1',
        playerName: 'Nobita'
      }, (value) => {
        expect(value).toEqual(true);
      });

      socket2.emit(`joinRoom`, {
        roomName: 'room1',
        playerName: 'Dekisugi'
      }, (value) => {
        expect(value).toEqual(true);
      });

      socket2.emit(`joinRoom`, {
        roomName: 'room1',
        playerName: 'Dekisugi'
      }, (value) => {
        expect(value).toEqual(true);
      });
    })
  });

  test('listRoom test', () => {
    
    return new Promise((resolve, reject) => {
      socket1.on('listRoom', (rooms) => {
        try {
          console.log({rooms});
          expect(rooms[0].name).toEqual('toto')
          resolve()
        } catch (err) {
          reject(err)
        }
      })
      appRoom['room6'] = {
        name: 'room6'
      }
      socket1.emit(`joinRoom`, {playerName: 'joni', roomName: 'toto'}, function (val) {
        if (val) {
          socket1.emit(`checkRoom`);
        }
      })
  
    });
  });
});

