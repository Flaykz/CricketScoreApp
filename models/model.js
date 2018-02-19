$(function() {
	init();
	
	$('#addPlayer').click(function() {
		var tabScore = getTabScore();
		var nbJoueur = getNbJoueur();
		var indexJoueur = nbJoueur;
		var chaineBefore = "Joueur_" + nbJoueur;
		nbJoueur = nbJoueur + 1;
		if (nbJoueur < 5) {
			var chaine = "Joueur_" + nbJoueur;
			var stats = ["0;0;0.00"];
			var monJoueur = new Joueur(chaine, stats, [0], [0], [0], [0], [0], [0], [0], [0]);
			tabScore[chaine] = monJoueur;
			setTabScore(tabScore);
			setNbJoueur(nbJoueur);
			$("." + chaine).css("display", "");
			$('.mymodal-title').text("Nombre de joueurs : " + nbJoueur);
			//$('.col').css("max-width", 90 / nbJoueur + "vw");
		}
		else {
			showToast("Impossible to add more than 4 players", 2);
		}
	})
	$('#deletePlayer').click(function() {
		var nbJoueur = getNbJoueur();
		var chaine = "Joueur_" + nbJoueur;
		var tabScore = getTabScore();
		if (nbJoueur > 1) {
			$("." + chaine).css("display", "none");
			nbJoueur = nbJoueur - 1;
			setNbJoueur(nbJoueur);
			delete tabScore[chaine];
			setTabScore(tabScore);
			$('.mymodal-title').text("Nombre de joueurs : " + nbJoueur);
			//$('.col').css("max-width", 90 / nbJoueur + "vw");
		} else {
			showToast("Sorry!! Can't remove first player!", 2);
		}
	})
	$("#startGame").click(function() {
		startGame();
	})

	$(".Joueur_0").click(function() {
		var row = $(this).attr("class");
		if (row.match("Ligne_(20|19|18|17|16|15|Bull)")) {
			updateScore("null", "null", "0");
			
			var currentPlayer = getLastValue(getLocalStorage("currentPlayer"));
			var nbJoueur = getNbJoueur();
			var currentRound = parseInt(getLastValue(getLocalStorage("currentRound")), 10);
			
			$(".Joueur_" + currentPlayer).each(function(i, obj) {
				var currentCSS = $(obj).css("background-color");
				if (currentCSS !== "rgb(0, 0, 0)") {
					$(obj).css({
						"background-color": ""
					});
				}
			});
			if (parseInt(currentPlayer, 10) == nbJoueur) {
				currentPlayer = "1";
				currentRound = currentRound + 1;
				$("#round").text(currentRound);
			} else {
				currentPlayer = parseInt(currentPlayer, 10) + 1;
			}
			$(".Joueur_" + currentPlayer).each(function(i, obj) {
				var currentCSS = $(obj).css("background-color");
				if (currentCSS !== "rgb(0, 0, 0)") {
					$(obj).css({
						"background-color": "#FF8800"
					});
				}
			});
			
			addLocalStorage("currentRound", currentRound);
			addLocalStorage("currentPlayer", currentPlayer);
		}
		else {
			var tabScore = getTabScore();
			for (var joueur in tabScore) {
				undo(tabScore[joueur]);
			}
			setTabScore(tabScore);
			refreshScreen();
		}
	})
	
	$("input").change(function() {
		var name = $(this).attr("name");
		var value = $(this).val();
		$(this).attr("value", value);
		var tabScore = getTabScore();
		tabScore[name].nom = value;
		setTabScore(tabScore);
	})

	$('.case').click(function() {
		var currentPlayer = getLastValue(getLocalStorage("currentPlayer"));
		var currentRound = getLastValue(getLocalStorage("currentRound"));
		var chaine = "Joueur_" + currentPlayer;
		var idRow = $(this).children().attr("id").split("_")[0];
		var idColumn = $(this).children().attr("id").substr(-8, 8);
		if (idColumn == chaine) {
			var point = parseInt($(this).children().attr("svgid"), 10);
			point = point + 1;
			switch (point) {
				case 1:
				case 2:
				case 3:
					$(this).children().attr("svgid", point);
					$(this).children().html(drawSVG(point, chaine));
					break;
				default:
					point = 0;
			}
			addLocalStorage("currentRound", currentRound);
			addLocalStorage("currentPlayer", currentPlayer);
			updateScore(idRow, idColumn, point);
		}
		else {
			showToast("You must click on the column of the actual player (orange), to switch, click on Red", 0);
		}
	})
	
	$('.toast').click(function() {
		$(this).fadeOut("slow");
	})
});

