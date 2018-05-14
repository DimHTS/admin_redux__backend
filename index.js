var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");

var jwt = require('jsonwebtoken');

var app = express();
var cors = require('cors');  // позволяет конектиться с удаленного сервера

var jsonParser = bodyParser.json();

app.use(cors());
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache'); //запрет на кеширование данных
  next();
});



app.get("/", function (req, res) {
  res.send('Dim heroku example - admin_redux__backend');
});



//AUTHENTICATION
app.post("/api/authentication", jsonParser, function (req, res) {

  if (!req.body) return res.sendStatus(500);

  if (req.body.login == 'admin') {
    return token();
  } else {
    return res.sendStatus(500);
  }

  function token() {
    var userID = 22;
    var userName = 'admin';
    var token = jwt.sign({ userID, userName }, 'my_secret_key');
    fs.writeFileSync("./api/token.txt", token)
    return res.send(token)
  }

});


function ensureToken(req, res, next) {

  next();

  // var tokenReq = String(req.headers["authorization"]);
  // var tokenSaved = String(fs.readFileSync("./api/token.txt", "utf8"));
  // if (tokenReq === tokenSaved) {
  //   next();
  // } else {
  //   res.sendStatus(403);
  // }
}

//END AUTHENTICATION






// USERS

var urlUsers = "./api/usersData.json";

app.get("/api/users", ensureToken, function (req, res) {
  var data = fs.readFileSync(urlUsers, "utf8");
  var users = JSON.parse(data);
  res.send(users);
});

// добавление пользователя
app.post("/api/users", ensureToken, jsonParser, function (req, res) {

  if (!req.body) return res.sendStatus(500);

  var data = fs.readFileSync(urlUsers, "utf8");
  var users = JSON.parse(data);

  //проверяем логин на совпадение
  for (var i = 0; i < users.length; i++) {
    if (users[i].login == req.body.login) {
      return res.send('loginNotFree');
    }
  }

  var user = {
    login: req.body.login,
    name: req.body.name,
    privilegien: req.body.privilegien,
    password: req.body.password
  };

  // находим максимальный id
  var id = Math.max.apply(Math, users.map(function (o) { return o.id; }))
  // увеличиваем его на единицу
  user.id = id + 1;
  // добавляем пользователя в массив
  users.push(user);
  var data = JSON.stringify(users);
  // перезаписываем файл с новыми данными
  fs.writeFileSync(urlUsers, data);
  delete user.password;
  res.send(user);
});


// изменение пользователя
app.put("/api/users", ensureToken, jsonParser, function (req, res) {

  if (!req.body) return res.sendStatus(500);

  var userId = req.body.id;
  var userName = req.body.name;
  var userPrivilegien = req.body.privilegien;

  var data = fs.readFileSync(urlUsers, "utf8");
  var users = JSON.parse(data);
  var user;
  for (var i = 0; i < users.length; i++) {
    if (users[i].id == userId) {
      user = users[i];
      break;
    }
  }
  // изменяем данные у пользователя
  if (user) {
    user.name = userName;
    user.privilegien = userPrivilegien;
    var data = JSON.stringify(users);
    fs.writeFileSync(urlUsers, data);
    res.send(user);
  }
  else {
    res.sendStatus(500);
  }
});

// удаление пользователя по id
app.delete("/api/users/:id", ensureToken, function (req, res) {

  if (!req.body) return res.sendStatus(500);

  var userId = req.params.id;
  var data = fs.readFileSync(urlUsers, "utf8");
  var users = JSON.parse(data);
  var index = -1;
  // находим индекс пользователя в массиве
  for (var i = 0; i < users.length; i++) {
    if (users[i].id == userId) {
      index = i;
      break;
    }
  }
  if (index > -1) {
    // удаляем пользователя из массива по индексу
    var user = users.splice(index, 1)[0];
    var data = JSON.stringify(users);
    fs.writeFileSync(urlUsers, data);
    // отправляем id удаленного пользователя
    res.send(userId);
  }
  else {
    res.sendStatus(500);
  }
});

//END USERS





// PAGES
var urlPages = "./api/pagesData.json";

app.get("/api/pages", ensureToken, function (req, res) {
  var data = fs.readFileSync(urlPages, "utf8");
  var pages = JSON.parse(data);
  setTimeout(() => {
    res.send(pages);
  }, 800)
});

// добавление страницы
app.post("/api/pages", ensureToken, jsonParser, function (req, res) {

  if (!req.body) return res.sendStatus(500);

  var data = fs.readFileSync(urlPages, "utf8");
  var pages = JSON.parse(data);

  //проверяем логин на совпадение
  for (var i = 0; i < pages.length; i++) {
    if (pages[i].alias == req.body.alias) {
      return res.send('aliasNotFree');
    }
  }

  var page = {
    name: req.body.name,
    alias: req.body.alias,
    text: req.body.text
  };


  var id = Math.max.apply(Math, pages.map(function (o) { return o.id; }))
  page.id = id + 1;
  pages.push(page);
  var data = JSON.stringify(pages);
  // перезаписываем файл с новыми данными
  fs.writeFileSync(urlPages, data);
  res.send(page);
});




// изменение страницы
app.put("/api/pages", ensureToken, jsonParser, function (req, res) {

  if (!req.body) return res.sendStatus(500);

  var pageId = req.body.id;
  var pageName = req.body.name;
  var pageText = req.body.text;

  var data = fs.readFileSync(urlPages, "utf8");
  var pages = JSON.parse(data);
  var page;
  for (var i = 0; i < pages.length; i++) {
    if (pages[i].id == pageId) {
      page = pages[i];
      break;
    }
  }
  // изменяем данные страницы
  if (page) {
    page.name = pageName;
    page.text = pageText;
    var data = JSON.stringify(pages);
    fs.writeFileSync(urlPages, data);
    res.send(page);
  }
  else {
    res.sendStatus(500);
  }
});



// удаление страницы по id
app.delete("/api/pages/:id", ensureToken, function (req, res) {

  if (!req.body) return res.sendStatus(500);

  var pageId = req.params.id;
  var data = fs.readFileSync(urlPages, "utf8");
  var pages = JSON.parse(data);
  var index = -1;
  // находим индекс страницы в массиве
  for (var i = 0; i < pages.length; i++) {
    if (pages[i].id == pageId) {
      index = i;
      break;
    }
  }
  if (index > -1) {
    // удаляем страницу из массива по индексу
    var page = pages.splice(index, 1)[0];
    var data = JSON.stringify(pages);
    fs.writeFileSync(urlPages, data);
    // отправляем id удаленной страницы
    res.send(pageId);
  }
  else {
    res.sendStatus(500);
  }
});

//END PAGES


var port = process.env.PORT || 5000;
app.listen(port, function () {
  console.log("Listening on " + port);
});
