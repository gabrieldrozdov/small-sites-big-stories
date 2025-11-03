const canvas = document.getElementById("mesh");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;

// 6 base colors
const baseColors = [
	"#F3A8DD", "#98DB6B", "#5ADDE8",
	"#fcc03a", "#A690FC", "#FF734D"
];

// Create "blobs"
let blobs = [];
for (let i=0; i<20; i++) {
	blobs.push({
		color: baseColors[Math.floor(Math.random()*baseColors.length)],
		x: Math.random() * width,
		y: Math.random() * height,
		r: width,
		dx: (Math.random() - .5) * 1,
		dy: (Math.random() - .5) * 1
	})
}

function draw() {
	ctx.clearRect(0, 0, width, height);
	ctx.globalAlpha = 1;
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, width, height);

	blobs.forEach(blob => {
		// Move blobs
		blob.x += blob.dx;
		blob.y += blob.dy;
		if (blob.x < 0 || blob.x > width) blob.dx *= -1;
		if (blob.y < 0 || blob.y > height) blob.dy *= -1;

		// Slight hue shift
		const hsl = rgbToHsl(...hexToRgb(blob.color));
		hsl[0] += (Math.random() - 0.5) * 0.002; // tiny hue drift
		blob.color = hslToHex(hsl[0], hsl[1], hsl[2]);

		// Draw blob
		const grad = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.r);
		grad.addColorStop(0, blob.color + "ff");
		grad.addColorStop(1, blob.color + "00");
		ctx.fillStyle = grad;
		ctx.fillRect(0, 0, width, height);
	});
	requestAnimationFrame(draw);
}

// Helpers
function hexToRgb(hex) {
	const bigint = parseInt(hex.slice(1), 16);
	return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}
function rgbToHsl(r, g, b) {
	r /= 255; g /= 255; b /= 255;
	const max = Math.max(r, g, b), min = Math.min(r, g, b);
	let h, s, l = (max + min) / 2;
	if (max === min) { h = s = 0; } else {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			case g: h = (b - r) / d + 2; break;
			case b: h = (r - g) / d + 4; break;
		}
		h /= 6;
	}
	return [h, s, l];
}
function hslToHex(h, s, l) {
	const hue2rgb = (p, q, t) => {
		if (t < 0) t += 1;
		if (t > 1) t -= 1;
		if (t < 1 / 6) return p + (q - p) * 6 * t;
		if (t < 1 / 2) return q;
		if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
		return p;
	};
	let r, g, b;
	if (s === 0) { r = g = b = l; } else {
		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}
	return "#" + [r, g, b].map(x => Math.round(x * 255).toString(16).padStart(2, "0")).join("");
}

draw();