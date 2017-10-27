module.exports.controller = function(app) {
    // add other routes below
    app.get('/about', function (req, res) {
        //res.sendFile(path.join(__dirname + 'views/about.html'));
        res.render('about', {
            title: 'About CricketScoreApp'
        });
    });
    
    // viewed at based directory http://localhost:8080/
    app.get('/', function (req, res) {
        res.render('home', {
            title: 'CricketScoreApp',
            pageData: {item: ['', '=', '20', '19', '18', '17', '16', '15', 'Bull'], name: ['', 'Joueur_1']}
        });
    });
}