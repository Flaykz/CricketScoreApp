$(function() {
    init();
    
    $('#show').click(function() {
        $('#menu').collapse('toggle');
    })
    
    $('#addPlayer').click(function() {
        var tabScore = getTabScore();
        var nbJoueur = getNbJoueur();
        var indexJoueur = nbJoueur; 
        nbJoueur = nbJoueur + 1;
        var chaine = "Joueur_" + nbJoueur;
        var monJoueur = new Joueur(chaine, [0], [0], [0], [0], [0], [0], [0], [0]);
        tabScore[chaine] = monJoueur;
        setTabScore(tabScore);
        setNbJoueur(nbJoueur);
        
        var temp = "tbody tr th:eq(" + indexJoueur + ")";
        var data = $(temp).clone(true).insertAfter(temp);
        data.find("input").val(chaine);
        data.find("input").attr("name", chaine);
        data.find("input").attr("value", chaine);
        indexJoueur = indexJoueur - 1;
        
        for (var i = 0; i < 9; i++) {
            var temp = "tbody tr:eq(" + i + ") td:eq(" + indexJoueur + ")";
            var data = $(temp).clone(true).insertAfter(temp);
            data.find("button").attr("idcolumn", chaine);
            data.find("h1").attr("id", chaine);
        }
    })
    
    $('#deletePlayer').click(function() {
        var nbJoueur = getNbJoueur();
        var chaine = "Joueur_" + nbJoueur;
        var tabScore = getTabScore();
        if (nbJoueur > 1) {
            var temp = "tbody tr th:eq(" + nbJoueur + ")";
            var data = $(temp).remove();
            nbJoueur = nbJoueur - 1;
            for (var i = 0; i < 9; i++) {
                var temp = "tbody tr:eq(" + i + ") td:eq(" + nbJoueur + ")";
                var data = $(temp).remove();
            }
            setNbJoueur(nbJoueur);
            delete tabScore[chaine];
            setTabScore(tabScore);
        }
        else {
            alert("Sorry!! Can't remove first player!");
            console.log(nbJoueur);
        }
    })
    
    $("input").change(function() {
        var name = $(this).attr("name");
        var value = $(this).val();
        $(this).attr("value", value);
        var tabScore = getTabScore();
        tabScore[name].nom = value;
        setTabScore(tabScore);
        console.log(name + " : " + value);
    })
    
    $('.case').click(function() {
        var point = 0;
        switch ($(this).children().attr("src")) {
            case "/images/0.svg":
                $(this).children().attr("src", "/images/1.svg");
                point = 1;
                break;
            case "/images/1.svg":
                $(this).children().attr("src", "/images/2.svg");
                point = 2;
                break;
            case "/images/2.svg":
                $(this).children().attr("src", "/images/3.svg");
                point = 3;
                break;
            default:
                $(this).children().attr("src", "/images/3.svg");
                point = 0;
        }
        var idRow = $(this).attr("idrow");
        var idColumn = $(this).attr("idcolumn");
        updateScore(idRow, idColumn, point);
    })
});

function init() {
    var monJoueur = new Joueur("Joueur_1", [0], [0], [0], [0], [0], [0], [0], [0]);
    var tabScore = {"Joueur_1": monJoueur};
    setTabScore(tabScore);
    setNbJoueur("1");
}

function Joueur(nom, score, s20, s19, s18, s17, s16, s15, sbull) {
    this.nom = nom;
    this.score = score;
    this.s20 = s20;
    this.s19 = s19;
    this.s18 = s18;
    this.s17 = s17;
    this.s16 = s16;
    this.s15 = s15;
    this.sbull = sbull;
    this.rewind = rewind;
}

function rewind() {
    this.score = this.score.pop();
    this.s20 = this.s20.pop();
    this.s19 = this.s19.pop();
    this.s18 = this.s18.pop();
    this.s17 = this.s17.pop();
    this.s16 = this.s16.pop();
    this.s15 = this.s15.pop();
    this.sbull = this.sbull.pop();
}

function getTabScore() {
    var tabScore = JSON.parse(localStorage.getItem("tabScore"));
    return tabScore;
}

function getNbJoueur() {
    var nbJoueur = parseInt(localStorage.getItem("nbJoueur"), 10);
    return nbJoueur;
}

function setTabScore(tabScore) {
    localStorage.setItem("tabScore", JSON.stringify(tabScore));
}

function setNbJoueur(nbJoueur) {
    localStorage.setItem("nbJoueur", nbJoueur);
}

