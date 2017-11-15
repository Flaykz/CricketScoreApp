var config = {
    production: {
        "PORT": 8087,
        "title": "Cricket",
        "item": ['', '=', '20', '19', '18', '17', '16', '15', 'Bull'],
        "name": ['', 'Joueur_1']
    },
    default: {
        "PORT": 8080,
        "title": "dev",
        "item": ['', '=', '20', '19', '18', '17', '16', '15', 'Bull'],
        "name": ['', 'Joueur_1']
    }
}

exports.get = function get(env) {
    return config[env] || config.default;
}