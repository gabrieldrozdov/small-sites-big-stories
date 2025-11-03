// Assign random colors
const colors = ['pink', 'green', 'blue', 'yellow', 'purple', 'red'];
let index = 0;
const links = document.querySelectorAll('.home-index-link');
for (let link of links) {
	// Colors and texture
	const color = colors[Math.floor(Math.random()*colors.length)];
	link.style.setProperty('--primary', `var(--${color})`);
	link.style.setProperty('--primary-rgb', `var(--${color}-rgb)`);
	link.style.setProperty('--bookedge', `url('/assets/ui/bookedge${Math.ceil(Math.random()*4)}.jpg')`);

	// Add decorative elements
	link.innerHTML = `
		<div class="home-index-link-content">
			${link.innerHTML}
		</div>
	`;

	// Position
	let marginLeft = Math.random()*10;
	let marginRight = 10-marginLeft;
	link.style.margin = `0px ${marginRight}% -2px ${marginLeft}%`;

	// Book size
	link.style.setProperty('--book-size', `${Math.random()*15+10}%`);
	link.style.minHeight = `${Math.random()*250}px`;
	// link.style.zIndex = Math.r;

	// Animation delay
	let delay = (5-index)*50;
	link.style.animationDelay = `${delay}ms`;
	index++;
}

// Filter slider
const minRange = document.querySelector("#home-filter-min-range");
const maxRange = document.querySelector("#home-filter-max-range");
const minValue = document.querySelector("#home-filter-min-value");
const maxValue = document.querySelector("#home-filter-max-value");
const sliderTrack = document.querySelector(".home-filter-slider-track");
const maxAllowedGap = 1; // prevent overlap

function updateSlider(e) {
	let min = parseInt(minRange.value);
	let max = parseInt(maxRange.value);

	if (max - min <= maxAllowedGap) {
		if (e.target === minRange) {
			minRange.value = max - maxAllowedGap;
		} else {
			maxRange.value = min + maxAllowedGap;
		}
		min = parseInt(minRange.value);
		max = parseInt(maxRange.value);
	}

	minValue.textContent = min;
	maxValue.textContent = max;

	const percentMin = (min / parseInt(minRange.max)) * 100;
	const percentMax = (max / parseInt(maxRange.max)) * 100;

	sliderTrack.style.background = `linear-gradient(to right, 
    var(--light-gray) ${percentMin}%, 
    var(--dark-gray) ${percentMin}%, 
    var(--dark-gray) ${percentMax}%, 
    var(--light-gray) ${percentMax}%)`;

	// Hide/show elements
	for (let link of document.querySelectorAll('.home-index-link')) {
		let lines = parseInt(link.dataset.lines);
		if (lines <= max && lines >= min) {
			link.dataset.active = 1;
		} else {
			link.dataset.active = 0;
		}
	}
}

minRange.addEventListener("input", updateSlider);
maxRange.addEventListener("input", updateSlider);

updateSlider(); // initialize

// Transition when link pressed
for (let link of document.querySelectorAll('.home-index-link')) {
	const container = document.querySelector('.home-container');
	link.addEventListener('click', (e) => {
		container.dataset.transition = 1;
		e.preventDefault();
		for (let link of document.querySelectorAll('.home-index-link-content')) {
			link.style.transition = `${Math.random()*.2+.25}s cubic-bezier(0.36, 0, 0.66, -0.56)`;
			if (Math.random() < .5) {
				link.style.transform = `translateX(-100vw)`;
			} else {
				link.style.transform = `translateX(100vw)`;
			}
		}
		setTimeout(() => {
			window.location.href = link.href;
		}, 500)
	})
}
setTimeout(() => {
	document.querySelector('.home-container').dataset.transition = 0;
}, 50)

// Reset animation if going back a page
window.addEventListener('pageshow', (event) => {
	if (event.persisted) {
		const container = document.querySelector('.home-container');
		container.dataset.transition = 1;
		for (let link of document.querySelectorAll('.home-index-link')) {
			link.style.transition = '';
			link.style.transform = '';
		}
	}
});