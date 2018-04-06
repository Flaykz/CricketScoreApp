/*global $*/
//"rgb(0, 0, 0)";
colourEnded = "black";

$(function() {
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
			$("." + chaine).css("display", "flex");
			var maxWidth = 100 / (nbJoueur + 1);
			$(".col").css("max-width", maxWidth + "vw");
			$('.mymodal-title').text("Nombre de joueurs : " + nbJoueur);
			var value = $('.colour-choice .' + chaine).val();
			var tabColour = {};
			tabColour = getLocalStorage('colour');
			tabColour[chaine] = value;
			setLocalStorage('colour', tabColour);
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
			var maxWidth = 100 / (nbJoueur + 1);
			$(".col").css("max-width", maxWidth + "vw");
			$('.mymodal-title').text("Nombre de joueurs : " + nbJoueur);
		} else {
			showToast("Sorry!! Can't remove first player!", 2);
		}
	})
	$("#startGame").click(function() {
		var noSleep = new NoSleep();
		noSleep.enable();
		startGame();
	})

	$(".Joueur_0").click(function() {
		var row = $(this).attr("class");
		var tabCurrentPlayer = getLocalStorage("currentPlayer");
		var tabCurrentRound = getLocalStorage("currentRound");
		var tabCurrentDart = getLocalStorage("currentDart");
		var tabCurrentMiss = getLocalStorage("currentMiss");
		if (row.match("Ligne_(20|19|18|17|16|15|Bull)")) {
			next();
		}
		else {
			if (tabCurrentRound.length > 1) {
				tabCurrentRound.pop();
				tabCurrentDart.pop();
				tabCurrentMiss.pop();
				setLocalStorage("currentRound", tabCurrentRound);
				setLocalStorage("currentDart", tabCurrentDart);
				setLocalStorage("currentMiss", tabCurrentMiss);	
				if (tabCurrentPlayer.length > 1) {
					tabCurrentPlayer.pop();
					setLocalStorage("currentPlayer", tabCurrentPlayer);
				} else {
					alert("Il n'est pas normal que tabCurrentRound soit > 1 et pas tabCurrentPlayer");
				}
			} else {
				showToast("Sorry!! Can't go more backward !", 2);
			}
			var tabScore = getTabScore();
			for (var joueur in tabScore) {
				undo(tabScore[joueur]);
			}
			setTabScore(tabScore);
			
			refreshScreen();
		}
		setTeam();
	})
	
	$(".joueur").change(function() {
		var name = $(this).attr("name");
		var value = sanitize($(this).text());
		var tabScore = getTabScore();
		tabScore[name].nom = value;
		setTabScore(tabScore);
		var len = value.split(",", 2).length;
		if (len > 1) {
			value = "<span class='team1'>" + value.split(",", 2)[0] + "</span><span class='team2'>" + value.split(",", 2)[1] + "</span>";
		}
		$(this).html(value);
		setTeam();
	})
	
	$(".input-colour-choice").change(function() {
		var joueur = $(this).attr("class").replace('input-colour-choice ', '');
		var value = $(this).val();
		var tabColour = {};
		tabColour = getLocalStorage('colour');
		tabColour[joueur] = value;
		setLocalStorage('colour', tabColour);
	})
	
	$(".colour-ihm div input").change(function() {
		var tabColour = {};
		tabColour = getLocalStorage('colour');
		var id = $(this).attr("id");
		var colour = $('#' + id).val();
		tabColour[id] = colour;
		switch (id) {
			case 'colourPrevious':
				colourPrevious = colour;
				$('.Joueur_0.Ligne_score, .Joueur_0.Ligne_nom').css('background-color', colourPrevious);
				break;
			case 'colourNext':
				colourNext = colour;
				$('.Joueur_0.Ligne_20, .Joueur_0.Ligne_19, .Joueur_0.Ligne_18, .Joueur_0.Ligne_17, .Joueur_0.Ligne_16, .Joueur_0.Ligne_15, .Joueur_0.Ligne_Bull').css('background-color', colourNext);
				break;
			case 'colourSelected':
				colourSelected = colour;
				break;
			case 'colourBackground':
				colourBackground = colour;
				$('div.Joueur_1, div.Joueur_2, div.Joueur_3, div.Joueur_4').css('background-color', colourBackground);
				break;
			default:
				//
		}
		setLocalStorage('colour', tabColour);
	})
	$('.case').click(function(e) {
		var currentPlayer = getLastValue(getLocalStorage("currentPlayer"));
		var currentRound = getLastValue(getLocalStorage("currentRound"));
		var tabCurrentDart = getLocalStorage("currentDart");
		var currentDart = parseInt(getLastValue(tabCurrentDart));
		var currentMiss = getLastValue(getLocalStorage("currentMiss"));
		var chaine = "Joueur_" + currentPlayer;
		var idRow = $(this).children().attr("id").split("_")[0];
		var idColumn = $(this).children().attr("id").substr(-8, 8);
		var prefix = '<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">';
		var suffix = '</svg>';
		var doSomething = true;
		if (idColumn == chaine) {
			if (!isNaN(parseInt(getLastValueIndex(tabCurrentDart, 1)))) {
				if ((currentMiss != idRow) && (currentMiss != "")) {
					var previousPlayer = currentPlayer;
					next();
					var currentPlayer = getLastValue(getLocalStorage("currentPlayer"));
					if (previousPlayer != currentPlayer) {
						doSomething = false;
						showToast("you can't play a 4th dart, let's pass to the next player", 1);
					}
					var currentRound = getLastValue(getLocalStorage("currentRound"));
					var tabCurrentDart = getLocalStorage("currentDart");
					var currentDart = parseInt(getLastValue(tabCurrentDart));
					var chaine = "Joueur_" + currentPlayer;
				}
			}
			var nb = 0;
			if (isNaN(parseInt(getLastValueIndex(tabCurrentDart, 1)))) {
				nb = 1;
			} else {
				if (isNaN(parseInt(getLastValueIndex(tabCurrentDart, 2)))) {
					nb = 2;
				} else {
					if (isNaN(parseInt(getLastValueIndex(tabCurrentDart, 3)))) {
						nb = 3;
					} else {
						nb = 4;
					}
				}	
			}
			if (nb == 4) {
				var previousPlayer = currentPlayer;
				next();
				var currentPlayer = getLastValue(getLocalStorage("currentPlayer"));
				if (previousPlayer != currentPlayer) {
					doSomething = false;
					showToast("you can't play a 4th dart, let's pass to the next player", 1);
				}
				var currentRound = getLastValue(getLocalStorage("currentRound"));
				var tabCurrentDart = getLocalStorage("currentDart");
				var currentDart = parseInt(getLastValue(tabCurrentDart));
				var chaine = "Joueur_" + currentPlayer;
			}
			if (doSomething) {
				$('.' + chaine).fadeTo(10, 0.6, function () {
					$('.' + chaine).fadeTo(10, 1);
				});
				var point = parseInt($(this).children().attr("svgid"), 10);
				point = point + 1;
				var previousDart = parseInt(getLastValueIndex(tabCurrentDart, 2));
				if (isNaN(currentDart)) {
					if (isNaN(previousDart)) {
						previousDart = 0;
					} 
					currentDart = previousDart + 1;
					if (currentDart == 4) {
						currentDart = 1;
					}
				}
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
				addLocalStorage("currentDart", currentDart);
				addLocalStorage("currentMiss", idRow);
				updateScore(idRow, idColumn, point);
				refreshScreen();
			}
		}
		else {
			showToast("You must click on the column of the actual player (orange), to switch, click on Red", 0);
		}
	})
	
	$('.toast').click(function() {
		$(this).fadeOut("slow");
	})
	
	$("[contenteditable]").on('focus', function() {
		before = $(this).html();
	}).on('blur keypup paste', function() {
		if ($(this).html() != before) {
			$(this).trigger('change');
		}
	});
});

