var config = require('../config.js').get(process.env.NODE_ENV);

module.exports.controller = function(app) {
  // viewed at based directory http://localhost:8080/
  app.get('/', function (req, res) {
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
          pageData: {item: config.item, name: params, colour: config.colour}
        });
      }
      else {
        res.render('home', {
          title: config.title,
          pageData: {item: config.item, name: config.name, colour: config.colour}
        });
      }
    }
    else {
      res.render('home', {
        title: config.title,
        pageData: {item: config.item, name: config.name, colour: config.colour}
      });
    }
  });
}