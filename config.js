var config = {
    cricket: {
        "PORT": 8087,
        "title": "CricketScore",
        "colour": ['#ffff00', '#00ff00', '#00ffff', '#0000ff'],
        "item": ['', '=', '20', '19', '18', '17', '16', '15', 'Bull'],
        "name": ['', 'Joueur_1', 'Joueur_2', 'Joueur_3', 'Joueur_4']
    },
    cricketv2: {
        "PORT": 8088,
        "title": "CricketV2",
        "colour": ['#ffff00', '#00ff00', '#00ffff', '#0000ff'],
        "item": ['', '=', '20', '19', '18', '17', '16', '15', 'Bull'],
        "name": ['', 'Joueur_1', 'Joueur_2', 'Joueur_3', 'Joueur_4']
    },
    dev: {
        "PORT": 8080,
        "title": "CricketV2",
        "colour": ['#ffff00', '#00ff00', '#00ffff', '#0000ff'],
        "item": ['', '=', '20', '19', '18', '17', '16', '15', 'Bull'],
        "name": ['', 'Joueur_1', 'Joueur_2', 'Joueur_3', 'Joueur_4']
    },
    default: {
        "PORT": 8080,
        "title": "CricketScore",
        "colour": ['#ffff00', '#00ff00', '#00ffff', '#0000ff'],
        "item": ['', '=', '20', '19', '18', '17', '16', '15', 'Bull'],
        "name": ['', 'Joueur_1', 'Joueur_2', 'Joueur_3', 'Joueur_4']
    }
}

exports.get = function get(env) {
    return config[env] || config.default;
}