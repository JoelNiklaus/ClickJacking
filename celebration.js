let width = window.innerWidth;
let height = window.innerHeight;
const canvas = document.getElementById("celebration");
const context = canvas.getContext("2d");
const maxConfettis = 150;
const particles = [];

const possibleColors = [
	"DodgerBlue",
	"OliveDrab",
	"Gold",
	"Pink",
	"SlateBlue",
	"LightBlue",
	"Gold",
	"Violet",
	"PaleGreen",
	"SteelBlue",
	"SandyBrown",
	"Chocolate",
	"Crimson"
];

function randomFromTo(from, to) {
	return Math.floor(Math.random() * (to - from + 1) + from);
}

function confettiParticle() {
	this.x = Math.random() * width; // x
	this.y = Math.random() * height - height; // y
	this.r = randomFromTo(11, 33); // radius
	this.d = Math.random() * maxConfettis + 11;
	this.color =
		possibleColors[Math.floor(Math.random() * possibleColors.length)];
	this.tilt = Math.floor(Math.random() * 33) - 11;
	this.tiltAngleIncremental = Math.random() * 0.07 + 0.05;
	this.tiltAngle = 0;

	this.draw = function() {
		context.beginPath();
		context.lineWidth = this.r / 2;
		context.strokeStyle = this.color;
		context.moveTo(this.x + this.tilt + this.r / 3, this.y);
		context.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 5);
		return context.stroke();
	};
}

function Draw() {
	const results = [];

	// Magical recursive functional love
	requestAnimationFrame(Draw);

	context.clearRect(0, 0, width, window.innerHeight);

	for (var i = 0; i < maxConfettis; i++) {
		results.push(particles[i].draw());
	}

	let particle = {};
	let remainingFlakes = 0;
	for (var i = 0; i < maxConfettis; i++) {
		particle = particles[i];

		particle.tiltAngle += particle.tiltAngleIncremental;
		particle.y += (Math.cos(particle.d) + 3 + particle.r / 2) / 2;
		particle.tilt = Math.sin(particle.tiltAngle - i / 3) * 15;

		if (particle.y <= height) remainingFlakes++;

		// If a confetti has fluttered out of view,
		// bring it back to above the viewport and let if re-fall.
		if (particle.x > width + 30 || particle.x < -30 || particle.y > height) {
			particle.x = Math.random() * width;
			particle.y = -30;
			particle.tilt = Math.floor(Math.random() * 10) - 20;
		}
	}

	return results;
}

window.addEventListener(
	"resize",
	function() {
		width = window.innerWidth;
		height = window.innerHeight;
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	},
	false
);

// Push new confetti objects to `particles[]`
for (var i = 0; i < maxConfettis; i++) {
	particles.push(new confettiParticle());
}

// Initialize
canvas.width = width;
canvas.height = height;
Draw();
