var express = require('express');
var fs = require('fs');
var app = express();
var path = require('path');

app.set('views', './views');
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname)));
app.use("/styles", express.static(__dirname + '/styles'));
app.use("/images", express.static(__dirname + '/images'));
//app.use("/controllers", express.static(__dirname + '/controllers'));
//app.use("/models", express.static(__dirname + '/models'));

fs.readdirSync('./controllers').forEach(function (file) {
  if (file.substr(-3) == '.js') {
    route = require('./controllers/' + file);
    route.controller(app);
  }
});

app.listen(8080);