$(window).on("load", function () {
	$('.mymodal').css("display", "block");
	$('.container').css("display", "");
	$('.table-responsive').css("display", "flex");
	$('.loader').fadeOut("slow");
	init();
});

function init() {
	var href = window.location.href;
	var hostname = window.location.hostname;
	var path = href.replace("https://" + hostname, "");
	var nbJoueur = "1";
	var tabScore = new Object();
	var tabColour = {};
	
	if (path == "/") {
		var currentRound = getLocalStorage("currentRound");
		var currentDart = getLocalStorage("currentDart");
		var currentMiss = getLocalStorage("currentMiss");
		if (currentRound == null) {
			setLocalStorage("currentRound", ["1"]);
		}
		if (currentDart == null) {
			setLocalStorage("currentDart", [""]);
		}
		if (currentMiss == null) {
			setLocalStorage("currentMiss", [""]);
		}
		if (getLocalStorage("currentRound").length > 1) {
			var nbJoueur = getNbJoueur();
			var tabScore = getTabScore();
			tabColour = getLocalStorage('colour');
			colourPrevious = tabColour['colourPrevious'];
			colourNext = tabColour['colourNext'];
			colourBackground = tabColour['colourBackground'];
			colourSelected = tabColour['colourSelected'];
			$('div.Joueur_1, div.Joueur_2, div.Joueur_3, div.Joueur_4').css('background-color', colourBackground);
			$('.Joueur_0.Ligne_20, .Joueur_0.Ligne_19, .Joueur_0.Ligne_18, .Joueur_0.Ligne_17, .Joueur_0.Ligne_16, .Joueur_0.Ligne_15, .Joueur_0.Ligne_Bull').css('background-color', colourNext);
			$('.Joueur_0.Ligne_score, .Joueur_0.Ligne_nom').css('background-color', colourPrevious);
			$('.mymodal').css("display", "none");
			refreshScreen();
			var modalStart = "<div class='mymodal-dialog'><div class='mymodal-content'><div class='mymodal-body'>";
			var modalMid = "Continue this game ?"
			var modalEnd = "</div><div class='mymodal-footer'><button id='oui' aria-label='Oui'>Yes</button><button id='non' aria-label='Non'>No</button></div></div></div>";
			$(".modalEndGame").html(modalStart + modalMid + modalEnd);
			$(".modalEndGame").css("display", "block");
			$("#oui").on("click",function() {
				$(".modalEndGame").css("display", "none");
				$('.table-responsive').css("pointer-events", "initial");
				$('.table-responsive').css("cursor", "initial");
			});
			$("#non").on("click",function() {
				var url = "https://" + window.location.hostname;
				setLocalStorage("currentRound", ["1"]);
				setLocalStorage("currentDart", [""]);
				setLocalStorage("currentMiss", [""]);
				window.location.assign(url);
			});
		} else {
			var monJoueur = new Joueur("Joueur_1", ["0;0;0.00"], [0], [0], [0], [0], [0], [0], [0], [0]);
			tabScore["Joueur_1"] = monJoueur;
			for (var i = 1; i < 5; i++) {
				var nomJoueur = "Joueur_" + i;
				$(".joueur[name='" + nomJoueur + "']").html(nomJoueur);
			}
			var value = $('.colour-choice .Joueur_1').val();
			tabColour['Joueur_1'] = value;
			colourPrevious = $('#colourPrevious').val();
			colourNext = $('#colourNext').val();
			colourBackground = $('#colourBackground').val();
			colourSelected = $('#colourSelected').val();
			tabColour['colourPrevious'] = colourPrevious;
			tabColour['colourNext'] = colourNext;
			tabColour['colourBackground'] = colourBackground;
			tabColour['colourSelected'] = colourSelected;
			$('div.Joueur_1, div.Joueur_2, div.Joueur_3, div.Joueur_4').css('background-color', colourBackground);
			$('.Joueur_0.Ligne_20, .Joueur_0.Ligne_19, .Joueur_0.Ligne_18, .Joueur_0.Ligne_17, .Joueur_0.Ligne_16, .Joueur_0.Ligne_15, .Joueur_0.Ligne_Bull').css('background-color', colourNext);
			$('.Joueur_0.Ligne_score, .Joueur_0.Ligne_nom').css('background-color', colourPrevious);
			setLocalStorage('colour', tabColour);
		}
		
	}
	else {
		path = path.replace("/?", "");
		var listPlayer = path.split("&");
		tabColour = getLocalStorage('colour');
		for (var i = 0; i < listPlayer.length; i++) {
			var cle = "Joueur_" + parseInt(i + 1);
			var nomJoueur = sanitize(decodeURIComponent(listPlayer[i].split("=")[1]));
			var len = nomJoueur.split(",", 2).length;
			if (len > 1) {
				nomJoueur = "<span class='team1'>" + nomJoueur.split(",", 2)[0] + "</span><span class='team2'>" + nomJoueur.split(",", 2)[1] + "</span>";
			}
			$(".joueur[name='" + cle + "']").html(nomJoueur);
			setTeam();
			var monJoueur = new Joueur(nomJoueur, ["0;0;0.00"], [0], [0], [0], [0], [0], [0], [0], [0]);
			tabScore[cle] = monJoueur;
			//$('.colour-choice .' + cle).val(tabColour[cle]);
		}
		colourPrevious = tabColour['colourPrevious'];
		colourNext = tabColour['colourNext'];
		colourBackground = tabColour['colourBackground'];
		colourSelected = tabColour['colourSelected'];
		$('div.Joueur_1, div.Joueur_2, div.Joueur_3, div.Joueur_4').css('background-color', colourBackground);
		$('.Joueur_0.Ligne_20, .Joueur_0.Ligne_19, .Joueur_0.Ligne_18, .Joueur_0.Ligne_17, .Joueur_0.Ligne_16, .Joueur_0.Ligne_15, .Joueur_0.Ligne_Bull').css('background-color', colourNext);
		$('.Joueur_0.Ligne_score, .Joueur_0.Ligne_nom').css('background-color', colourPrevious);
		nbJoueur = i;
		startGame();
		history.pushState({Title: "accueil", Url: "/"}, "accueil", "/");
	}
	
	setTabScore(tabScore);
	setNbJoueur(nbJoueur);
	
	for (var i = 0; i < 5; i++) {
		var chaine = ".Joueur_" + i;
		if (i > parseInt(nbJoueur)) {
			$(chaine).css("display", "none");
		} else {
			$(chaine).css("display", "flex");
		}
	}
}

