"use strict";
(function (){ 

	const movesRange = 20;
	const generateArray = function(movesRange) {  //func generates random array for the game move sequence

	return Array(movesRange)
		   .fill()
		   .map(() => Math.floor(Math.random()*4));
	
};  const gameSettings = {

	gameSounds: [...Array(7).keys()].map((i) => $(`#sound${i}`)),
	userMessages: { ongoing: 'Good luck!', defeat: "You lose!", victory: "Victory!", wrongField: "Wrong field!", correct: "Correct!" },
	speedLvls: [900, 750, 475],
	value: 1,
	strictMode: false,
	movesCounter: 0,
	movesOrder: generateArray(movesRange)
	
};  const gameController = {

	counter: $('#counter'),
	gameField: $('.gameField'),
	strict: $('#strict'),
	infobox: $('#infobox'),

	incrementValue: function() {
		
		gameSettings.value < movesRange ? gameSettings.value++ : gameSettings.value;
		gameController.counter.html(gameSettings.value);
	},

	decrementValue: function() {
		
		gameSettings.value > 1 ? gameSettings.value-- : gameSettings.value;
		gameController.counter.html(gameSettings.value);
	},

	incMovesCount: function() {
		
		gameSettings.movesCounter += 1;
	},

	enableFields: function() {
		gameController.gameField.removeClass('unclickable');
	},

	disableFields: function() {
		gameController.gameField.addClass('unclickable');
	},

	reset: function () {
		var that = this;
		gameSettings.value = 1;
		gameController.counter.html(gameSettings.value);
		gameSettings.movesCounter = 0;
		gameSettings.movesOrder = generateArray();
		gameController.runGame();
	},

	setStrictMode: function() { 
		
		gameSettings.strictMode = !gameSettings.strictMode;
		gameController.strict.toggleClass('strictModeOn');
		gameSettings.gameSounds[4][0].play();
	},

	lastMove: function () { // function checks if the last user move was correct, if so, proceeds to next level

			this.disableFields();
			gameController.infobox.html(gameSettings.userMessages.correct);
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
			classReplacement = `field${fieldNumber}a`;

		$(field).toggleClass(classReplacement);
		setTimeout(() => $(field).toggleClass(classReplacement), 400);
	},

	runGame: function() { 

		let gameSpeed = gameController.setGameSpeed(),
			i = 0;

			gameController.disableFields();
			gameController.infobox.html(gameSettings.userMessages.ongoing);

			function loop() {         
   				setTimeout(function () {    

   					gameController.highlightBtn(gameSettings.movesOrder[i]);
   					gameSettings.gameSounds[gameSettings.movesOrder[i]][0].play();
			     	i++;   
			     	i < gameSettings.value ? loop() : gameController.enableFields();                      	
			   }, gameSpeed)
			};
			loop();
	}
}; 
	const Btn0 = new Button(0);
	const Btn1 = new Button(1);
	const Btn2 = new Button(2);
	const Btn3 = new Button(3);

function Button (index) {  //constructor function for making buttons

	this.field = "#field" + index,
	this.btnValue = index,
	this.checkMove = function () {

		if (this.btnValue === gameSettings.movesOrder[gameSettings.movesCounter]) {

			this.noise();
			gameController.incMovesCount();

			if (gameSettings.movesCounter === gameSettings.value) {
				gameSettings.movesCounter === movesRange ? gameController.infobox.html(gameSettings.userMessages.victory) : gameController.lastMove();
			}

		} else if (!gameSettings.strictMode) {

			gameController.disableFields();
			gameController.infobox.html(gameSettings.userMessages.wrongField);
			gameSettings.movesCounter = 0;
			setTimeout(() => gameController.runGame(), 1000);
		
		} else if (gameSettings.strictMode) {

			gameController.infobox.html(gameSettings.userMessages.defeat);
			gameSettings.gameSounds[6][0].play();
			setTimeout(() => gameController.reset(), 3000);
		}
	}

	this.noise = function () {
		return gameSettings.gameSounds[index][0].play();
	};

	$(this.field).on('click', () => this.checkMove());
}

$('#incCounter').on('click', gameController.incrementValue);
$('#decCounter').on('click', gameController.decrementValue);
$('#start').on('click', gameController.runGame);
$('#reset').on('click', gameController.reset);
gameController.strict.on('click', gameController.setStrictMode);
gameController.strict.hover(() => $('.cloudInfo').toggleClass('invisible'));

}());