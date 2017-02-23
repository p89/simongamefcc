"use strict";
const rndGenerator = {

	generateArray: function() {  //func generates random array for the game move sequence

	let array = [];
	for (let i = 0; i < 20; i++) {
		array.push(Math.floor(Math.random()*4));
	}
	return array;
	}

},  gameSettings = {

	gameSounds: [$('#sound0')[0], $('#sound1')[0], $('#sound2')[0], $('#sound3')[0], $('#sound4')[0], $('#sound5')[0], $('#sound6')[0]],
	userMessages: { ongoing: 'Good luck!', defeat: "You lose!", victory: "Victory!", wrongField: "Wrong field!", correct: "Correct!" },
	speedLvls: [900, 750, 475],
	value: 1,
	strictMode: false,
	movesCounter: 0,
	movesRange: 20,
	movesOrder: rndGenerator.generateArray(),

},  gameController = {

	incrementValue: function() {
		
		gameSettings.value < 20 ? gameSettings.value++ : gameSettings.value;
		$('#counter').html(gameSettings.value);
	},

	decrementValue: function() {
		
		gameSettings.value > 1 ? gameSettings.value-- : gameSettings.value;
		$('#counter').html(gameSettings.value);
	},

	incMovesCount: function() {
		
		gameSettings.movesCounter += 1;
	},

	enableFields: function() {
		$('.gameField').removeClass('unclickable');
	},

	disableFields: function() {
		$('.gameField').addClass('unclickable');
	},

	reset: function () {

		gameSettings.value = 1;
		$('#counter').html(gameSettings.value);
		gameSettings.movesCounter = 0;
		gameSettings.movesOrder = rndGenerator.generateArray();
		this.runGame();
	},

	setStrictMode: function() { 
		
		gameSettings.strictMode == false ? gameSettings.strictMode = true : gameSettings.strictMode = false;
		$('#strict').toggleClass('strictModeOn');
		gameSettings.gameSounds[4].play();
	},

	lastMove: function () { // function checks if the last user move was correct, if so, proceeds to next level

			this.disableFields();
			$('#infobox').html(gameSettings.userMessages.correct);
			gameSettings.movesCounter = 0;
			this.incrementValue();
			setTimeout(this.runGame, 1500);
	},

	setGameSpeed: function() { 

		if (gameSettings.value < 8) {
				return gameSettings.speedLvls[0];
			} else if (gameSettings.value < 15) {
				return gameSettings.speedLvls[1];
			} else {
				return gameSettings.speedLvls[2];
		}
	},

	highlightBtn: function(fieldNumber) { // function is reponsible for toggling classes to mark buttons chosen by comp

		let field = "#field" + fieldNumber,
			classReplacement = "";

		switch(fieldNumber) {
		    case 0:
		        classReplacement = "field0a";
		        break;
		    case 1:
		        classReplacement = "field1a";
		        break;
		    case 2:
		        classReplacement = "field2a";
		        break;
		    case 3:
		        classReplacement = "field3a";
		        break;
		}

		$(field).toggleClass(classReplacement);
		setTimeout(() => $(field).toggleClass(classReplacement), 400);
	},

	runGame: function() { 

		let gameSpeed = gameController.setGameSpeed(),
			i = 0;

			gameController.disableFields();
			$('#infobox').html(gameSettings.userMessages.ongoing);

			function loop() {         
   				setTimeout(function () {    

   					gameController.highlightBtn(gameSettings.movesOrder[i]);
			     	gameSettings.gameSounds[gameSettings.movesOrder[i]].play();
			     	i++;   
			     	i < gameSettings.value ? loop() : gameController.enableFields();                      	
			   }, gameSpeed)
			};
			loop();
	}
},
	Btn0 = new Button(0),
	Btn1 = new Button(1),
	Btn2 = new Button(2),
	Btn3 = new Button(3);

function Button (index) {  //constructor function for making buttons

	this.field = "#field" + index,
	this.btnValue = index,
	this.checkMove = function () {

		if (this.btnValue === gameSettings.movesOrder[gameSettings.movesCounter]) {

			this.noise();
			gameController.incMovesCount();

			if (gameSettings.movesCounter === gameSettings.value) {
				gameSettings.movesCounter === 20 ? $('#infobox').html(gameSettings.userMessages.victory) : gameController.lastMove();
			}

		} else if (!gameSettings.strictMode) {

			gameController.disableFields();
			$('#infobox').html(gameSettings.userMessages.wrongField);
			gameSettings.movesCounter = 0;
			setTimeout(() => gameController.runGame(), 1000);
		
		} else if (gameSettings.strictMode) {

			$('#infobox').html(gameSettings.userMessages.defeat);
			gameSettings.gameSounds[6].play();
			setTimeout(() => gameController.reset(), 3000);
		}
	}

	this.noise = function () {
		return gameSettings.gameSounds[index].play();
	};

	$(this.field).on('click', () => this.checkMove());
}

$('#incCounter').on('click', () => gameController.incrementValue());
$('#decCounter').on('click', () => gameController.decrementValue());
$('#start').on('click', () => gameController.runGame());
$('#reset').on('click', () => gameController.reset());
$('#strict').on('click', () => gameController.setStrictMode());
$('#strict').hover( () => $('.cloudInfo').toggleClass('invisible'), () => $('.cloudInfo').toggleClass('invisible'));