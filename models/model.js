$(function() {
	init();
	$('#show').click(function() {
		$('#menu').collapse('toggle');
	})
	$('#addPlayer').click(function() {
		var tabScore = getTabScore();
		var nbJoueur = getNbJoueur();
		var indexJoueur = nbJoueur;
		var chaineBefore = "Joueur_" + nbJoueur;
		nbJoueur = nbJoueur + 1;
		if (nbJoueur < 10) {
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
			temp = data.attr("class");
			data.attr("class", temp.replace(chaineBefore, chaine));
			$('.modal-title').text("Nombre de joueurs : " + nbJoueur);
			indexJoueur = indexJoueur - 1;
			for (var i = 1; i < 9; i++) {
				var temp = "tbody tr:eq(" + i + ") td:eq(" + indexJoueur + ")";
				var data = $(temp).clone(true).insertAfter(temp);
				data.find(".scoreGrid").attr("idcolumn", chaine);
				if (i > 1) {
					var tempId = data.find(".scoreGrid").attr("id");
					data.find(".scoreGrid").attr("id", tempId.replace(chaineBefore, chaine));
				}
				data.find("span").attr("id", chaine);
				var tempClass = data.attr("class");
				data.attr("class", tempClass.replace(chaineBefore, chaine));
			}
			$('.joueur').css("max-width", 90 / nbJoueur + "vw");
		}
		else {
			alert("Impossible to add more than 9 players");
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
			$('.modal-title').text("Nombre de joueurs : " + nbJoueur);
			$('.joueur').css("max-width", 90 / nbJoueur + "vw");
			for (var i = 0; i < 9; i++) {
				var temp = "tbody tr:eq(" + i + ") td:eq(" + nbJoueur + ")";
				var data = $(temp).remove();
			}
			setNbJoueur(nbJoueur);
			delete tabScore[chaine];
			setTabScore(tabScore);
		} else {
			alert("Sorry!! Can't remove first player!");
		}
	})
	$("#startGame").click(function() {
		$(".Joueur_1").css({
			"background-color": "#FF8800"
		});
		setLocalStorage("currentPlayer", ["1"]);
		setLocalStorage("currentRound", ["1"]);
	})
	$("#next").click(function() {
		var currentPlayer = getLastValue(getLocalStorage("currentPlayer"));
		var nbJoueur = getNbJoueur();
		var currentRound = parseInt(getLastValue(getLocalStorage("currentRound")), 10);
		// $(".Joueur_" + currentPlayer).css({
		// 	"background-color": "#eeeeee"
		// });
		$(".Joueur_" + currentPlayer).css({
			"background-color": ""
		});
		if (parseInt(currentPlayer, 10) == nbJoueur) {
			currentPlayer = "1";
			currentRound = currentRound + 1;
			if (currentRound == 21) {
				finish();
			} else {
				$("#round").text("Round " + currentRound);
			}
		} else {
			currentPlayer = parseInt(currentPlayer, 10) + 1;
		}
		addLocalStorage("currentRound", currentRound);
		addLocalStorage("currentPlayer", currentPlayer);
		$(".Joueur_" + currentPlayer).css({
			"background-color": "#FF8800"
		});
		updateScore("null", "null", "0");
	})
	$("input").change(function() {
		var name = $(this).attr("name");
		var value = $(this).val();
		$(this).attr("value", value);
		var tabScore = getTabScore();
		tabScore[name].nom = value;
		setTabScore(tabScore);
	})
	$("#undo").click(function() {
		var tabScore = getTabScore();
		for (var joueur in tabScore) {
			undo(tabScore[joueur]);
		}
		setTabScore(tabScore);
		refreshScreen();
	})
	$('.case').click(function() {
		var currentPlayer = getLastValue(getLocalStorage("currentPlayer"));
		var currentRound = getLastValue(getLocalStorage("currentRound"));
		var chaine = "Joueur_" + currentPlayer;
		var idRow = $(this).children().attr("idrow");
		var idColumn = $(this).children().attr("idcolumn");
		if (idColumn == chaine) {
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
			addLocalStorage("currentRound", currentRound);
			addLocalStorage("currentPlayer", currentPlayer);
			updateScore(idRow, idColumn, point);
		}
		else {
			alert("You must click on the column of the actual player (orange), to switch, click on the Red button at the top left");
			//toastr.info("Il n'est possible de cliquer que sur le joueur en cours, pour en changer, cliquez sur <<Joueur suivant>>");
		}
	})
});

function init() {
	var monJoueur = new Joueur("Joueur_1", [0], [0], [0], [0], [0], [0], [0], [0]);
	var tabScore = {
		"Joueur_1": monJoueur
	};
	setTabScore(tabScore);
	setNbJoueur("1");
	$("#myModal").modal({
		backdrop: "static",
		keyboard: false
	});
	// $("tr").css({
	// 	"background-color": "#eeeeee"
	// });
}

