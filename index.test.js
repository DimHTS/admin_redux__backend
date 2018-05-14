var request = require("supertest");
// var express = require("express");

var server = request.agent('http://localhost:3002');

// var app = require("./server").app;      <<<===
// it('get users', function (done) {  
//   request(app)                          <<<===
//     .get("/api/users")
//     .expect('Content-Type', /json/)
//     .end(done)
// });



// USERS
describe('USERS', function () {

  var userIdDescribe;
  var userLoginDescribe = 'asdadadaadsa';


  it('get users', function (done) {

    server
      .get("/api/users")
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      })
  });



  it('add user', function (done) {

    server
      .post("/api/users")
      .send({
        login: userLoginDescribe,
        name: 'Иванов',
        privilegien: 'administrator',
        password: '1312'
      })
      .expect(200)
      .expect(function (res) {
        userIdDescribe = res.body.id
      })
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      })
  });



  it('loginNotFree for __ add user', function (done) {

    server
      .post("/api/users")
      .send({
        login: userLoginDescribe,
        name: 'Иванов',
        privilegien: 'administrator',
        password: '1312'
      })
      .expect(200)
      .expect('loginNotFree')
      .end(function (err, res) {
        if (err) return done(err);
        done();
      })
  });



  it('put user', function (done) {

    server
      .put("/api/users")
      .send({
        id: userIdDescribe,
        name: 'asssas',
        privilegien: 'user'
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      })
  });



  it('delete user', function (done) {

    server
      .del("/api/users/" + userIdDescribe)
      .expect(String(userIdDescribe))
      .end(function (err, res) {
        if (err) return done(err);
        done();
      })
  });

});
//END USERS





// PAGES
describe('PAGES', function () {

  var pageIdDescribe;
  var pageAliasDescribe = 'kak_vishivat_krestikom';


  it('get pages :::  КОСЯК - если setTimeout использовать на сервере, то тесты выдадут ошибку(не нашел решение проблемы, возможно его нет для SuperTest)', function (done) {

    server
      .get("/api/pages")
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      })
  });



  it('add page', function (done) {

    server
      .post("/api/pages")
      .send({
        alias: pageAliasDescribe,
        name: 'Как вышивать крестиком?',
        text: 'Для того чтобы научиться вышывать крестиком, необходимо для начала взять в руки иглу.'
      })
      .expect(200)
      .expect(function (res) {
        pageIdDescribe = res.body.id
      })
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      })
  });



  it('loginNotFree for __ add page', function (done) {

    server
      .post("/api/pages")
      .send({
        alias: pageAliasDescribe,
        name: 'Как вышивать крестиком?',
        text: 'Для того чтобы научиться вышывать крестиком, необходимо для начала взять в руки иглу.'
      })
      .expect(200)
      .expect('aliasNotFree')
      .end(function (err, res) {
        if (err) return done(err);
        done();
      })
  });



  it('put page', function (done) {

    server
      .put("/api/pages")
      .send({
        id: pageIdDescribe,
        name: 'Новое имя статьи.',
        text: 'Лорен Ipsum бла бла бла...'
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      })
  });



  it('delete page', function (done) {

    server
      .del("/api/pages/" + pageIdDescribe)
      .expect(String(pageIdDescribe))
      .end(function (err, res) {
        if (err) return done(err);
        done();
      })
  });

});


//END PAGES