$(window).on("load", function () {
	$('.container').css("display", "");
	$('.table-responsive').css("display", "flex");
	// $('.loader').css("display", "none");
	$('.loader').fadeOut("slow");
});


function init() {
	var href = window.location.href;
	var hostname = window.location.hostname;
	var path = href.replace("https://" + hostname, "");
	var nbJoueur = "1";
	var tabScore = new Object();
	if (path == "/") {
		var monJoueur = new Joueur("Joueur_1", ["0;0;0.00"], [0], [0], [0], [0], [0], [0], [0], [0]);
		tabScore["Joueur_1"] = monJoueur;
		for (var i = 1; i < 5; i++) {
			var nomJoueur = "Joueur_" + i;
			$("input[name='" + nomJoueur + "']").attr("value", nomJoueur);
		}
	}
	else {
		path = path.replace("/?", "");
		var listPlayer = path.split("&");
		for (var i = 0; i < listPlayer.length; i++) {
			var cle = "Joueur_" + parseInt(i + 1);
			var nomJoueur = listPlayer[i].split("=")[1]
			$("input[name='" + cle + "']").attr("value", nomJoueur);
			var monJoueur = new Joueur(nomJoueur, ["0;0;0.00"], [0], [0], [0], [0], [0], [0], [0], [0]);
			tabScore[cle] = monJoueur;
		}
		nbJoueur = i;
		startGame();
		history.pushState({Title: "accueil", Url: "/"}, "accueil", "/");
	}
	
	setTabScore(tabScore);
	setNbJoueur(nbJoueur);
	
	for (var i = 1; i < 5; i++) {
		var chaine = ".Joueur_" + i;
		if (i > parseInt(nbJoueur)) {
			$(chaine).css("display", "none");
		} else {
			$(chaine).css("display", "");
		}
	}
}

function finish() {
	var tabScore = getTabScore();
	var testScore = [];
	var minScore = [];
	var winner = "";
	var currentRound = parseInt(getLastValue(getLocalStorage("currentRound")), 10);
	for (var joueur in tabScore) {
		var full = getLastValue(tabScore[joueur].s20) + getLastValue(tabScore[joueur].s19) + getLastValue(tabScore[joueur].s18) + getLastValue(tabScore[joueur].s17) + getLastValue(tabScore[joueur].s16) + getLastValue(tabScore[joueur].s15) + getLastValue(tabScore[joueur].sbull); 
		testScore.push(tabScore[joueur].nom + "," + getLastValue(tabScore[joueur].score) + "," + full);
		minScore.push(getLastValue(tabScore[joueur].score));
	}
	var min = arrayMin(minScore);
	var indexArray = allIndexOf(minScore, min);
	var lenTab = indexArray.length;
	
	if (currentRound == 21) {
		if (lenTab > 1) {
			for (var i = 0; i < lenTab; i++) {
				winner = winner + " " + testScore[indexArray[i]].split(",")[0];
			}
			drawWinPlayer("winner are :" + winner);
		}
		else {
			drawWinPlayer("winner is :" + testScore[indexArray[0]].split(",")[0]);
		}
	}
	else {
		var count = 0;
		var win = false;
		for (var i = 0; i < lenTab; i++) {
			if (testScore[indexArray[i]].split(",")[2] == 21) {
				win = true;
			}
			count = count + 1;
			winner = winner + " " + testScore[indexArray[i]].split(",")[0];
		}
		if (win) {
			if (count > 1) {
				drawWinPlayer("winner are :" + winner);
			}
			if (count == 1) {
				drawWinPlayer("winner is :" + winner);
			}
		}
	}
}

