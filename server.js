#!/usr/bin/env nodejs

var express = require('express');
var fs = require('fs');
var app = express();
var path = require('path');
var compression = require("compression");
var helmet = require('helmet');

var config = require('./config.js').get(process.env.NODE_ENV);

app.set('views', './views');
app.set('view engine', 'jade');

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

function walkDir(path) {
  fs.readdirSync('.' + path).forEach(function(file) {
    if (fs.lstatSync('.' + path + '/' + file).isDirectory()) {
      walkDir(path + '/' + file);
    }
    else {
      listFilesToCache.push(path + '/' + file);
    }
  });
}

var listFilesToCache = [];
var listPath = ['/images', '/models', '/styles', '/js', '/views', '/controllers'];
for (let path of listPath) {
  walkDir(path);
}

var urlsToCacheInSw = [
  '/',
  '/favicon.png',
  '/offline.appcache',
  'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
  'https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js',
  'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment-with-locales.min.js',
];

listFilesToCache = [listFilesToCache, ...urlsToCacheInSw];

var listFiles = listFilesToCache.toString().replace(/,/g, "',\r\n\t'");
var listFiles = "[\r\n\t'" + listFiles + "'\r\n]";

var data = fs.readFileSync('sw.js', 'utf-8');
var newValue = data.replace(/(var urlsToCache = )(\[\n(?:.*\n)*\])(;)/g, '$1' + listFiles + '$3');
fs.writeFileSync('sw.js', newValue, 'utf-8');

app.listen(config.PORT,"localhost");