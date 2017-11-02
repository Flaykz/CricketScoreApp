#!/usr/bin/env nodejs
var express = require('express');
var fs = require('fs');
var app = express();
var morgan = require("morgan");
var path = require('path');
var compression = require("compression");
//var zlib = require("zlib");

app.set('views', './views');
app.set('view engine', 'jade');

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});

app.use(morgan(':date[clf] :remote-addr ":method :url HTTP/:http-version" :status :req[header] :response-time ms ":referrer" - ":user-agent"', {stream: accessLogStream}));
app.use(compression());
app.use(express.static(path.join(__dirname)));
app.use("/styles", express.static(__dirname + '/styles'));
app.use("/images", express.static(__dirname + '/images', {maxAge: 86400000}));
//app.use("/controllers", express.static(__dirname + '/controllers'));
//app.use("/models", express.static(__dirname + '/models'));

fs.readdirSync('./controllers').forEach(function (file) {
  if (file.substr(-3) == '.js') {
    route = require('./controllers/' + file);
    route.controller(app);
  }
});

app.listen(8080,"localhost");