function Joueur(nom, stats, score, s20, s19, s18, s17, s16, s15, sbull) {
	this.nom = nom;
	this.stats = stats;
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
		joueur.stats.pop();
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

function getLastValue(arr) {
	if (arr.length > 1) {
		return arr[arr.length - 1];
	} else {
		return arr[0];
	}
}

function arrayMin(arr) {
	var len = arr.length, min = Infinity;
	while (len--) {
		if (arr[len] < min) {
			min = arr[len];
		}
	}
	return min;
};

function allIndexOf(arr, el) {
	var indexArray = [];
	var index = arr.indexOf(el);
	while (index != -1) {
		indexArray.push(index);
		var index = arr.indexOf(el, index + 1);
	}
	return indexArray;
}

function sortByScoreAsc(key1, key2) {
	return getLastValue(key1.score) > getLastValue(key2.score);
}

function sortByScoreDsc(key1, key2) {
	return getLastValue(key1.score) < getLastValue(key2.score);
}

function objectToTab(obj) {
	var tab = [];
	for (var item in obj) {
		tab.push(obj[item]);
	}
	return tab;
}

function drawWinPlayer(winner) {
	$('.table-responsive').css("pointer-events", "none");
	$('.table-responsive').css("cursor", "default");
	var modalStart = "<div class='mymodal-dialog'><div class='mymodal-content'><div class='mymodal-body'>";
	var modalEnd = "</div><div class='mymodal-footer'><button id='revengeGame' aria-label='Revenge'>Revenge</button><button id='restartGame' aria-label='Restart'>Restart</button></div></div></div>";
	$(".modalEndGame").html(modalStart + winner + modalEnd);
	$(".modalEndGame").css("display", "block");
	var url = "https://" + window.location.hostname;
	$("#restartGame").on("click",function() {
		window.location.assign(url);
	});
	$("#revengeGame").on("click",function() {
		var tabScore = getTabScore();
		var path = "/?";
		var tab = objectToTab(tabScore).sort(sortByScoreDsc);
		for (var i = 1; i < tab.length + 1; i++) {
			path = path + "&p" + i + "=" + tab[i - 1].nom;
			if (i == 1) {
				path = path.replace("&", "");
			}
		}
		window.location.assign(url + path);
	})
}

function startGame() {
	$('.mymodal').css("display", "none");
	$('.table-responsive').css("pointer-events", "initial");
	$('.table-responsive').css("cursor", "initial");
	$(".Joueur_1").css({
		"background-color": "#FF8800"
	});
	setLocalStorage("currentPlayer", ["1"]);
	setLocalStorage("currentRound", ["1"]);
}

function updateScore(idRow, idColumn, point) {
	var tabScore = getTabScore();
	var currentPlayer = getLastValue(getLocalStorage("currentPlayer"));
	var currentRound = getLastValue(getLocalStorage("currentRound"));
	var nbJoueur = getLocalStorage("nbJoueur");

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
					case "Bull":
						tabScore[joueur].s20.push(tabScore[joueur].s20[tabScore[joueur].s20.length - 1]);
						tabScore[joueur].s19.push(tabScore[joueur].s19[tabScore[joueur].s19.length - 1]);
						tabScore[joueur].s18.push(tabScore[joueur].s18[tabScore[joueur].s18.length - 1]);
						tabScore[joueur].s17.push(tabScore[joueur].s17[tabScore[joueur].s17.length - 1]);
						tabScore[joueur].s16.push(tabScore[joueur].s16[tabScore[joueur].s16.length - 1]);
						tabScore[joueur].s15.push(tabScore[joueur].s15[tabScore[joueur].s15.length - 1]);
						tabScore[joueur].sbull.push(point);
						tabScore[joueur].score.push(tabScore[joueur].score[tabScore[joueur].score.length - 1]);;
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
				case "Bull":
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
		
		if (joueur == idColumn) {
			lastRound = parseInt(tabScore[joueur].stats[tabScore[joueur].stats.length - 1].split(";")[0], 10);
			lastHit = parseInt(tabScore[joueur].stats[tabScore[joueur].stats.length - 1].split(";")[1], 10);
			newHit = lastHit + 1;
			newStat = newHit / currentRound;
			newStat = newStat.toFixed(2);
			tabScore[joueur].stats.push(currentRound + ";" + newHit + ";" + newStat);
			$("#Stats_" + joueur).text(newStat);
		}
		else {
			if (idColumn == "null") {
				if (joueur[joueur.length - 1] != currentPlayer) {
					tabScore[joueur].stats.push(tabScore[joueur].stats[tabScore[joueur].stats.length - 1]);
				}
				else {
					lastRound = parseInt(tabScore[joueur].stats[tabScore[joueur].stats.length - 1].split(";")[0], 10);
					if (currentRound != lastRound) {
						lastHit = parseInt(tabScore[joueur].stats[tabScore[joueur].stats.length - 1].split(";")[1], 10);
						newStat = lastHit / currentRound;
						newStat = newStat.toFixed(2);
						tabScore[joueur].stats.push(currentRound + ";" + lastHit + ";" + newStat);
						if ($("#Stats_" + joueur).text() != newStat) {
							$("#Stats_" + joueur).text(newStat);
						}
					}
					else {
						tabScore[joueur].stats.push(tabScore[joueur].stats[tabScore[joueur].stats.length - 1]);
					}
				}
			}
			else {
				tabScore[joueur].stats.push(tabScore[joueur].stats[tabScore[joueur].stats.length - 1]);
			}
		}
	}
	setTabScore(tabScore);
	
	if (point == 3) {
		griserLigne(idRow);
	}
	if ((parseInt(currentPlayer, 10) == nbJoueur) && (currentRound == 20)) {
		addLocalStorage("currentRound", 21);
		currentRound = 21;
	}
	if (idColumn == "null") {
		if (currentRound == 21) {
			finish();
		}
	}
	else {
		if (point == 3 || point == 0 || currentRound == 21) {
			finish();
		}
	}
}

