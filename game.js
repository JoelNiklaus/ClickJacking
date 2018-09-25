var barBackground;
var bar;
var line;
var totalHeight = 500;
var minHeight = 50;
var currentHeight = 50;
var x = 500;
var y = 100;


var lastClicked = 0;

function fetchPermissionDialogLocations() {
    // asynchronously loads the locations of the permission dialogs in the different browsers
    fetch('permissionDialogLocations.json')
        .then(response => response.json())
        .then(permissionDialogLocations => {
            var coordinates = permissionDialogLocations.desktop[getBrowserName()];
            console.log(coordinates)
            var hitMeFastButton = document.getElementById("hitMeFast");
            hitMeFastButton.style.position = "absolute";
            hitMeFastButton.style.left = coordinates.xStart + "px";
            hitMeFastButton.style.top = coordinates.yEnd + "px";
            hitMeFastButton.style.width = coordinates.xEnd - coordinates.xStart + "px";
            hitMeFastButton.style.height = coordinates.yEnd - coordinates.yStart + "px";
        })
        .catch(function (error) {
            console.log(error);
        });
}


function startGame() {
    gameArea.start();
    drawComponents();
}

/**
 * draws the graphical game components
 */
function drawComponents() {
    barBackground = new component(60, totalHeight, "#CACACA", x, y);
    barBackground.update();
    currentHeight = Math.max(minHeight, currentHeight - 1);
    bar = new component(50, currentHeight, "red", x + 5, getBarY(currentHeight));
    bar.update();
    line = new component(100, 10, "blue", x - 20, y + 100);
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
    if (lastClicked === 0)
        speed = totalHeight - minHeight;

    currentHeight = Math.max(currentHeight, totalHeight - speed);

    if (currentHeight <= 50)
        document.getElementById("message").innerText = "Click as fast as possible to reach the blue line with the red bar!";
    else if (currentHeight <= 100)
        document.getElementById("message").innerText = "Are you really that bad?";
    else if (currentHeight <= 200)
        document.getElementById("message").innerText = "Is this all you got?";
    else if (currentHeight <= 400)
        document.getElementById("message").innerText = "You almost made it!";
    else if (currentHeight >= 450)
        document.getElementById("message").innerText = "Congratulations, you made it! You achieved a height of " + currentHeight + " pixels! " +
            "You have just participated in a security experiment. Did you notice that we have access to your x now?" +
            " We know exactly where you are, although you did not consciously give us permission.";

    console.log(currentHeight);

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
};

//var x = document.getElementById("map");

function getLocation() {
    if (navigator.geolocation) { // triggers the html5 permission dialog!
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        showError();
    }
}

function showPosition(position) {
    var latlon = position.coords.latitude + "," + position.coords.longitude;

    var img_url = "https://maps.googleapis.com/maps/api/staticmap?center="
        + latlon + " & zoom = 14 & size = 400x300 & sensor = false & key = YOUR_:KEY";

    document.getElementById("mapholder").innerHTML = "<img src='" + img_url + "'>";
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            x.innerHTML = "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML = "Location information is unavailable."
            break;
        case error.TIMEOUT:
            x.innerHTML = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            x.innerHTML = "An unknown error occurred."
            break;
    }
}


/**
 * http://www.javascripter.net/faq/browsern.htm
 */
function getBrowserName() {
    var nVer = navigator.appVersion;
    var nAgt = navigator.userAgent;
    var browserName = navigator.appName;
    var fullVersion = '' + parseFloat(navigator.appVersion);
    var majorVersion = parseInt(navigator.appVersion, 10);
    var nameOffset, verOffset, ix;

// In Opera 15+, the true version is after "OPR/"
    if ((verOffset = nAgt.indexOf("OPR/")) != -1) {
        browserName = "Opera";
        fullVersion = nAgt.substring(verOffset + 4);
    }
// In older Opera, the true version is after "Opera" or after "Version"
    else if ((verOffset = nAgt.indexOf("Opera")) != -1) {
        browserName = "Opera";
        fullVersion = nAgt.substring(verOffset + 6);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
            fullVersion = nAgt.substring(verOffset + 8);
    }
// In MSIE, the true version is after "MSIE" in userAgent
    else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
        browserName = "Microsoft Internet Explorer";
        fullVersion = nAgt.substring(verOffset + 5);
    }
// In Chrome, the true version is after "Chrome"
    else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
        browserName = "Chrome";
        fullVersion = nAgt.substring(verOffset + 7);
    }
// In Safari, the true version is after "Safari" or after "Version"
    else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
        browserName = "Safari";
        fullVersion = nAgt.substring(verOffset + 7);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
            fullVersion = nAgt.substring(verOffset + 8);
    }
// In Firefox, the true version is after "Firefox"
    else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
        browserName = "Firefox";
        fullVersion = nAgt.substring(verOffset + 8);
    }
// In most other browsers, "name/version" is at the end of userAgent
    else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) <
        (verOffset = nAgt.lastIndexOf('/'))) {
        browserName = nAgt.substring(nameOffset, verOffset);
        fullVersion = nAgt.substring(verOffset + 1);
        if (browserName.toLowerCase() == browserName.toUpperCase()) {
            browserName = navigator.appName;
        }
    }
// trim the fullVersion string at semicolon/space if present
    if ((ix = fullVersion.indexOf(";")) != -1)
        fullVersion = fullVersion.substring(0, ix);
    if ((ix = fullVersion.indexOf(" ")) != -1)
        fullVersion = fullVersion.substring(0, ix);

    majorVersion = parseInt('' + fullVersion, 10);
    if (isNaN(majorVersion)) {
        fullVersion = '' + parseFloat(navigator.appVersion);
        majorVersion = parseInt(navigator.appVersion, 10);
    }

    return browserName;

    /*document.write(''
        + 'Browser name  = ' + browserName + '<br>'
        + 'Full version  = ' + fullVersion + '<br>'
        + 'Major version = ' + majorVersion + '<br>'
        + 'navigator.appName = ' + navigator.appName + '<br>'
        + 'navigator.userAgent = ' + navigator.userAgent + '<br>'
    )*/
}