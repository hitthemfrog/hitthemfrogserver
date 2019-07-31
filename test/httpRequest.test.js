const request = require('supertest');
const fs = require('fs');
const {
  http
} = require('../app')

afterAll((done) => {
  fs.unlinkSync('public/test-image.png')
  http.close(() => {
    console.log('exit server')
    done()
  })
});

describe('Http request test suit', function () {
  test('upload image test', (done) => {
    request(http)
      .post('/uploadImage')
      .field('username', 'test-image')
      .attach('image', `${__dirname}/image/1024px-Octicons-mark-github.svg.png`)
      .then((response) => {
        expect(response.body).toEqual(true);
        done();
      })
      .catch((err) => {
        console.log(err);
      });
  });

  test('request to /, get', (done) => {
    request(http)
      .get('/')
      .then((response) => {
        expect(response.body).toEqual('hello hit them frog');
        done();
      })
      .catch((err) => {
        console.log(err);
      });
  });

  test('upload image with same username test, matcher result should equal to username exists', (done) => {
    request(http)
      .post('/uploadImage')
      .field('username', 'test-image')
      .attach('image', `${__dirname}/image/1024px-Octicons-mark-github.svg.png`)
      .then((response) => {
        expect(response.body).toEqual(true);
        request(http)
          .post('/uploadImage')
          .field('username', 'test-image')
          .attach('image', `${__dirname}/image/1024px-Octicons-mark-github.svg.png`)
          .then((response) => {
          })
          .catch((err) => {
          });
      })
      .catch((err) => {
        expect(err.matcherResult.actual).toEqual('username exists')
        done();
      });
  });
});