function refreshScreen() {
	var tabScore = getTabScore();
	var currentPlayer = getLocalStorage("currentPlayer");
	var currentRound = getLocalStorage("currentRound");
	if (currentRound.length > 1) {
		currentRound.pop();
	}
	if (currentPlayer.length > 1) {
		currentPlayer.pop();
	}
	else {
		showToast("Sorry!! Can't go more backward !", 2);
	}
	setLocalStorage("currentPlayer", currentPlayer);
	setLocalStorage("currentRound", currentRound);
	$("#round").text(currentRound[currentRound.length - 1]);
	for (var joueur in tabScore) {
		var obj = tabScore[joueur];
		var index = obj.score.length - 1;
		var score = obj.score[index];
		var stats = obj.stats[index];
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
			"Bull": sbull
		};
		Object.keys(dict).forEach(function(key) {
			switch (dict[key]) {
				case 0:
					$("#" + key + "_" + joueur).attr("svgid", dict[key]);
					$("#" + key + "_" + joueur).html(drawSVG(dict[key], joueur));
					break;
				case 1:
					$("#" + key + "_" + joueur).attr("svgid", dict[key]);
					$("#" + key + "_" + joueur).html(drawSVG(dict[key], joueur));
					break;
				case 2:
					$("#" + key + "_" + joueur).attr("svgid", dict[key]);
					$("#" + key + "_" + joueur).html(drawSVG(dict[key], joueur));
					break;
				case 3:
					$("#" + key + "_" + joueur).attr("svgid", dict[key]);
					$("#" + key + "_" + joueur).html(drawSVG(dict[key], joueur));
					break;
				default:
					//
			}
		});
		$('#' + joueur).text(score);
		var currentPlayer = "Joueur_" + getLastValue(getLocalStorage("currentPlayer"));
		if (joueur === currentPlayer) {
			$("." + joueur).css({
				"background-color": "#FF8800"
			});
		} else {
			$("." + joueur).css({
				"background-color": ""
			});
		}
		var currentPlayer = getLastValue(getLocalStorage("currentPlayer"));
		var currentRound = getLastValue(getLocalStorage("currentRound"));
		lastHit = parseInt(tabScore[joueur].stats[tabScore[joueur].stats.length - 1].split(";")[1], 10);
		newStat = lastHit / currentRound;
		newStat = newStat.toFixed(2);
		if ($("#Stats_" + joueur).text() != newStat) {
			$("#Stats_" + joueur).text(newStat);
		}
		console.log("4 : " + joueur);
	}
	Object.keys(dict).forEach(function(key) {
		griserLigne(key);
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
	} else {
		var currentPlayer = getLastValue(getLocalStorage("currentPlayer"));
		var currentNamePlayer = "Joueur_" + currentPlayer;
		$(".Ligne_" + idRow).each(function(i, obj) {
			var currentClassPlayer = "Joueur_" + i;
			//var currentClassPlayer = $(obj).attr("class").substring(9, 17);
			if (currentClassPlayer === currentNamePlayer) {
				$(obj).css({
					"background-color": "#FF8800"
				});
			} else {
				$(obj).css({
					"background-color": ""
				});
			}
		});
	}
}

