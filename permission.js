var lastClicked = 0;

/**
 * Loads the json file containing the locations of the permission dialogs on many different operating systems and browsers.
 * On successful load, position the 'hitmefast'-button at the place of the 'allow'-button.
 */
function fetchPermissionDialogLocations() {
	// asynchronously loads the locations of the permission dialogs in the different browsers
	fetch('permissionDialogLocations.json')
		.then(response => response.json())
		.then(permissionDialogLocations => {
			var coordinates = permissionDialogLocations[getOSName()][getBrowserName()];
			console.log(getOSName(), getBrowserName(), coordinates);
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

/**
 * Trigger the permission dialog
 */
function getLocation() {
	if (navigator.geolocation) { // triggers the html5 permission dialog!
		navigator.geolocation.getCurrentPosition(showPosition, showError);
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

	var img_url = "https://maps.googleapis.com/maps/api/staticmap?center="
		+ latlon + "&zoom=14&size=400x300&sensor=false&key=AIzaSyBfR9JjkIjVBmQp6U7wbcxmJ1SmwOOR7jY";

	document.getElementById("mapholder").innerHTML = "<img src='" + img_url + "'>";
}

/**
 * Log an error in case the permission was not given.
 *
 * @param error
 */
function showError(error) {
	switch (error.code) {
		case error.PERMISSION_DENIED:
			console.log("User denied the request for Geolocation.");
			break;
		case error.POSITION_UNAVAILABLE:
			console.log("Location information is unavailable.");
			break;
		case error.TIMEOUT:
			console.log("The request to get user location timed out.");
			break;
		case error.UNKNOWN_ERROR:
			console.log("An unknown error occurred.");
			break;
	}
}