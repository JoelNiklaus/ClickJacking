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

	/*
	document.write(''
		+ 'Browser name  = ' + browserName + '<br>'
		+ 'Full version  = ' + fullVersion + '<br>'
		+ 'Major version = ' + majorVersion + '<br>'
		+ 'navigator.appName = ' + navigator.appName + '<br>'
		+ 'navigator.userAgent = ' + navigator.userAgent + '<br>'
	);
	*/

	return browserName;
}

/**
 * http://www.javascripter.net/faq/browserw.htm
 */
function getBrowserWindowSize() {
	var winW = 630, winH = 460;
	if (document.body && document.body.offsetWidth) {
		winW = document.body.offsetWidth;
		winH = document.body.offsetHeight;
	}
	if (document.compatMode === 'CSS1Compat' &&
		document.documentElement &&
		document.documentElement.offsetWidth) {
		winW = document.documentElement.offsetWidth;
		winH = document.documentElement.offsetHeight;
	}
	if (window.innerWidth && window.innerHeight) {
		winW = window.innerWidth;
		winH = window.innerHeight;
	}

	/*
	document.writeln('Window width = ' + winW);
	document.writeln('Window height = ' + winH);
	*/

	return {
		winW: winW,
		winH: winH
	};
}

/**
 * http://www.javascripter.net/faq/operatin.htm
 */
function getOSName() {
	// This script sets OSName variable as follows:
	// "Windows"    for all versions of Windows
	// "MacOS"      for all versions of Macintosh OS
	// "iPhone"      for all versions of iPhone
	// "iPad"      for all versions of iPad
	// "Linux"      for all versions of Linux
	// "Android"      for all versions of Android
	// "UNIX"       for all other UNIX flavors
	// "Unknown OS" indicates failure to detect the OS

	var osName = "Unknown OS";
	if (navigator.appVersion.indexOf("Win") != -1) osName = "Windows";
	if (navigator.appVersion.indexOf("Mac") != -1) osName = "MacOS";
	if (navigator.appVersion.indexOf("iPhone") != -1) osName = "iPhone";
	if (navigator.appVersion.indexOf("iPad") != -1) osName = "iPad";
	if (navigator.appVersion.indexOf("Linux") != -1) osName = "Linux";
	if (navigator.appVersion.indexOf("Android") != -1) osName = "Android";
	if (navigator.appVersion.indexOf("X11") != -1) osName = "UNIX";

	/*
	document.write('Your OS: ' + osName);
	*/

	return osName;
}