function setTeam() {
	var currentRound = parseInt(getLastValue(getLocalStorage("currentRound")));
	if (currentRound % 2 == 1) {
		$(".team1").css("font-size", "6vmin");
		$(".team2").css("font-size", "4vmin");
	} else {
		$(".team2").css("font-size", "6vmin");
		$(".team1").css("font-size", "4vmin");
	}
}

function finish() {
	var tabScore = getTabScore();
	var testScore = [];
	var minScore = [];
	var winner = "";
	var intro = "";
	var win = false;
	var currentRound = parseInt(getLastValue(getLocalStorage("currentRound")), 10);
	for (var joueur in tabScore) {
		var full = getLastValue(tabScore[joueur].s20) + getLastValue(tabScore[joueur].s19) + getLastValue(tabScore[joueur].s18) + getLastValue(tabScore[joueur].s17) + getLastValue(tabScore[joueur].s16) + getLastValue(tabScore[joueur].s15) + getLastValue(tabScore[joueur].sbull); 
		testScore.push(tabScore[joueur].nom + "|" + getLastValue(tabScore[joueur].score) + "|" + full);
		minScore.push(getLastValue(tabScore[joueur].score));
	}
	var min = arrayMin(minScore);
	var indexArray = allIndexOf(minScore, min);
	var lenTab = indexArray.length;
	
	for (var i = 0; i < lenTab; i++) {
		if ((getLastValue(testScore[indexArray[i]].split("|")) == 21) || (currentRound == 21)) {
			win = true;
		}
		winner = winner + "</br>" + testScore[indexArray[i]].split("|")[0];
	}
	
	if (win) {
		if (i > 1) {
			intro = "winner are :";
		} else {
			intro = "winner is :";
		}
		intro = intro + "<div style='text-align: center;'>";
		drawWinPlayer(intro + winner.replace(/\<\/br>/, "") + "</div>");
		var noSleep = new NoSleep();
		noSleep.disable();
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

function addLocalStorage(arr, value) {
	var obj = getLocalStorage(arr);
	obj.push(value.toString());
	setLocalStorage(arr, obj);
}

function setLocalStorage(nomVar, value) {
	localStorage.setItem(nomVar, JSON.stringify(value));
}

function getLocalStorage(nomVar) {
	return JSON.parse(localStorage.getItem(nomVar));
}

function getLastValue(arr) {
	return getLastValueIndex(arr, 1);
}

function getLastValueIndex(arr, index) {
	if (arr != null) {
		if (arr.length >= index) {
			return arr[arr.length - index];
		} else {
			return arr[arr.length - 1];
		}
	} else {
		return 0;
	}
}

function addLastValueInArr(arr) {
	arr.push(getLastValue(arr));
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

function sanitize(input) {
	var sanitized = input.replace(/<script[^>]*?>.*?<\/script>/gi, '').
					 replace(/<[\/\!]*?[^<>]*?>/gi, '').
					 replace(/<style[^>]*?>.*?<\/style>/gi, '').
					 replace(/<![\s\S]*?--[ \t\n\r]*>/gi, '');
	return sanitized;
}

function next() {
	var tabCurrentPlayer = getLocalStorage("currentPlayer");
	var tabCurrentRound = getLocalStorage("currentRound");
	var tabCurrentDart = getLocalStorage("currentDart");
	var tabCurrentMiss = getLocalStorage("currentMiss");
	var currPlayer = getLastValue(tabCurrentPlayer);
	var currRound = parseInt(getLastValue(tabCurrentRound));
	var currDart = parseInt(getLastValue(tabCurrentDart));
	var currMiss = getLastValue(tabCurrentMiss);
	var nbJoueur = getNbJoueur();
	
	if (isNaN(currDart)) {
		var previousDart = parseInt(getLastValueIndex(tabCurrentDart, 2));
		if (isNaN(previousDart)) {
			previousDart = 0;
		}
		var currDart = previousDart + 1;
		if (currDart == 4) {
			currDart = 1;
		}
		$('.darts span').each(function(i, obj) {
			if ((i + 1) == currDart) {
				$(obj).html('MISS');
				addLocalStorage("currentDart", currDart);
				addLocalStorage("currentRound", currRound);
				addLocalStorage("currentPlayer", currPlayer);
				addLocalStorage("currentMiss", "MISS");
				updateScore("null", "null", "0");
			}
		});
	} 
	
	currDart = currDart + 1;
	if (currDart == 4) {
		currDart = 1;
	}
	$('.darts span').each(function(i, obj) {
		if ((i + 1) == currDart) {
			$(obj).html('<img src="/images/dart-o.png" class="dart">');
		} else {
			if ((i + 1) > currDart) {
				$(obj).html('<img src="/images/dart.png" class="dart">');
			}
		}
	});
	if (currDart == 1) {
		$("div.Joueur_" + currPlayer).each(function(i, obj) {
			var currentCSS = $(obj).css("background-color");
			if (currentCSS !== "rgb(0, 0, 0)") {
				$(obj).css({
					"background-color": colourBackground
				});
			}
		});
		if (parseInt(currPlayer) == nbJoueur) {
			currPlayer = "1";
			currRound = currRound + 1;
			$("#round").text(currRound);
		} else {
			currPlayer = parseInt(currPlayer) + 1;
		}
		$("div.Joueur_" + currPlayer).each(function(i, obj) {
			var currentCSS = $(obj).css("background-color");
			if (currentCSS !== "rgb(0, 0, 0)") {
				$(obj).css({
					"background-color": colourSelected
				});
			}
		});
	}
	currDart = "";
	addLocalStorage("currentRound", currRound);
	addLocalStorage("currentPlayer", currPlayer);
	addLocalStorage("currentDart", currDart);
	addLocalStorage("currentMiss", "");
	updateScore("null", "null", "0");
}

function drawWinPlayer(winner) {
	$('.table-responsive').css("pointer-events", "none");
	$('.table-responsive').css("cursor", "default");
	var modalStart = "<div class='mymodal-dialog'><div class='mymodal-content'><div class='mymodal-body'>";
	var modalEnd = "</div><div class='mymodal-footer'><button id='revengeGame' aria-label='Revenge'>Revenge</button><button id='restartGame' aria-label='Restart'>Restart</button></div></div></div>";
	$(".modalEndGame").html(modalStart + winner + modalEnd);
	$(".modalEndGame").css("display", "block");
	var url = "https://" + window.location.hostname;
	setLocalStorage("currentRound", ["1"]);
	setLocalStorage("currentDart", [""]);
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
	$("div.Joueur_1").css({
		"background-color": colourSelected
	});
	setLocalStorage("currentPlayer", ["1"]);
	setLocalStorage("currentRound", ["1"]);
	setLocalStorage("currentDart", [""]);
	setLocalStorage("currentMiss", [""]);
}

function updateScore(idRow, idColumn, point) {
	var tabScore = getTabScore();
	var currentPlayer = getLastValue(getLocalStorage("currentPlayer"));
	var currentRound = getLastValue(getLocalStorage("currentRound"));
	var nbJoueur = getLocalStorage("nbJoueur");
	var dicPoint = {"s20": 20, "s19": 19, "s18": 18, "s17": 17, "s16": 16, "s15": 15, "sbull": 25};
	var srow = "s" + idRow.toLowerCase();
	for (var joueur in tabScore) {
		for (var row in tabScore[joueur]) {
			switch (row) {
				case "nom":
				case "stats":
					break;
				case "score":
					if (point == 0) {
						var pointtoAdd = 0;
						if (srow != "snull") {
							if ((getLastValue(tabScore[joueur][srow]) != 3) && (joueur != idColumn)) {
								pointtoAdd = pointtoAdd + dicPoint[srow];
							}
						}
						var nouveauScore = getLastValue(tabScore[joueur][row]) + pointtoAdd;
						$('#' + joueur).text(nouveauScore);
						tabScore[joueur].score.push(nouveauScore);
					} else {
						addLastValueInArr(tabScore[joueur][row]);
					}
					break;
				case srow:
					if (point != 0) {
						if (joueur == idColumn) {
							tabScore[joueur][row].push(point);
							break;
						} 
					}
				default:
					addLastValueInArr(tabScore[joueur][row]);
			}
		}
		
		if (joueur == idColumn) {
			lastRound = parseInt(getLastValue(tabScore[joueur].stats).split(";")[0], 10);
			lastHit = parseInt(getLastValue(tabScore[joueur].stats).split(";")[1], 10);
			newHit = lastHit + 1;
			newStat = newHit / currentRound;
			newStat = newStat.toFixed(2);
			tabScore[joueur].stats.push(currentRound + ";" + newHit + ";" + newStat);
			$("#Stats_" + joueur).text(newStat);
		}
		else {
			if (idColumn == "null") {
				if (joueur[joueur.length - 1] != currentPlayer) {
					addLastValueInArr(tabScore[joueur].stats);
				}
				else {
					lastRound = parseInt(getLastValue(tabScore[joueur].stats).split(";")[0], 10);
					if (currentRound != lastRound) {
						lastHit = parseInt(getLastValue(tabScore[joueur].stats).split(";")[1], 10);
						newStat = lastHit / currentRound;
						newStat = newStat.toFixed(2);
						tabScore[joueur].stats.push(currentRound + ";" + lastHit + ";" + newStat);
						if ($("#Stats_" + joueur).text() != newStat) {
							$("#Stats_" + joueur).text(newStat);
						}
					}
					else {
						addLastValueInArr(tabScore[joueur].stats);
					}
				}
			}
			else {
				addLastValueInArr(tabScore[joueur].stats);
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

	if (((idColumn == "null") && (currentRound == 21)) || ((point == 3 || point == 0 || currentRound == 21) && (idColumn != "null"))) {
		finish();
	}
}

function refreshScreen() {
	var tabScore = getTabScore();
	var currentPlayer = getLastValue(getLocalStorage("currentPlayer"));
	var currentRound = getLastValue(getLocalStorage("currentRound"));
	var tabCurrentDart = getLocalStorage("currentDart");
	var tabCurrentMiss = getLocalStorage("currentMiss");
	var currentDart = parseInt(getLastValue(tabCurrentDart));
	var currentMiss = getLastValue(tabCurrentMiss);
	var previousDart = parseInt(getLastValueIndex(tabCurrentDart, 2));
	var nomPlayer = "Joueur_" + currentPlayer;
	var prefix = '<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">'
	var suffix = '</svg>'
	$("#round").text(currentRound);
	
	if (isNaN(currentDart)) {
		if (isNaN(previousDart)) {
			previousDart = 0;
		} 
		currentDart = previousDart + 1;
		if (currentDart == 4) {
			currentDart = 1;
		}
	}
	
	var index = 1;
	var processingDart = currentDart;
	while (processingDart != 0) {
		var nb = 0;
		var pt = "";
		if (!isNaN(parseInt(getLastValueIndex(tabCurrentDart, index)))) {
			pt = getLastValueIndex(tabCurrentMiss, index);
			nb = 1;
			index = index + 1;
			if (!isNaN(parseInt(getLastValueIndex(tabCurrentDart, index)))) {
				nb = 2;
				index = index + 1;
				if (!isNaN(parseInt(getLastValueIndex(tabCurrentDart, index)))) {
					nb = 3;
					index = index + 1;
				}
			}
		}
		$('.darts span').each(function(i, obj) {
			if ((i + 1) == processingDart) {
				if (nb == 0) {
					$(obj).html('<img src="/images/dart-o.png" class="dart">');
				} else {
					if (getLastValueIndex(tabCurrentMiss, (index - 1)) == "MISS") {
						$(obj).html("MISS");
					} else {
						$(obj).html(prefix + drawSVG(nb, nomPlayer) + suffix + ' ' + pt);
					}
				}
			} else {
				if ((i + 1) > currentDart) {
					$(obj).html('<img src="/images/dart.png" class="dart">');
				}
			}
		});
		index = index + 1
		processingDart = processingDart - 1;
	}
	
	for (var joueur in tabScore) {
		for (var row in tabScore[joueur]) {
			var srow = row.substring(1, row.length).replace("b", "B");
			switch (row) {
				case "score":
					$('#' + joueur).text(getLastValue(tabScore[joueur][row]));
					break;
				case "stats":
					var lastStat = getLastValue(tabScore[joueur][row]);
					lastHit = parseInt(lastStat.split(";")[1], 10);
					newStat = lastHit / currentRound;
					newStat = newStat.toFixed(2);
					if ($("#Stats_" + joueur).text() != newStat) {
						$("#Stats_" + joueur).text(newStat);
					}
					break;
				case "nom":
					break;
				default:
					var val = getLastValue(tabScore[joueur][row]);
					$("#" + srow + "_" + joueur).attr("svgid", val);
					$("#" + srow + "_" + joueur).html(drawSVG(val, joueur));
			}
		}
		
		if (joueur === nomPlayer) {
			$("div." + joueur).css({
				"background-color": colourSelected
			});
		} else {
			$("." + joueur).css({
				"background-color": colourBackground
			});
		}
		$(".joueur[name='" + joueur + "']").html(tabScore[joueur].nom);
	}
	
	var dict = {"20": "", "19": "", "18": "", "17": "", "16": "","15": "", "Bull": ""};
	
	Object.keys(dict).forEach(function(key) {
		griserLigne(key);
	});
}

function griserLigne(idRow) {
	var tabScore = getTabScore();
	var testScore = [];
	var griser = true;
	var srow = "s" + idRow.toLowerCase();
	for (var joueur in tabScore) {
		testScore.push(getLastValue(tabScore[joueur][srow]));
	}
	for (var i = 0; i < testScore.length; i++) {
		if (testScore[i] != 3) {
			griser = false;
		}
	}
	if (griser) {
		$(".Ligne_" + idRow + "[style*='display: flex;']").css({
			"background-color": colourEnded
		});
	} else {
		var currentPlayer = getLastValue(getLocalStorage("currentPlayer"));
		var currentNamePlayer = "Joueur_" + currentPlayer;
		$(".Ligne_" + idRow + "[style*='display: flex;']").each(function(i, obj) {
			var currentClassPlayer = "Joueur_" + i;
			if (currentClassPlayer === currentNamePlayer) {
				$(obj).css({
					"background-color": colourSelected
				});
			} else {
				if (i > 0) {
					$(obj).css({
						"background-color": colourBackground
					});
				} else {
					$(obj).css({
						"background-color": colourNext
					});
				}
			}
		});
	}
}

function drawSVG(svgid, joueur) {
	var widthHeight = 50;
	var strokeWidth = 8;
	var min = strokeWidth + ((strokeWidth - 7) * -2);
	var max = widthHeight - min;
	var tabColour = {};
	tabColour = getLocalStorage('colour');
	var strokeColour = tabColour[joueur];
	var filter = "<defs><filter id='shadow' width='200%' height='200%'><feOffset in='SourceGraphic' dx='3' dy='3' result='offsetOut'></feOffset><feColorMatrix result='matrixOut' in='offsetOut' type='matrix' values='0.2 0 0 0 0 0 0.2 0 0 0 0 0 0.2 0 0 0 0 0 1 0'></feColorMatrix><feGaussianBlur result='blurOut' in='matrixOut' stdDeviation='4'></feGaussianBlur><feBlend in='SourceGraphic' in2='blurOut' mode='normal'></feBlend></filter><filter id='light' filterUnits='userSpaceOnUse' width='200%' height='200%'><feGaussianBlur in='SourceAlpha' stdDeviation='4' result='blurOut'></feGaussianBlur><feOffset in='blurOut' dx='4' dy='4' result='offsetBlur'></feOffset><feSpecularLighting in='blurOut' surfaceScale='20' specularConstant='.25' specularExponent='4' lighting-color='#bbbbbb' result='specOut'><fePointLight x='-2000' y='-2000' z='200'></fePointLight></feSpecularLighting><feComposite in='specOut' in2='SourceAlpha' operator='in' result='specOut'></feComposite><feComposite in='SourceGraphic' in2='specOut' operator='arithmetic' k1='0' k2='1' k3='1' k4='0' result='litPaint'></feComposite></filter></defs><g filter='url(#light)'>";
	var line1 = "<line filter='url(#shadow)' y2='" + max + "' x2='" + min + "' y1='" + min + "' x1='" + max + "' fill-opacity='0' stroke-width='" + strokeWidth + "' stroke='" + strokeColour + "' /></g>";
	var line2 = "<line filter='url(#shadow)' y2='" + max + "' x2='" + max + "' y1='" + min + "' x1='" + min + "' fill-opacity='0' stroke-width='" + strokeWidth + "' stroke='" + strokeColour + "' />";
	var circle = "<circle fill-opacity='0' r='18' cy='25' cx='25' stroke-width='" + strokeWidth + "' stroke='" + strokeColour + "' />";
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

function drawDart(obj, d1, d2, d3) {
	switch (d1) {
		case "":
			$(obj).html('<img src="/images/dart.png" class="dart">');
		default:
			$(obj).html(d1);
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