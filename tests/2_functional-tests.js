const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

let Translator = require('../components/translator.js');

suite('Functional Tests', () => {
  test('Test POST /api/translate with text and locale fields', function(done) {
    chai.request(server)
    .keepOpen()
    .post('/api/translate')
    .send({
      text: "To play hooky means to skip class or work.",
      locale: 'american-to-british'
    })
    .end(function(err, res){
      assert.equal(res.status, 200);
      assert.isObject(res.body, 'response should be an object');
      assert.property(res.body, 'translation', 'returned object should contain translation');
      assert.equal(res.body.translation, `To <span class="highlight">bunk off</span> means to skip class or work.`);
      done();
    });
  });
  test('Test POST /api/translate with text and invalid locale field', function(done) {
    chai.request(server)
    .keepOpen()
    .post('/api/translate')
    .send({
      text: 'I like chips',
      locale: 'chinese-to-russian'
    })
    .end(function(err, res){
      assert.equal(res.status, 200);
      assert.isObject(res.body, 'response should be an object');
      assert.property(res.body, 'error', 'returned object should contain error');
      assert.equal(res.body.error, 'Invalid value for locale field');
      done();
    });
  });
  test('Test POST /api/translate with missing text field', function(done) {
    chai.request(server)
    .keepOpen()
    .post('/api/translate')
    .send({
      locale: 'british-to-american'
    })
    .end(function(err, res){
      assert.equal(res.status, 200);
      assert.isObject(res.body, 'response should be an object');
      assert.property(res.body, 'error', 'returned object should contain error');
      assert.equal(res.body.error, 'Required field(s) missing');
      done();
    });
  });
  test('Test POST /api/translate with missing locale field', function(done) {
    chai.request(server)
    .keepOpen()
    .post('/api/translate')
    .send({
      text: 'Dr. Grosh will see you now.'
    })
    .end(function(err, res){
      assert.equal(res.status, 200);
      assert.isObject(res.body, 'response should be an object');
      assert.property(res.body, 'error', 'returned object should contain error');
      assert.equal(res.body.error, 'Required field(s) missing');
      done();
    });
  });
  test('Test POST /api/translate with empty text', function(done) {
    chai.request(server)
    .keepOpen()
    .post('/api/translate')
    .send({
      text: '         ',
      locale: 'british-to-american'

    })
    .end(function(err, res){
      assert.equal(res.status, 200);
      assert.isObject(res.body, 'response should be an object');
      assert.property(res.body, 'error', 'returned object should contain error');
      assert.equal(res.body.error, 'No text to translate');
      done();
    });
  });
  test('Test POST /api/translate with text that needs no translation', function(done) {
    chai.request(server)
    .keepOpen()
    .post('/api/translate')
    .send({
      text: 'Paracetamol takes up to an hour to work.',
      locale: 'american-to-british'

    })
    .end(function(err, res){
      assert.equal(res.status, 200);
      assert.isObject(res.body, 'response should be an object');
      assert.property(res.body, 'translation', 'returned object should contain translation');
      assert.equal(res.body.translation, 'Everything looks good to me!');
      done();
    });
  });
});