function finish() {
	alert("finish");
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
}

function undo(joueur) {
	if (joueur.score.length > 1) {
		joueur.score.pop();
		joueur.s20.pop();
		joueur.s19.pop();
		joueur.s18.pop();
		joueur.s17.pop();
		joueur.s16.pop();
		joueur.s15.pop();
		joueur.sbull.pop();
	}
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

function addLocalStorage(nomVar, value) {
	var obj = getLocalStorage(nomVar);
	obj.push(value.toString());
	setLocalStorage(nomVar, obj);
}

function setLocalStorage(nomVar, value) {
	localStorage.setItem(nomVar, JSON.stringify(value));
}

function getLocalStorage(nomVar) {
	return JSON.parse(localStorage.getItem(nomVar));
}

function getLastValue(obj) {
	if (obj.length > 1) {
		return obj[obj.length - 1];
	} else {
		return obj[0];
	}
}

function updateScore(idRow, idColumn, point) {
	var tabScore = getTabScore();
	for (var joueur in tabScore) {
		if (point != 0) {
			if (joueur == idColumn) {
				switch (idRow) {
					case "20":
						tabScore[joueur].s20.push(point);
						tabScore[joueur].s19.push(tabScore[joueur].s19[tabScore[joueur].s19.length - 1]);
						tabScore[joueur].s18.push(tabScore[joueur].s18[tabScore[joueur].s18.length - 1]);
						tabScore[joueur].s17.push(tabScore[joueur].s17[tabScore[joueur].s17.length - 1]);
						tabScore[joueur].s16.push(tabScore[joueur].s16[tabScore[joueur].s16.length - 1]);
						tabScore[joueur].s15.push(tabScore[joueur].s15[tabScore[joueur].s15.length - 1]);
						tabScore[joueur].sbull.push(tabScore[joueur].sbull[tabScore[joueur].sbull.length - 1]);
						tabScore[joueur].score.push(tabScore[joueur].score[tabScore[joueur].score.length - 1]);
						break;
					case "19":
						tabScore[joueur].s20.push(tabScore[joueur].s20[tabScore[joueur].s20.length - 1]);
						tabScore[joueur].s19.push(point);
						tabScore[joueur].s18.push(tabScore[joueur].s18[tabScore[joueur].s18.length - 1]);
						tabScore[joueur].s17.push(tabScore[joueur].s17[tabScore[joueur].s17.length - 1]);
						tabScore[joueur].s16.push(tabScore[joueur].s16[tabScore[joueur].s16.length - 1]);
						tabScore[joueur].s15.push(tabScore[joueur].s15[tabScore[joueur].s15.length - 1]);
						tabScore[joueur].sbull.push(tabScore[joueur].sbull[tabScore[joueur].sbull.length - 1]);
						tabScore[joueur].score.push(tabScore[joueur].score[tabScore[joueur].score.length - 1]);
						break;
					case "18":
						tabScore[joueur].s20.push(tabScore[joueur].s20[tabScore[joueur].s20.length - 1]);
						tabScore[joueur].s19.push(tabScore[joueur].s19[tabScore[joueur].s19.length - 1]);
						tabScore[joueur].s18.push(point);
						tabScore[joueur].s17.push(tabScore[joueur].s17[tabScore[joueur].s17.length - 1]);
						tabScore[joueur].s16.push(tabScore[joueur].s16[tabScore[joueur].s16.length - 1]);
						tabScore[joueur].s15.push(tabScore[joueur].s15[tabScore[joueur].s15.length - 1]);
						tabScore[joueur].sbull.push(tabScore[joueur].sbull[tabScore[joueur].sbull.length - 1]);
						tabScore[joueur].score.push(tabScore[joueur].score[tabScore[joueur].score.length - 1]);
						break;
					case "17":
						tabScore[joueur].s20.push(tabScore[joueur].s20[tabScore[joueur].s20.length - 1]);
						tabScore[joueur].s19.push(tabScore[joueur].s19[tabScore[joueur].s19.length - 1]);
						tabScore[joueur].s18.push(tabScore[joueur].s18[tabScore[joueur].s18.length - 1]);
						tabScore[joueur].s17.push(point);
						tabScore[joueur].s16.push(tabScore[joueur].s16[tabScore[joueur].s16.length - 1]);
						tabScore[joueur].s15.push(tabScore[joueur].s15[tabScore[joueur].s15.length - 1]);
						tabScore[joueur].sbull.push(tabScore[joueur].sbull[tabScore[joueur].sbull.length - 1]);
						tabScore[joueur].score.push(tabScore[joueur].score[tabScore[joueur].score.length - 1]);
						break;
					case "16":
						tabScore[joueur].s20.push(tabScore[joueur].s20[tabScore[joueur].s20.length - 1]);
						tabScore[joueur].s19.push(tabScore[joueur].s19[tabScore[joueur].s19.length - 1]);
						tabScore[joueur].s18.push(tabScore[joueur].s18[tabScore[joueur].s18.length - 1]);
						tabScore[joueur].s17.push(tabScore[joueur].s17[tabScore[joueur].s17.length - 1]);
						tabScore[joueur].s16.push(point);
						tabScore[joueur].s15.push(tabScore[joueur].s15[tabScore[joueur].s15.length - 1]);
						tabScore[joueur].sbull.push(tabScore[joueur].sbull[tabScore[joueur].sbull.length - 1]);
						tabScore[joueur].score.push(tabScore[joueur].score[tabScore[joueur].score.length - 1]);
						break;
					case "15":
						tabScore[joueur].s20.push(tabScore[joueur].s20[tabScore[joueur].s20.length - 1]);
						tabScore[joueur].s19.push(tabScore[joueur].s19[tabScore[joueur].s19.length - 1]);
						tabScore[joueur].s18.push(tabScore[joueur].s18[tabScore[joueur].s18.length - 1]);
						tabScore[joueur].s17.push(tabScore[joueur].s17[tabScore[joueur].s17.length - 1]);
						tabScore[joueur].s16.push(tabScore[joueur].s16[tabScore[joueur].s16.length - 1]);
						tabScore[joueur].s15.push(point);
						tabScore[joueur].sbull.push(tabScore[joueur].sbull[tabScore[joueur].sbull.length - 1]);
						tabScore[joueur].score.push(tabScore[joueur].score[tabScore[joueur].score.length - 1]);
						break;
					case "bull":
						tabScore[joueur].s20.push(tabScore[joueur].s20[tabScore[joueur].s20.length - 1]);
						tabScore[joueur].s19.push(tabScore[joueur].s19[tabScore[joueur].s19.length - 1]);
						tabScore[joueur].s18.push(tabScore[joueur].s18[tabScore[joueur].s18.length - 1]);
						tabScore[joueur].s17.push(tabScore[joueur].s17[tabScore[joueur].s17.length - 1]);
						tabScore[joueur].s16.push(tabScore[joueur].s16[tabScore[joueur].s16.length - 1]);
						tabScore[joueur].s15.push(tabScore[joueur].s15[tabScore[joueur].s15.length - 1]);
						tabScore[joueur].sbull.push(point);
						tabScore[joueur].score.push(tabScore[joueur].score[tabScore[joueur].score.length - 1]);
						break;
					default:
						//
				}
			} else {
				tabScore[joueur].s20.push(tabScore[joueur].s20[tabScore[joueur].s20.length - 1]);
				tabScore[joueur].s19.push(tabScore[joueur].s19[tabScore[joueur].s19.length - 1]);
				tabScore[joueur].s18.push(tabScore[joueur].s18[tabScore[joueur].s18.length - 1]);
				tabScore[joueur].s17.push(tabScore[joueur].s17[tabScore[joueur].s17.length - 1]);
				tabScore[joueur].s16.push(tabScore[joueur].s16[tabScore[joueur].s16.length - 1]);
				tabScore[joueur].s15.push(tabScore[joueur].s15[tabScore[joueur].s15.length - 1]);
				tabScore[joueur].sbull.push(tabScore[joueur].sbull[tabScore[joueur].sbull.length - 1]);
				tabScore[joueur].score.push(tabScore[joueur].score[tabScore[joueur].score.length - 1]);
			}
		} else {
			tabScore[joueur].s20.push(tabScore[joueur].s20[tabScore[joueur].s20.length - 1]);
			tabScore[joueur].s19.push(tabScore[joueur].s19[tabScore[joueur].s19.length - 1]);
			tabScore[joueur].s18.push(tabScore[joueur].s18[tabScore[joueur].s18.length - 1]);
			tabScore[joueur].s17.push(tabScore[joueur].s17[tabScore[joueur].s17.length - 1]);
			tabScore[joueur].s16.push(tabScore[joueur].s16[tabScore[joueur].s16.length - 1]);
			tabScore[joueur].s15.push(tabScore[joueur].s15[tabScore[joueur].s15.length - 1]);
			tabScore[joueur].sbull.push(tabScore[joueur].sbull[tabScore[joueur].sbull.length - 1]);
			var pointtoAdd = 0;
			switch (idRow) {
				case "20":
					if ((tabScore[joueur].s20[tabScore[joueur].s20.length - 1] != 3) && (joueur != idColumn)) {
						pointtoAdd = pointtoAdd + 20;
					}
					break;
				case "19":
					if ((tabScore[joueur].s19[tabScore[joueur].s19.length - 1] != 3) && (joueur != idColumn)) {
						pointtoAdd = pointtoAdd + 19;
					}
					break;
				case "18":
					if ((tabScore[joueur].s18[tabScore[joueur].s18.length - 1] != 3) && (joueur != idColumn)) {
						pointtoAdd = pointtoAdd + 18;
					}
					break;
				case "17":
					if ((tabScore[joueur].s17[tabScore[joueur].s17.length - 1] != 3) && (joueur != idColumn)) {
						pointtoAdd = pointtoAdd + 17;
					}
					break;
				case "16":
					if ((tabScore[joueur].s16[tabScore[joueur].s16.length - 1] != 3) && (joueur != idColumn)) {
						pointtoAdd = pointtoAdd + 16;
					}
					break;
				case "15":
					if ((tabScore[joueur].s15[tabScore[joueur].s15.length - 1] != 3) && (joueur != idColumn)) {
						pointtoAdd = pointtoAdd + 15;
					}
					break;
				case "bull":
					if ((tabScore[joueur].sbull[tabScore[joueur].sbull.length - 1] != 3) && (joueur != idColumn)) {
						pointtoAdd = pointtoAdd + 25;
					}
				default:
					//
			}
			var nouveauScore = tabScore[joueur].score[tabScore[joueur].score.length - 1] + pointtoAdd;
			$('#' + joueur).text(nouveauScore);
			tabScore[joueur].score.push(nouveauScore);
		}
	}
	setTabScore(tabScore);
	if (point == 3) {
		griserLigne(idRow);
	}
}

function refreshScreen() {
	var tabScore = getTabScore();
	for (var joueur in tabScore) {
		var obj = tabScore[joueur];
		var index = obj.score.length - 1;
		var score = obj.score[index];
		var s20 = obj.s20[index];
		var s19 = obj.s19[index];
		var s18 = obj.s18[index];
		var s17 = obj.s17[index];
		var s16 = obj.s16[index];
		var s15 = obj.s15[index];
		var sbull = obj.sbull[index];
		var dict = {
			"20": s20,
			"19": s19,
			"18": s18,
			"17": s17,
			"16": s16,
			"15": s15,
			"bull": sbull
		};
		Object.keys(dict).forEach(function(key) {
			switch (dict[key]) {
				case 0:
					$("#" + key + "_" + joueur).attr("src", "/images/0.svg");
					break;
				case 1:
					$("#" + key + "_" + joueur).attr("src", "/images/1.svg");
					break;
				case 2:
					$("#" + key + "_" + joueur).attr("src", "/images/2.svg");
					break;
				case 3:
					$("#" + key + "_" + joueur).attr("src", "/images/3.svg");
					break;
				default:
					//
			}
		});
		$('#' + joueur).text(score);
		$("." + joueur).css({
			"background-color": "#eeeeee"
		});
	}
	var currentPlayer = getLocalStorage("currentPlayer");
	var currentRound = getLocalStorage("currentRound");
	if (currentPlayer.length > 1) {
		currentPlayer.pop();
		currentRound.pop();
	}
	else {
		alert("Sorry!! Can't go more backward !");
	}
	setLocalStorage("currentPlayer", currentPlayer);
	setLocalStorage("currentRound", currentRound);
	$("#round").text("Round " + currentRound[currentRound.length - 1]);
	$(".Joueur_" + currentPlayer[currentPlayer.length - 1]).css({
		"background-color": "#FF8800"
	});
}

function griserLigne(idRow) {
	var tabScore = getTabScore();
	var testScore = [];
	var griser = true;
	for (var joueur in tabScore) {
		switch (idRow) {
			case "20":
				testScore.push(tabScore[joueur].s20[tabScore[joueur].s20.length - 1]);
				break;
			case "19":
				testScore.push(tabScore[joueur].s19[tabScore[joueur].s19.length - 1]);
				break;
			case "18":
				testScore.push(tabScore[joueur].s18[tabScore[joueur].s18.length - 1]);
				break;
			case "17":
				testScore.push(tabScore[joueur].s17[tabScore[joueur].s17.length - 1]);
				break;
			case "16":
				testScore.push(tabScore[joueur].s16[tabScore[joueur].s16.length - 1]);
				break;
			case "15":
				testScore.push(tabScore[joueur].s15[tabScore[joueur].s15.length - 1]);
				break;
			case "Bull":
				testScore.push(tabScore[joueur].sbull[tabScore[joueur].sbull.length - 1]);
				break;
			default:
				console.log("Erreur switch : " + idRow);
		}
	}
	for (var i = 0; i < testScore.length; i++) {
		if (testScore[i] != 3) {
			griser = false;
		}
	}
	if (griser) {
		$(".Ligne_" + idRow).css({
			"background-color": "black"
		});
	}
}