function updateScore(idRow, idColumn, point) {
    console.log(idRow + " " + idColumn + " " + point);
    var tabScore = getTabScore();
    for (var joueur in tabScore) {
        if (point != 0) {
            if (joueur == idColumn) {
                switch (idRow) {
                    case "20":
                        tabScore[joueur].s20.push(point);
                        tabScore[joueur].s19.push(tabScore[joueur].s19[tabScore[joueur].s19.length-1]);
                        tabScore[joueur].s18.push(tabScore[joueur].s18[tabScore[joueur].s18.length-1]);
                        tabScore[joueur].s17.push(tabScore[joueur].s17[tabScore[joueur].s17.length-1]);
                        tabScore[joueur].s16.push(tabScore[joueur].s16[tabScore[joueur].s16.length-1]);
                        tabScore[joueur].s15.push(tabScore[joueur].s15[tabScore[joueur].s15.length-1]);
                        tabScore[joueur].sbull.push(tabScore[joueur].sbull[tabScore[joueur].sbull.length-1]);
                        tabScore[joueur].score.push(tabScore[joueur].score[tabScore[joueur].score.length-1]);
                        break;
                    case "19":
                        tabScore[joueur].s20.push(tabScore[joueur].s20[tabScore[joueur].s20.length-1]);
                        tabScore[joueur].s19.push(point);
                        tabScore[joueur].s18.push(tabScore[joueur].s18[tabScore[joueur].s18.length-1]);
                        tabScore[joueur].s17.push(tabScore[joueur].s17[tabScore[joueur].s17.length-1]);
                        tabScore[joueur].s16.push(tabScore[joueur].s16[tabScore[joueur].s16.length-1]);
                        tabScore[joueur].s15.push(tabScore[joueur].s15[tabScore[joueur].s15.length-1]);
                        tabScore[joueur].sbull.push(tabScore[joueur].sbull[tabScore[joueur].sbull.length-1]);
                        tabScore[joueur].score.push(tabScore[joueur].score[tabScore[joueur].score.length-1]);
                        break;
                    case "18":
                        tabScore[joueur].s20.push(tabScore[joueur].s20[tabScore[joueur].s20.length-1]);
                        tabScore[joueur].s19.push(tabScore[joueur].s19[tabScore[joueur].s19.length-1]);
                        tabScore[joueur].s18.push(point);
                        tabScore[joueur].s17.push(tabScore[joueur].s17[tabScore[joueur].s17.length-1]);
                        tabScore[joueur].s16.push(tabScore[joueur].s16[tabScore[joueur].s16.length-1]);
                        tabScore[joueur].s15.push(tabScore[joueur].s15[tabScore[joueur].s15.length-1]);
                        tabScore[joueur].sbull.push(tabScore[joueur].sbull[tabScore[joueur].sbull.length-1]);
                        tabScore[joueur].score.push(tabScore[joueur].score[tabScore[joueur].score.length-1]);
                        break;
                    case "17":
                        tabScore[joueur].s20.push(tabScore[joueur].s20[tabScore[joueur].s20.length-1]);
                        tabScore[joueur].s19.push(tabScore[joueur].s19[tabScore[joueur].s19.length-1]);
                        tabScore[joueur].s18.push(tabScore[joueur].s18[tabScore[joueur].s18.length-1]);
                        tabScore[joueur].s17.push(point);
                        tabScore[joueur].s16.push(tabScore[joueur].s16[tabScore[joueur].s16.length-1]);
                        tabScore[joueur].s15.push(tabScore[joueur].s15[tabScore[joueur].s15.length-1]);
                        tabScore[joueur].sbull.push(tabScore[joueur].sbull[tabScore[joueur].sbull.length-1]);
                        tabScore[joueur].score.push(tabScore[joueur].score[tabScore[joueur].score.length-1]);
                        break;
                    case "16":
                        tabScore[joueur].s20.push(tabScore[joueur].s20[tabScore[joueur].s20.length-1]);
                        tabScore[joueur].s19.push(tabScore[joueur].s19[tabScore[joueur].s19.length-1]);
                        tabScore[joueur].s18.push(tabScore[joueur].s18[tabScore[joueur].s18.length-1]);
                        tabScore[joueur].s17.push(tabScore[joueur].s17[tabScore[joueur].s17.length-1]);
                        tabScore[joueur].s16.push(point);
                        tabScore[joueur].s15.push(tabScore[joueur].s15[tabScore[joueur].s15.length-1]);
                        tabScore[joueur].sbull.push(tabScore[joueur].sbull[tabScore[joueur].sbull.length-1]);
                        tabScore[joueur].score.push(tabScore[joueur].score[tabScore[joueur].score.length-1]);
                        break;
                    case "15":
                        tabScore[joueur].s20.push(tabScore[joueur].s20[tabScore[joueur].s20.length-1]);
                        tabScore[joueur].s19.push(tabScore[joueur].s19[tabScore[joueur].s19.length-1]);
                        tabScore[joueur].s18.push(tabScore[joueur].s18[tabScore[joueur].s18.length-1]);
                        tabScore[joueur].s17.push(tabScore[joueur].s17[tabScore[joueur].s17.length-1]);
                        tabScore[joueur].s16.push(tabScore[joueur].s16[tabScore[joueur].s16.length-1]);
                        tabScore[joueur].s15.push(point);
                        tabScore[joueur].sbull.push(tabScore[joueur].sbull[tabScore[joueur].sbull.length-1]);
                        tabScore[joueur].score.push(tabScore[joueur].score[tabScore[joueur].score.length-1]);
                        break;
                    case "bull":
                        tabScore[joueur].s20.push(tabScore[joueur].s20[tabScore[joueur].s20.length-1]);
                        tabScore[joueur].s19.push(tabScore[joueur].s19[tabScore[joueur].s19.length-1]);
                        tabScore[joueur].s18.push(tabScore[joueur].s18[tabScore[joueur].s18.length-1]);
                        tabScore[joueur].s17.push(tabScore[joueur].s17[tabScore[joueur].s17.length-1]);
                        tabScore[joueur].s16.push(tabScore[joueur].s16[tabScore[joueur].s16.length-1]);
                        tabScore[joueur].s15.push(tabScore[joueur].s15[tabScore[joueur].s15.length-1]);
                        tabScore[joueur].sbull.push(point);
                        tabScore[joueur].score.push(tabScore[joueur].score[tabScore[joueur].score.length-1]);
                        break;
                    default:
                        //
                }
            }
            else {
                tabScore[joueur].s20.push(tabScore[joueur].s20[tabScore[joueur].s20.length-1]);
                tabScore[joueur].s19.push(tabScore[joueur].s19[tabScore[joueur].s19.length-1]);
                tabScore[joueur].s18.push(tabScore[joueur].s18[tabScore[joueur].s18.length-1]);
                tabScore[joueur].s17.push(tabScore[joueur].s17[tabScore[joueur].s17.length-1]);
                tabScore[joueur].s16.push(tabScore[joueur].s16[tabScore[joueur].s16.length-1]);
                tabScore[joueur].s15.push(tabScore[joueur].s15[tabScore[joueur].s15.length-1]);
                tabScore[joueur].sbull.push(tabScore[joueur].sbull[tabScore[joueur].sbull.length-1]);
                tabScore[joueur].score.push(tabScore[joueur].score[tabScore[joueur].score.length-1]);
            }
        }
        else {
            tabScore[joueur].s20.push(tabScore[joueur].s20[tabScore[joueur].s20.length-1]);
            tabScore[joueur].s19.push(tabScore[joueur].s19[tabScore[joueur].s19.length-1]);
            tabScore[joueur].s18.push(tabScore[joueur].s18[tabScore[joueur].s18.length-1]);
            tabScore[joueur].s17.push(tabScore[joueur].s17[tabScore[joueur].s17.length-1]);
            tabScore[joueur].s16.push(tabScore[joueur].s16[tabScore[joueur].s16.length-1]);
            tabScore[joueur].s15.push(tabScore[joueur].s15[tabScore[joueur].s15.length-1]);
            tabScore[joueur].sbull.push(tabScore[joueur].sbull[tabScore[joueur].sbull.length-1]);
            
            //tabScore[joueur].score.push(tabScore[joueur].score[tabScore[joueur].score.length-1]);
            var pointtoAdd = 0;
            console.log("Joueur : " + joueur + ", point : " + point + ", s20 : " + tabScore[joueur].s20[tabScore[joueur].s20.length-1] + ", idColumn : " + idColumn)
            switch (idRow) {
                case "20":
                    if ((tabScore[joueur].s20[tabScore[joueur].s20.length-1] != 3) && (joueur != idColumn)) {
                        pointtoAdd = pointtoAdd + 20;
                    }
                    break;
                case "19":
                    if ((tabScore[joueur].s19[tabScore[joueur].s19.length-1] != 3) && (joueur != idColumn)) {
                        pointtoAdd = pointtoAdd + 19;
                    }
                    break;
                case "18":
                    if ((tabScore[joueur].s18[tabScore[joueur].s18.length-1] != 3) && (joueur != idColumn)) {
                        pointtoAdd = pointtoAdd + 18;
                    }
                    break;
                case "17":
                    if ((tabScore[joueur].s17[tabScore[joueur].s17.length-1] != 3) && (joueur != idColumn)) {
                        pointtoAdd = pointtoAdd + 17;
                    }
                    break;
                case "16":
                    if ((tabScore[joueur].s16[tabScore[joueur].s16.length-1] != 3) && (joueur != idColumn)) {
                        pointtoAdd = pointtoAdd + 16;
                    }
                    break;
                case "15":
                    if ((tabScore[joueur].s15[tabScore[joueur].s15.length-1] != 3) && (joueur != idColumn)) {
                        pointtoAdd = pointtoAdd + 15;
                    }
                    break;
                case "bull":
                    if ((tabScore[joueur].sbull[tabScore[joueur].sbull.length-1] != 3) && (joueur != idColumn)) {
                        pointtoAdd = pointtoAdd + 25;
                    }
                default:
                    //
            }
            var nouveauScore = tabScore[joueur].score[tabScore[joueur].score.length-1] + pointtoAdd;
            
            $('#' + joueur).text(nouveauScore);
            tabScore[joueur].score.push(nouveauScore);
        }
        
    }
    setTabScore(tabScore);
}