function drawSVG(svgid, joueur) {
	var widthHeight = 50;
	var strokeWidth = 8;
	var min = strokeWidth + ((strokeWidth - 7) * -2);
	var max = widthHeight - min;
	switch (joueur) {
		case "Joueur_1":
			var strokeColour = "#ffff00";
			break;
		case "Joueur_2":
			var strokeColour = "#00ff00";
			break;
		case "Joueur_3":
			var strokeColour = "#00ffff";
			break;
		case "Joueur_4":
			var strokeColour = "#0000ff";
			break;
		case "Joueur_5":
			var strokeColour = "#8000ff";
			break;
		case "Joueur_6":
			var strokeColour = "#ff00bf";
			break;
		case "Joueur_7":
			var strokeColour = "#ff0000";
			break;
		case "Joueur_8":
			var strokeColour = "#008000";
			break;
		case "Joueur_9":
			var strokeColour = "#000000";
			break;
		default:
			var strokeColour = "#000000";
	}
	var filter = "<defs><filter id='shadow' width='200%' height='200%'><feOffset in='SourceGraphic' dx='3' dy='3' result='offsetOut'></feOffset><feColorMatrix result='matrixOut' in='offsetOut' type='matrix' values='0.2 0 0 0 0 0 0.2 0 0 0 0 0 0.2 0 0 0 0 0 1 0'></feColorMatrix><feGaussianBlur result='blurOut' in='matrixOut' stdDeviation='4'></feGaussianBlur><feBlend in='SourceGraphic' in2='blurOut' mode='normal'></feBlend></filter><filter id='light' filterUnits='userSpaceOnUse' width='200%' height='200%'><feGaussianBlur in='SourceAlpha' stdDeviation='4' result='blurOut'></feGaussianBlur><feOffset in='blurOut' dx='4' dy='4' result='offsetBlur'></feOffset><feSpecularLighting in='blurOut' surfaceScale='20' specularConstant='.25' specularExponent='4' lighting-color='#bbbbbb' result='specOut'><fePointLight x='-2000' y='-2000' z='200'></fePointLight></feSpecularLighting><feComposite in='specOut' in2='SourceAlpha' operator='in' result='specOut'></feComposite><feComposite in='SourceGraphic' in2='specOut' operator='arithmetic' k1='0' k2='1' k3='1' k4='0' result='litPaint'></feComposite></filter></defs><g filter='url(#light)'>";
	//var filter = "";
	if (filter != "") {
		var line1 = "<line filter='url(#shadow)' y2='" + max + "' x2='" + min + "' y1='" + min + "' x1='" + max + "' fill-opacity='0' stroke-width='" + strokeWidth + "' stroke='" + strokeColour + "' /></g>";
		var line2 = "<line filter='url(#shadow)' y2='" + max + "' x2='" + max + "' y1='" + min + "' x1='" + min + "' fill-opacity='0' stroke-width='" + strokeWidth + "' stroke='" + strokeColour + "' />";
		var circle = "<circle fill-opacity='0' r='18' cy='25' cx='25' stroke-width='" + strokeWidth + "' stroke='" + strokeColour + "' />";
	}
	else {
		var line1 = "<line y2='" + max + "' x2='" + min + "' y1='" + min + "' x1='" + max + "' fill-opacity='0' stroke-width='" + strokeWidth + "' stroke='" + strokeColour + "' />";
		var line2 = "<line y2='" + max + "' x2='" + max + "' y1='" + min + "' x1='" + min + "' fill-opacity='0' stroke-width='" + strokeWidth + "' stroke='" + strokeColour + "' />";
		var circle = "<circle fill-opacity='0' r='18' cy='25' cx='25' stroke-width='" + strokeWidth + "' stroke='" + strokeColour + "' />";
	}
	switch (svgid) {
		case 1:
			return filter + line1;
			break;
		case 2:
			return filter + line2 + line1;
			break;
		case 3:
			return filter + circle + line2 + line1;
			break;
		default:
			return "";
	}
}

function showToast(message, timeout) {
	$('#toast').text(message);
	$('.toast').css('display', 'flex').hide().fadeIn('slow');
	if (parseInt(timeout) != 0) {
		timeout = parseInt(timeout) * 1000;
		res = setTimeout(hideToast, timeout);
	}
}

function hideToast() {
  var display = $('.toast').css('display');
  if (display == 'flex') {
	  $('.toast').fadeOut("slow");
  }
}