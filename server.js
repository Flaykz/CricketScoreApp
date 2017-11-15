#!/usr/bin/env nodejs
var express = require('express');
var fs = require('fs');
var app = express();
// var morgan = require("morgan");
var path = require('path');
var compression = require("compression");
var helmet = require('helmet');
var winston = require('winston');
require('winston-loggly-bulk');

var config = require('./config.js').get(process.env.NODE_ENV);

winston.add(winston.transports.Loggly, {
  inputToken: "e8197590-688f-4378-85fb-e440ddee9c6a",
  subdomain: "flaykz",
  tags: config.title,
  json: true
});

app.set('views', './views');
app.set('view engine', 'jade');

// var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});
// app.use(morgan(':date[clf] :remote-addr ":method :url HTTP/:http-version" :status :req[header] :response-time ms ":referrer" - ":user-agent"', {stream: accessLogStream}));
app.use(compression());
app.use(helmet());
app.use(express.static(path.join(__dirname)));
app.use("/styles", express.static(__dirname + '/styles'));
app.use("/images", express.static(__dirname + '/images', {maxAge: 86400000}));

fs.readdirSync('./controllers').forEach(function (file) {
  if (file.substr(-3) == '.js') {
    var route = require('./controllers/' + file);
    route.controller(app);
  }
});

winston.log("Lancement de l'application en environement de " + process.env.NODE_ENV + " sur le port : " + config.PORT);
app.listen(config.PORT,"localhost");