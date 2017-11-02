var mcache = require("memory-cache");

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
        res.render('home', {
            title: 'CricketScoreApp',
            pageData: {item: ['', '=', '20', '19', '18', '17', '16', '15', 'Bull'], name: ['', 'Joueur_1']}
        });
    });
}