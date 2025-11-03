// Get JSON
const fs = require('fs');
const storyData = require('./stories.json');

// Generate homepage
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let maxLines = 0;
function generateOverview() {
	let homeIndex = '';
	for (let storyKey of Object.keys(storyData)) {
		let activeStoryData = storyData[storyKey];

		let date = activeStoryData['date'];
		let details = `<li>Published ${months[date[0]-1]} ${date[1]}, ${date[2]}</li>`;
		for (let detail of activeStoryData['details']) {
			details += `<li>${detail}</li>`;
		}

		homeIndex += `
			<a href="/stories/?story=${storyKey}" class="home-index-link" data-lines="${activeStoryData['lines']}">
				<div class="home-index-link-decoration"></div>
				<div class="home-index-link-lines">
					<div class="home-index-link-lines-number">${activeStoryData['lines']}</div>
					<div class="home-index-link-lines-text">Lines of Code</div>
				</div>
					<div class="home-index-link-decoration"></div>
				<div class="home-index-link-heading">
					<h2 class="home-index-link-title">
						${activeStoryData['title']}
					</h2>
					<ul class="home-index-link-details">
						${details}
					</ul>
				</div>
				<div class="home-index-link-decoration"></div>
			</a>
		`;

		// Update max lines if needed
		maxLines = Math.max(maxLines, activeStoryData['lines']);
	}

	// Put everything together
	let homeContent = `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Small Sites; Big Stories, by GD with GD</title>
		
			<meta name="author" content="Gabriel Drozdov / GD with GD">
			<meta name="keywords" content="Web Design, Web Development, Creative Coding, Design Education, Code Education, Storytelling, Pedagogy">
			<meta name="description" content="Websites written using as little code as possible!">
			<meta property="og:url" content="https://smallsites.gdwithgd.com/">
			<meta name="og:title" property="og:title" content="Small Sites; Big Stories, by GD with GD">
			<meta property="og:description" content="Websites written using as little code as possible!">
			<meta property="og:image" content="/assets/meta/opengraph.jpg">
			<link rel="icon" type="png" href="/assets/meta/favicon.png">
			<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📚</text></svg>">
		
			<link rel="stylesheet" href="/home.css">
		</head>
		<body>
			<main class="home-container" data-transition="1">
				<header class="home-header">
					<h1 class="home-title">
						<span class="home-title-line1">Small Sites;</span>
						<span class="home-title-line2">Big Stories</span>
					</h1>
					<p class="home-desc">
						Websites written using as little code as possible, by <a href="https://gdwithgd.com/" target="_blank">GD with GD</a>
					</p>
				</header>
		
				<div class="home-filter">
					<div class="home-filter-value">
						<span class="home-filter-value-label">Min</span>
						<span id="home-filter-min-value" class="home-filter-value-number">0</span>
					</div>
					<div class="home-filter-slider-container">
						<h2 class="home-filter-slider-title">Lines of Code</h2>
						<div class="home-filter-slider">
							<input type="range" id="home-filter-min-range" min="0" max="${maxLines}" value="0">
							<input type="range" id="home-filter-max-range" min="0" max="${maxLines}" value="${maxLines}">
							<div class="home-filter-slider-track"></div>
						</div>
					</div>
					<div class="home-filter-value">
						<span class="home-filter-value-label">Max</span>
						<span id="home-filter-max-value" class="home-filter-value-number">${maxLines}</span>
					</div>
				</div>
		
				<nav class="home-index">
					${homeIndex}
				</nav>
				<div class="home-floor"></div>
		
				<div class="home-vignette"></div>
				<div class="home-color"></div>
			</main>
		
			<script src="/home.js"></script>
		</body>
		</html>
	`;

	// Create homepage file
	fs.writeFile(`index.html`, homeContent, err => {
		if (err) {
			console.error(err);
		}
	});
}
generateOverview();