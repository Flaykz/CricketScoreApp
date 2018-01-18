var mcache = require("memory-cache");
var config = require('../config.js').get(process.env.NODE_ENV);

var cache = (duration) => {
  return (req, res, next) => {
    let key = '__express__' + req.originalUrl || req.url
    let cachedBody = mcache.get(key)
    if (cachedBody) {
      res.send(cachedBody)
      return
    } else {
      res.sendResponse = res.send
      res.send = (body) => {
        mcache.put(key, body, duration * 1000);
        res.sendResponse(body)
      }
      next()
    }
  }
}

module.exports.controller = function(app) {
  // viewed at based directory http://localhost:8080/
  app.get('/', cache(10), function (req, res) {
    var len = Object.keys(req.query).length;
    if (len > 0) {
      var params = [];
      params.push("");
      for (var i = 1; i < len + 1; i++) {
        if (req.query["p" + i] != "") {
          params.push(req.query["p" + i]);
        } 
      }
      if (params.length > 0) {
        res.render('home', {
          title: config.title,
          pageData: {item: config.item, name: params}
        });
      }
      else {
        res.render('home', {
          title: config.title,
          pageData: {item: config.item, name: config.name}
        });
      }
    }
    else {
      res.render('home', {
        title: config.title,
        pageData: {item: config.item, name: config.name}
      });
    }
  });
}