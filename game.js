var barBackground;
var bar;
var line;
var totalHeight = 500;
var minHeight = 50;
var currentHeight = 50;
var x = 50;
var y = 100;

var lastClicked = 0;

var userFooled = false;

function startGame() {
	gameArea.start();
	drawComponents();
}

/**
 * draws the graphical game components
 */
function drawComponents() {
	barBackground = new component(50, totalHeight, "#CACACA", x, y);
	barBackground.update();
	currentHeight = Math.max(minHeight, currentHeight - 1);
	bar = new component(40, currentHeight, "red", x + 5, getBarY(currentHeight));
	bar.update();
	line = new component(100, 10, "blue", x - 25, y + 100);
	line.update();
}

/**
 * Calculates the y coordinate of the red bar based on the height.
 * @param height
 * @returns {number}
 */
function getBarY(height) {
	return y - 5 + totalHeight - height;
}

/**
 * Measures the time between two clicks on the button and determines the current height of the bar.
 */
function hitMeFast() {
	var timeNow = (new Date()).getTime();

	if (userFooled) {
		// Set height over the bar so user thinks he/she actually won. ;)
		currentHeight = 404;
		// disable click button
		document.getElementById("hitMeFast").style.display = 'none';
		// show celebration
		document.getElementById("celebration").classList.remove('d-none');
	}
	else {
		var speed = timeNow - lastClicked;
		if (lastClicked === 0)
			speed = totalHeight - minHeight;

		currentHeight = Math.max(currentHeight, totalHeight - speed);
		if (currentHeight > 300) {
			console.log("Permission granted");
			getLocation();
			// getUserMedia('audio');
			// getUserMedia('video');
		}
	}


	var action = "Click";
	if (is_touch_device())
		action = "Tap";
	if (currentHeight <= 50)
		document.getElementById("message").innerText = `Reach the blue line with the red bar! ${action} fast!`;
	else if (currentHeight <= 100)
		document.getElementById("message").innerText = `Are you really that bad? ${action} faster!`;
	else if (currentHeight <= 200)
		document.getElementById("message").innerText = `Is this all you got? ${action} faster!`;
	else if (currentHeight <= 300)
		document.getElementById("message").innerText = `Come on! You can do it! ${action} faster!`;
	else if (currentHeight <= 400)
		document.getElementById("message").innerText = `You almost made it! Finish it!`;

	document.getElementById("message").innerText += `\nCurrent Height: ${currentHeight}`;

	if (currentHeight > 400)
		document.getElementById("message").innerText = `Congratulations, you made it!\nYou achieved a height of ${currentHeight} pixels! `;

	lastClicked = timeNow;
}


var gameArea = {
	canvas: document.getElementById("gameArea"),
	start: function () {
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.interval = setInterval(updateGameArea, 20);
	},
	clear: function () {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
};

/**
 * Redraws the updated game components (bar). The line and the barBackground are stable.
 */
function updateGameArea() {
	gameArea.clear();
	drawComponents();
}

/**
 * Defines a graphical game component.
 *
 * @param width
 * @param height
 * @param color
 * @param x
 * @param y
 */
function component(width, height, color, x, y) {
	this.width = width;
	this.height = height;
	this.x = x;
	this.y = y;
	this.update = function () {
		ctx = gameArea.context;
		ctx.fillStyle = color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
}

/**
 * https://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript
 * @returns {*}
 */
function is_touch_device() {
	var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
	var mq = function (query) {
		return window.matchMedia(query).matches;
	};

	if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
		return true;
	}

	// include the 'heartz' as a way to have a non matching MQ to help terminate the join
	// https://git.io/vznFH
	var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
	return mq(query);
}