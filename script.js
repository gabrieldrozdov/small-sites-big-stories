// Intro
let colors = ["red", "blue", "purple", "yellow", "green", "pink"];
let activeColor = Math.floor(Math.random()*colors.length);
let colorLoop = true;
function setRandomColor() {
	if (colorLoop) {
		activeColor++;
		if (activeColor >= colors.length) {
			activeColor = 0;
		}
		document.documentElement.style.setProperty('--primary', "var(--"+colors[activeColor]+")");
		setTimeout(() => {
			setRandomColor();
		}, 2000)
	}
}
setTimeout(setRandomColor, 50);
let intro = document.querySelector(".intro");
function introOut() {
	intro.style.transform = "translate(0%, -100%)";
	setSorting("random");
}
function introOutInstant() {
	let temp = intro.style.transition;
	intro.style.transition = "unset";
	intro.style.transform = "translate(0%, -100%)";
	setTimeout(() => {
		intro.style.transition = temp;
	}, 50)
}
function introIn() {
	intro.style.transform = "translate(0%, 0%)";

	let introTitle = document.querySelector(".intro-title");
	introTitle.style.transform = "translateY(0px)";

	let introSubtitle = document.querySelector(".intro-subtitle");
	introSubtitle.style.transform = "translateY(0px)";
	introSubtitle.style.opacity = 1;

	let introMenuBorder = document.querySelector(".intro-menu-border");
	introMenuBorder.style.transform = "translateY(0px)";
	introMenuBorder.style.opacity = 1;
	introMenuBorder.style.pointerEvents = "all";
}
function introRestart() {
	activeColor = Math.floor(Math.random()*colors.length);
	colorLoop = true;
	setTimeout(setRandomColor, 50);

	introIn();

	if (mainState == "in") {
		mainDown();
	} else if (mainState == "up") {
		mainDownInstant();
	}

	if (catalogState == "in") {
		catalogDown();
	} else if (catalogState == "up") {
		catalogDownInstant();
	}

	if (aboutState == "in") {
		aboutDown();
	} else if (aboutState == "up") {
		aboutDownInstant();
	}
}

// About section toggles
function toggleAbout(section) {
	let aboutSections = document.querySelectorAll(`.about-section`);
	let aboutSection = document.querySelector(`#about-${section}`);
	// Close all other sections
	for (let i of aboutSections) {
		if (aboutSection != i) {
			i.dataset.active = 0;
		}
	}
	// Toggle selected section
	if (parseInt(aboutSection.dataset.active) == 0) {
		aboutSection.dataset.active = 1;
	} else {
		aboutSection.dataset.active = 0;
	}
}
// Close all about sections
function closeAbout() {
	let aboutSections = document.querySelectorAll(`.about-section`);
	// Close all other sections
	for (let i of aboutSections) {
		i.dataset.active = 0;
	}

}

// Navigation
let about = document.querySelector(".about-container");
let aboutState = "down";
function aboutIn() {
	if (colorLoop == false) {
		colorLoop = true;
		setTimeout(setRandomColor, 50);
	}
	aboutState = "in";
	about.style.transform = "translate(0%, 0%)";
	
	// Scroll to top and close all toggles
	let aboutContent = document.querySelector(".about");
	aboutContent.scrollTop = 0;
	closeAbout();
}
function aboutUp() {
	aboutState = "up";
	about.style.transform = "translate(0%, -100%)";
}
function aboutUpInstant() {
	aboutState = "up";
	let temp = about.style.transition;
	about.style.transition = "unset";
	about.style.transform = "translate(0%, -100%)";
	setTimeout(() => {
		about.style.transition = temp;
	}, 50)
}
function aboutDown() {
	aboutState = "down";
	about.style.transform = "translate(0%, 100%)";
}
function aboutDownInstant() {
	aboutState = "down";
	let temp = about.style.transition;
	about.style.transition = "unset";
	about.style.transform = "translate(0%, 100%)";
	setTimeout(() => {
		about.style.transition = temp;
	}, 50)
}

let main = document.querySelector(".main");
let mainState = "down";
function mainIn() {
	colorLoop = false;
	mainState = "in";
	main.style.transform = "translate(0%, 0%)";
	if (window.innerWidth > 1200) {
		openPanelStory();
		openPanelCode();
	}
	
	// Scroll to top
	let storyContent = document.querySelector(".story-content");
	storyContent.scrollTop = 0;

	// Make sure a story is active
	let url = new URL(window.location.href);
	let params = new URLSearchParams(url.search);
	if (activeStory != "" && params.get("site") != activeStory) {
		params.set("site", activeStory);
		window.history.pushState({site: activeStory},'','?'+params);
	} else if (activeStory == "") {
		openStoryRandom();
	}

	// Set color based on lines of code
	let lines = parseInt(jsonBackup[activeStory]["lines"]);
	if (lines <= 20) {
		activeColor = 0;
	} else if (lines >= 21 && lines <= 40) {
		activeColor = 1;
	} else if (lines >= 41 && lines <= 60) {
		activeColor = 2;
	} else if (lines >= 61 && lines <= 80) {
		activeColor = 3;
	} else if (lines >= 81 && lines <= 100) {
		activeColor = 4;
	} else {
		activeColor = 5;
	}
	document.documentElement.style.setProperty('--primary', "var(--"+colors[activeColor]+")");
}
function mainUp() {
	mainState = "up";
	main.style.transform = "translate(0%, -100%)";
}
function mainUpInstant() {
	mainState = "up";
	let temp = main.style.transition;
	main.style.transition = "unset";
	main.style.transform = "translate(0%, -100%)";
	setTimeout(() => {
		main.style.transition = temp;
	}, 50)
}
function mainDownInstant() {
	mainState = "down";
	let temp = main.style.transition;
	main.style.transition = "unset";
	main.style.transform = "translate(0%, 100%)";
	setTimeout(() => {
		main.style.transition = temp;
	}, 50)
}
function mainDown() {
	mainState = "down";
	main.style.transform = "translate(0%, 100%)";
}

let catalog = document.querySelector(".catalog");
let catalogState = "down";
function catalogIn() {
	colorLoop = false;
	catalogState = "in";
	catalog.style.transform = "translate(0%, 0%)";
	if (window.innerWidth > 1200) {
		openPanelControls();
	}

	// Scroll to top
	let controls = document.querySelector(".controls-content");
	controls.scrollTop = 0;
	let index = document.querySelector("#index");
	index.scrollTop = 0;
}
function catalogUp() {
	catalogState = "up";
	catalog.style.transform = "translate(0%, -100%)";
}
function catalogDown() {
	catalogState = "down";
	catalog.style.transform = "translate(0%, 100%)";
}
function catalogDownInstant() {
	catalogState = "down";
	let temp = catalog.style.transition;
	catalog.style.transition = "unset";
	catalog.style.transform = "translate(0%, 100%)";
	setTimeout(() => {
		catalog.style.transition = temp;
	}, 50)
}

// Toggle panels on main view
let storyView = true;
let codeView = true;
function togglePanelStory() {
	let toggle = document.querySelector("#toggle-story");
	let toggleTxt = toggle.querySelector("p");
	let story = document.querySelector("#story");
	let preview = document.querySelector("#preview-container");
	if (storyView) {
		toggleTxt.innerText = "Show Story Details";
		toggle.dataset.active = 0;
		story.dataset.active = 0;
		preview.dataset.story = 0;
		storyView = false;
	} else {
		toggleTxt.innerText = "Hide Story Details";
		toggle.dataset.active = 1;
		story.dataset.active = 1;
		preview.dataset.story = 1;
		storyView = true;
	}
	if (window.innerWidth < 1200 && codeView == true) {
		closePanelCode();
	}
}
function togglePanelCode() {
	let toggle = document.querySelector("#toggle-code");
	let toggleTxt = toggle.querySelector("p");
	let code = document.querySelector("#code");
	let preview = document.querySelector("#preview-container");
	if (codeView) {
		toggleTxt.innerText = "Show Code Editor";
		toggle.dataset.active = 0;
		code.dataset.active = 0;
		preview.dataset.code = 0;
		codeView = false;
	} else {
		toggleTxt.innerText = "Hide Code Editor";
		toggle.dataset.active = 1;
		code.dataset.active = 1;
		preview.dataset.code = 1;
		codeView = true;
	}
	if (window.innerWidth < 1200 && storyView == true) {
		closePanelCode();
	}
}
function openPanelStory() {
	let toggle = document.querySelector("#toggle-story");
	let toggleTxt = toggle.querySelector("p");
	let story = document.querySelector("#story");
	let preview = document.querySelector("#preview-container");
	toggleTxt.innerText = "Hide Story Details";
	toggle.dataset.active = 1;
	story.dataset.active = 1;
	preview.dataset.story = 1;
	storyView = true;
}
function openPanelCode() {
	let toggle = document.querySelector("#toggle-code");
	let toggleTxt = toggle.querySelector("p");
	let code = document.querySelector("#code");
	let preview = document.querySelector("#preview-container");
	toggleTxt.innerText = "Hide Code Editor";
	toggle.dataset.active = 1;
	code.dataset.active = 1;
	preview.dataset.code = 1;
	codeView = true;
}
function closePanelStory() {
	let toggle = document.querySelector("#toggle-story");
	let toggleTxt = toggle.querySelector("p");
	let story = document.querySelector("#story");
	let preview = document.querySelector("#preview-container");
	toggleTxt.innerText = "Show Story Details";
	toggle.dataset.active = 0;
	story.dataset.active = 0;
	preview.dataset.story = 0;
	storyView = false;
}
function closePanelCode() {
	let toggle = document.querySelector("#toggle-code");
	let toggleTxt = toggle.querySelector("p");
	let code = document.querySelector("#code");
	let preview = document.querySelector("#preview-container");
	toggleTxt.innerText = "Show Code Editor";
	toggle.dataset.active = 0;
	code.dataset.active = 0;
	preview.dataset.code = 0;
	codeView = false;
}

// Panel toggles on mobile
let previewMobileState = false;
window.addEventListener("resize", mobilePreviewAdjust);
function mobilePreviewAdjust() {
	if (window.innerWidth < 1200 && previewMobileState == false) {
		previewMobileState = true;
		closePanelStory();
		closePanelCode();
	}
	if (window.innerWidth >= 1200 && previewMobileState == true) {
		previewMobileState = false;
		openPanelStory();
		openPanelCode();
	}
}
mobilePreviewAdjust();

// Toggle controls panel on catalog view
let controlsView = true;
function togglePanelControls() {
	let toggle = document.querySelector("#toggle-controls");
	let toggleTxt = toggle.querySelector("p");
	let controls = document.querySelector(".controls");
	let index = document.querySelector(".index");
	if (controlsView) {
		toggleTxt.innerText = "Show Sorting & Filters";
		toggle.dataset.active = 0;
		controls.dataset.active = 0;
		index.dataset.controls = 0;
		controlsView = false;
	} else {
		toggleTxt.innerText = "Hide Sorting & Filters";
		toggle.dataset.active = 1;
		controls.dataset.active = 1;
		index.dataset.controls = 1;
		controlsView = true;
	}
}
function openPanelControls() {
	let toggle = document.querySelector("#toggle-controls");
	let toggleTxt = toggle.querySelector("p");
	let controls = document.querySelector(".controls");
	let index = document.querySelector(".index");
	toggleTxt.innerText = "Show Sorting & Filters";
	toggle.dataset.active = 1;
	controls.dataset.active = 1;
	index.dataset.controls = 1;
	controlsView = true;
}
function closePanelControls() {
	let toggle = document.querySelector("#toggle-controls");
	let toggleTxt = toggle.querySelector("p");
	let controls = document.querySelector(".controls");
	let index = document.querySelector(".index");
	toggleTxt.innerText = "Hide Sorting & Filters";
	toggle.dataset.active = 0;
	controls.dataset.active = 0;
	index.dataset.controls = 0;
	controlsView = false;
}

// Control panel toggle on mobile
let controlsMobileState = false;
window.addEventListener("resize", mobileControlsAdjust);
function mobileControlsAdjust() {
	if (window.innerWidth < 1200 && controlsMobileState == false) {
		controlsMobileState = true;
		closePanelControls();
	}
	if (window.innerWidth >= 1200 && controlsMobileState == true) {
		controlsMobileState = false;
		openPanelControls();
	}
}
mobileControlsAdjust();

// Code editor live update
let codeEditorHTMLParent = document.querySelector("#code-editor-html-parent");
let codeEditorCSSParent = document.querySelector("#code-editor-css-parent");
let codeEditorJSParent = document.querySelector("#code-editor-js-parent");
let codeEditorHTML = document.querySelector("#code-editor-html");
let codeEditorCSS = document.querySelector("#code-editor-css");
let codeEditorJS = document.querySelector("#code-editor-js");

var CodeMirrorHTML = CodeMirror.fromTextArea(codeEditorHTML, {
	mode: "htmlmixed",
	lineNumbers: true,
	tabSize: 2,
	theme: "ssbs",
});
var CodeMirrorCSS = CodeMirror.fromTextArea(codeEditorCSS, {
	mode: "css",
	lineNumbers: true,
	tabSize: 2,
	theme: "ssbs",
});
var CodeMirrorJS = CodeMirror.fromTextArea(codeEditorJS, {
	mode: "javascript",
	lineNumbers: true,
	tabSize: 2,
	theme: "ssbs",
});

CodeMirrorHTML.on("change", function(cm, change) { updatePreview() });
CodeMirrorCSS.on("change", function(cm, change) { updatePreview() });
CodeMirrorJS.on("change", function(cm, change) { updatePreview() });
function updatePreview() {
	let codeEditorPreview = document.querySelector(".preview-iframe");
	codeEditorPreview.src = "";

	let htmlString = CodeMirrorHTML.getValue();
	htmlString.search('src=');
	
	if (jsonBackup[activeStory]["library-name"] != "") {
		codeEditorPreview.srcdoc = '<html>' + CodeMirrorHTML.getValue() + '</html>' + '<style>' + CodeMirrorCSS.getValue() + '</style>' + '<script src="' + jsonBackup[activeStory]["library-cdn"] + '"></script>' + '<script>' + CodeMirrorJS.getValue() + '</script>';
	} else {
		codeEditorPreview.srcdoc = '<html>' + CodeMirrorHTML.getValue() + '</html>' + '<style>' + CodeMirrorCSS.getValue() + '</style>' + '<script>' + CodeMirrorJS.getValue() + '</script>';
	}
}

// Line wrapping
let editorLineWrap = [false, false, false];
function toggleWrap(editor) {
	if (editor == "html") {
		editorLineWrap[0] = !editorLineWrap[0];
		CodeMirrorHTML.setOption('lineWrapping', editorLineWrap[0]);
	}
	if (editor == "css") {
		editorLineWrap[1] = !editorLineWrap[1];
		CodeMirrorCSS.setOption('lineWrapping', editorLineWrap[1]);
	}
	if (editor == "js") {
		editorLineWrap[2] = !editorLineWrap[2];
		CodeMirrorJS.setOption('lineWrapping', editorLineWrap[2]);
	}
}
function resetWrap() {
	editorLineWrap = [false, false, false];
	CodeMirrorHTML.setOption('lineWrapping', editorLineWrap[0]);
	CodeMirrorCSS.setOption('lineWrapping', editorLineWrap[1]);
	CodeMirrorJS.setOption('lineWrapping', editorLineWrap[2]);
}

// Fullscreen
let editorFullscreen = [false, false, false];
function toggleFullscreen(editor) {
	if (editor == "html") {
		editorFullscreen[0] = !editorFullscreen[0];
		codeEditorHTMLParent.dataset.fullscreen = editorFullscreen[0];
	}
	if (editor == "css") {
		editorFullscreen[1] = !editorFullscreen[1];
		codeEditorCSSParent.dataset.fullscreen = editorFullscreen[1];
	}
	if (editor == "js") {
		editorFullscreen[2] = !editorFullscreen[2];
		codeEditorJSParent.dataset.fullscreen = editorFullscreen[2];
	}
}
function resetFullscreen() {
	editorFullscreen = [false, false, false];
	codeEditorHTMLParent.dataset.fullscreen = editorFullscreen[0];codeEditorCSSParent.dataset.fullscreen = editorFullscreen[1];
	codeEditorJSParent.dataset.fullscreen = editorFullscreen[2];
}

// Fetch JSON and build index
let jsonBackup, jsonBackupAnthologies;
fetch('stories.json')
	.then((response) => response.json())
	.then((json) => {
		jsonBackup = json;
		fetch('anthologies.json')
			.then((response) => response.json())
			.then((json) => {
				jsonBackupAnthologies = json;
				populateContent();
			})
	})

// Generate content from JSON files
function populateContent() {

	// STORIES
	let index = document.querySelector("#index");
	let keys = Object.keys(jsonBackup);
	let temp = "";
	let uniqueAuthors = []; // keep track of unique authors
	for (let key of keys) {
		let entry = jsonBackup[key];

		// Build authors string
		let authors = "";
		let authorsArray = entry["authors"].split(',');
		for (let i=0; i<authorsArray.length; i++) {
			if (i == authorsArray.length-1) {
				authors += authorsArray[i].trim();
			} else {
				authors += authorsArray[i].trim() + ", ";
			}
		}

		// Build tags
		let tags = "";
		let tagsArray = entry['tags'].split(',');
		for (let tag of tagsArray) {
			tags += `<li class="index-item-tag">${tag.trim()}</li>`;
		}

		// Set category for lines of code
		let category = "";
		let lines = parseInt(entry["lines"]);
		if (lines <= 20) {
			category = "20less";
		} else if (lines >= 21 && lines <= 40) {
			category = "21to40";
		} else if (lines >= 41 && lines <= 60) {
			category = "41to60";
		} else if (lines >= 61 && lines <= 80) {
			category = "61to80";
		} else if (lines >= 81 && lines <= 100) {
			category = "81to100";
		} else {
			category = "100more";
		}

		// Add anthology info if needed
		let anthology = entry["anthology"];
		let anthologyTemp = "";
		if (anthology != "") {
			anthologyTemp = `<h6 class="index-item-anthology">${jsonBackupAnthologies[anthology]["title"]}</h6>`;
		}

		temp += `
			<div class="index-item" data-key="${key}" data-type="story" data-category="${category}" data-active="1" data-search="1" onclick="openStory('${key}')">
				<div class="index-item-lines">
					<p class="index-item-lines-text index-item-lines-text-desktop">Lines</p>
					<p class="index-item-lines-number">${parseInt(entry["lines"])}</p>
					<p class="index-item-lines-text index-item-lines-text-desktop">of&nbsp;Code</p>
					<p class="index-item-lines-text index-item-lines-text-mobile">Lines of Code</p>
				</div>
				<div class="index-item-info">
					${anthologyTemp}
					<h4 class="index-item-title">${entry["title"]}</h4>
					<h5 class="index-item-authors">${authors}</h5>
					<ul class="index-item-tags">
						${tags}
					</ul>
				</div>
			</div>
		`

		// Collect new authors
		for (let author of authorsArray) {
			if (!uniqueAuthors.includes(author.trim())) {
				uniqueAuthors.push(author.trim());
			}
		}
	}

	index.innerHTML += temp;

	// Build out authors filters list and alphabetically sort (firstname)
	let authorsTemp = "";
	for (let author of uniqueAuthors.sort()) {
		authorsTemp += `
			<li class="controls-option" data-active="0" data-filter="${author}" onclick="setFilter('${author}')">${author}</li>
		`
	}
	let filtersAuthors = document.querySelector("#filters-authors");
	filtersAuthors.innerHTML += authorsTemp;

	// ANTHOLOGIES
	keys = Object.keys(jsonBackupAnthologies);
	temp = "";
	for (let key of keys) {
		let entry = jsonBackupAnthologies[key];

		// Calculate total lines of code and build out elements for individual stories
		let lines = 0;
		let stories = "";
		let storiesList = [];
		let anthologyArray = entry["stories"].split(',');
		for (let story of anthologyArray) {
			storiesList.push(story.trim());
			let trimmedStory = story.trim();
			lines += parseInt(jsonBackup[trimmedStory]["lines"]);
			let category = "";
			if (parseInt(jsonBackup[trimmedStory]["lines"]) <= 20) {
				category = "20less";
			} else if (parseInt(jsonBackup[trimmedStory]["lines"]) <= 40) {
				category = "21to40";
			} else if (parseInt(jsonBackup[trimmedStory]["lines"]) <= 60) {
				category = "41to60";
			} else if (parseInt(jsonBackup[trimmedStory]["lines"]) <= 80) {
				category = "61to80";
			} else if (parseInt(jsonBackup[trimmedStory]["lines"]) <= 100) {
				category = "81to100";
			} else {
				category = "100more";
			}
			stories += `
				<li class="index-item-story" data-category="${category}">
					<div class="index-item-story-lines">
						<p>${parseInt(jsonBackup[trimmedStory]["lines"])}</p>
					</div>
					<p class="index-item-story-title">${jsonBackup[trimmedStory]["title"]}</p>
				</li>
			`;
		}

		temp += `
			<div class="index-item" data-key="${key}" data-type="anthology" data-active="1" data-search="1" onclick="openStory('${storiesList[0]}')">
				<div class="index-item-lines">
					<p class="index-item-lines-text index-item-lines-text-desktop">Lines</p>
					<p class="index-item-lines-number">${lines}</p>
					<p class="index-item-lines-text index-item-lines-text-desktop">of&nbsp;Code</p>
					<p class="index-item-lines-text index-item-lines-text-mobile">Lines of Code</p>
				</div>
				<div class="index-item-info">
					<h4 class="index-item-title">${entry["title"]}</h4>
					<ul class="index-item-stories">
						${stories}
					</ul>
				</div>
			</div>
		`
	}
	index.innerHTML += temp;

	initializeStory();
}

// Load entry on pageload after all other information loaded in
function initializeStory() {
	// Construct a new object and pass the page href to URLSearchParams
	const pageHref = window.location.search;
	const searchParams = new URLSearchParams(pageHref.substring(pageHref.indexOf('?')));

	if (searchParams.has('site')) {
		let story = searchParams.get('site');
		if (Object.keys(jsonBackup).includes(story)) {
			setTimeout(() => {
				introOut();
				aboutUpInstant();
				openStory(searchParams.get('site'));
			}, 1000)
		} else {
			// Format intro screen
			let introTitle = document.querySelector(".intro-title");
			let introSubtitle = document.querySelector(".intro-subtitle");
			let introMenuBorder = document.querySelector(".intro-menu-border");
	
			setTimeout(() => {
				introTitle.style.transform = "translateY(0px)";
			}, 1000)
			setTimeout(() => {
				introSubtitle.style.transform = "translateY(0px)";
				introSubtitle.style.opacity = 1;
			}, 1200)
			setTimeout(() => {
				introMenuBorder.style.transform = "translateY(0px)";
				introMenuBorder.style.opacity = 1;
				introMenuBorder.style.pointerEvents = "all";
			}, 1400)
		}
	} else {
		// Format intro screen
		let introTitle = document.querySelector(".intro-title");
		let introSubtitle = document.querySelector(".intro-subtitle");
		let introMenuBorder = document.querySelector(".intro-menu-border");

		setTimeout(() => {
			introTitle.style.transform = "translateY(0px)";
		}, 1000)
		setTimeout(() => {
			introSubtitle.style.transform = "translateY(0px)";
			introSubtitle.style.opacity = 1;
		}, 1200)
		setTimeout(() => {
			introMenuBorder.style.transform = "translateY(0px)";
			introMenuBorder.style.opacity = 1;
			introMenuBorder.style.pointerEvents = "all";
		}, 1400)
	}
}
function reloadStory() {
	// Construct a new object and pass the page href to URLSearchParams
	const pageHref = window.location.search;
	const searchParams = new URLSearchParams(pageHref.substring(pageHref.indexOf('?')));

	if (searchParams.has('site')) {
		introOut();
		if (aboutState == "down") {
			aboutUpInstant();
		} else {
			aboutUp();
		}
		openStory(searchParams.get('site'));
		flashStory();
	} else {
		introRestart();
	}
}
window.addEventListener("popstate", reloadStory);

// Flash index screen when order changes
function flashIndex() {
	let flash = document.querySelector(".index-flash");
	flash.style.transition = "0s";
	flash.style.opacity = 1;
	setTimeout(() => {
		flash.style.transition = "opacity .5s";
		flash.style.opacity = 0;
	}, 50);
}

// Mobile resizing for index
let indexResizeObserver = new ResizeObserver(() => {
    indexResize();
});
indexResizeObserver.observe(document.querySelector("#index"));
function indexResize() {
	let indexItems = document.querySelector(".index-items");
	if (indexItems.offsetWidth < 800) {
		indexItems.style.gridTemplateColumns = "minmax(0, 1fr)";
	} else if (indexItems.offsetWidth < 1400) {
		indexItems.style.gridTemplateColumns = "minmax(0, 1fr) minmax(0, 1fr)";
	} else if (indexItems.offsetWidth < 1800) {
		indexItems.style.gridTemplateColumns = "minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)";
	} else {
		indexItems.style.gridTemplateColumns = "minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)";
	}
}
indexResize();

// Set story type (story or anthology)
let storyType = "story";
function setStoryType(newStoryType) {
	storyType = newStoryType;
	let storyonly = document.querySelectorAll("[data-storyonly]");
	let toggleStory = document.querySelector("[data-storytype='story']");
	let toggleAnthology = document.querySelector("[data-storytype='anthology']");
	let index = document.querySelector("#index");
	if (storyType == "story") {
		toggleStory.dataset.active = 1;
		toggleAnthology.dataset.active = 0;
		for (let i of storyonly) {
			i.dataset.storyonly = 1;
		}
		index.dataset.view = "story";
	} else {
		toggleStory.dataset.active = 0;
		toggleAnthology.dataset.active = 1;
		for (let i of storyonly) {
			i.dataset.storyonly = 0;
		}
		index.dataset.view = "anthology";
	}
	setSorting("random");
	clearFilters();
}

// Set sorting order
let activeSorting = "";
let sortOrder = [];
function setSorting(sorting) {
	activeSorting = sorting;

	// Set active toggle
	let sortingToggles = document.querySelectorAll(".toggle-sorting")
	for (let sortingToggle of sortingToggles) {
		sortingToggle.dataset.active = 0;
	}
	let activeToggle = document.querySelector(`[data-sorting="${activeSorting}"]`);
	activeToggle.dataset.active = 1;

	// Calculate and apply sort order
	sortOrder = [];
	if (storyType == "story") {

		if (activeSorting == "leastcode") {
			// Separate entries into sets of unique lines of code (sort lines, then alpha per number of lines) | format: {"lines": {"alpha": key, "alpha": key}}
			let lineGroups = {};
			for (let key of Object.keys(jsonBackup)) {
				let entry = jsonBackup[key];
				let entryAlpha = entry['alpha'];
				let entryLines = parseInt(entry['lines']);
				if (lineGroups[entryLines] == undefined) {
					lineGroups[entryLines] = {}; // add new object for each author
				}
				lineGroups[entryLines][entryAlpha] = key;
			}
			// Sort lines and entries per number of lines
			for (let key of Object.keys(lineGroups).sort(function(a, b) {return a - b})) { // change sort to numerical instead of by string
				for (let subkey of Object.keys(lineGroups[key]).sort()) {
					sortOrder.push(lineGroups[key][subkey]);
				}
			}
			// Apply sorting
			for (let sortCounter=0; sortCounter<sortOrder.length; sortCounter++) {
				let indexItem = document.querySelector(`[data-key="${sortOrder[sortCounter]}"]`);
				indexItem.style.order = sortCounter;
			}
	
		} else if (activeSorting == "mostcode") {
			// Separate entries into sets of unique lines of code (sort lines, then alpha per number of lines) | format: {"lines": {"alpha": key, "alpha": key}}
			let lineGroups = {};
			for (let key of Object.keys(jsonBackup)) {
				let entry = jsonBackup[key];
				let entryAlpha = entry['alpha'];
				let entryLines = parseInt(entry['lines']);
				if (lineGroups[entryLines] == undefined) {
					lineGroups[entryLines] = {}; // add new object for each author
				}
				lineGroups[entryLines][entryAlpha] = key;
			}
			// Sort lines and entries per number of lines (reversed)
			for (let key of Object.keys(lineGroups).sort(function(a, b) {return a - b}).reverse()) { // change sort to numerical instead of by string
				for (let subkey of Object.keys(lineGroups[key]).sort().reverse()) {
					sortOrder.push(lineGroups[key][subkey]);
				}
			}
			// Apply sorting
			for (let sortCounter=0; sortCounter<sortOrder.length; sortCounter++) {
				let indexItem = document.querySelector(`[data-key="${sortOrder[sortCounter]}"]`);
				indexItem.style.order = sortCounter;
			}
	
		} else if (activeSorting == "titleaz") {
			// Build object containing alpha/key pairs
			let sortingAlpha = {};
			for (let key of Object.keys(jsonBackup)) {
				let entry = jsonBackup[key];
				let entryAlpha = entry['alpha'];
				sortingAlpha[entryAlpha] = key;
			}
			// Sort alpha keys
			for (let key of Object.keys(sortingAlpha).sort()) {
				sortOrder.push(sortingAlpha[key]);
			}
			// Apply sorting
			for (let sortCounter=0; sortCounter<sortOrder.length; sortCounter++) {
				let indexItem = document.querySelector(`[data-key="${sortOrder[sortCounter]}"]`);
				indexItem.style.order = sortCounter;
			}
	
		} else if (activeSorting == "titleza") {
			// Build object containing alpha/key pairs
			let sortingAlpha = {};
			for (let key of Object.keys(jsonBackup)) {
				let entry = jsonBackup[key];
				let entryAlpha = entry['alpha'];
				sortingAlpha[entryAlpha] = key;
			}
			// Sort alpha keys (reversed)
			for (let key of Object.keys(sortingAlpha).sort().reverse()) {
				sortOrder.push(sortingAlpha[key]);
			}
			// Apply sorting
			for (let sortCounter=0; sortCounter<sortOrder.length; sortCounter++) {
				let indexItem = document.querySelector(`[data-key="${sortOrder[sortCounter]}"]`);
				indexItem.style.order = sortCounter;
			}
	
		} else if (activeSorting == "authoraz") {
			// Separate entries into sets of unique authors (sort authors, then alpha per author) | format: {"authoralpha": {"alpha": key, "alpha": key}}
			let authorGroups = {};
			for (let key of Object.keys(jsonBackup)) {
				let entry = jsonBackup[key];
				let entryAlpha = entry['alpha'];
				let entryAuthorAlpha = entry['authoralpha'];
				if (authorGroups[entryAuthorAlpha] == undefined) {
					authorGroups[entryAuthorAlpha] = {}; // add new object for each author
				}
				authorGroups[entryAuthorAlpha][entryAlpha] = key;
			}
			// Sort author keys and entries per author
			for (let key of Object.keys(authorGroups).sort()) {
				for (let subkey of Object.keys(authorGroups[key]).sort()) {
					sortOrder.push(authorGroups[key][subkey]);
				}
			}
			// Apply sorting
			for (let sortCounter=0; sortCounter<sortOrder.length; sortCounter++) {
				let indexItem = document.querySelector(`[data-key="${sortOrder[sortCounter]}"]`);
				indexItem.style.order = sortCounter;
			}
	
		} else if (activeSorting == "authorza") {
			// Separate entries into sets of unique authors (sort authors, then alpha per author) | format: {"authoralpha": {"alpha": key, "alpha": key}}
			let authorGroups = {};
			for (let key of Object.keys(jsonBackup)) {
				let entry = jsonBackup[key];
				let entryAlpha = entry['alpha'];
				let entryAuthorAlpha = entry['authoralpha'];
				if (authorGroups[entryAuthorAlpha] == undefined) {
					authorGroups[entryAuthorAlpha] = {}; // add new object for each author
				}
				authorGroups[entryAuthorAlpha][entryAlpha] = key;
			}
			// Sort author keys and entries per author (reversed)
			for (let key of Object.keys(authorGroups).sort().reverse()) {
				for (let subkey of Object.keys(authorGroups[key]).sort().reverse()) {
					sortOrder.push(authorGroups[key][subkey]);
				}
			}
			// Apply sorting
			for (let sortCounter=0; sortCounter<sortOrder.length; sortCounter++) {
				let indexItem = document.querySelector(`[data-key="${sortOrder[sortCounter]}"]`);
				indexItem.style.order = sortCounter;
			}
	
		} else if (activeSorting == "random") {
			let indexItems = document.querySelectorAll(".index-item");
			let randomOrder = {};
			for (let indexItem of indexItems) {
				let randomIndex = parseInt(Math.random()*1000000000);
				randomOrder[randomIndex] = indexItem.dataset.key;
				indexItem.style.order = randomIndex;
			}
			sortOrder = [];
			for (let key of Object.keys(randomOrder).sort()) {
				sortOrder.push(randomOrder[key]);
			}
		}

	} else if (storyType == "anthology") {

		if (activeSorting == "titleaz") {
			// Build object containing alpha/key pairs
			let sortingAlpha = {};
			for (let key of Object.keys(jsonBackupAnthologies)) {
				let entry = jsonBackupAnthologies[key];
				let entryAlpha = entry['alpha'];
				sortingAlpha[entryAlpha] = key;
			}
			// Sort alpha keys
			for (let key of Object.keys(sortingAlpha).sort()) {
				sortOrder.push(sortingAlpha[key]);
			}
			// Apply sorting
			for (let sortCounter=0; sortCounter<sortOrder.length; sortCounter++) {
				let indexItem = document.querySelector(`[data-key="${sortOrder[sortCounter]}"]`);
				indexItem.style.order = sortCounter;
			}
	
		} else if (activeSorting == "titleza") {
			// Build object containing alpha/key pairs
			let sortingAlpha = {};
			for (let key of Object.keys(jsonBackupAnthologies)) {
				let entry = jsonBackupAnthologies[key];
				let entryAlpha = entry['alpha'];
				sortingAlpha[entryAlpha] = key;
			}
			// Sort alpha keys (reversed)
			for (let key of Object.keys(sortingAlpha).sort().reverse()) {
				sortOrder.push(sortingAlpha[key]);
			}
			// Apply sorting
			for (let sortCounter=0; sortCounter<sortOrder.length; sortCounter++) {
				let indexItem = document.querySelector(`[data-key="${sortOrder[sortCounter]}"]`);
				indexItem.style.order = sortCounter;
			}
	
		} else if (activeSorting == "random") {
			let indexItems = document.querySelectorAll(".index-item");
			let randomOrder = {};
			for (let indexItem of indexItems) {
				let randomIndex = parseInt(Math.random()*1000000000);
				randomOrder[randomIndex] = indexItem.dataset.key;
				indexItem.style.order = randomIndex;
			}
			sortOrder = [];
			for (let key of Object.keys(randomOrder).sort()) {
				sortOrder.push(randomOrder[key]);
			}
		}

	}

	// Scroll index to top
	let index = document.querySelector("#index");
	index.scrollTop = 0;

	flashIndex();
}

// Set filters
let activeFilters = [];
let lineFilters = ["20 or less", "21–40", "41–60", "61–80", "81–100", "More than 100"];
function setFilter(filter) {
	// Make sure only one "lines of code" filter is active
	if (lineFilters.includes(filter)) {
		for (let toggle of document.querySelectorAll(".filter-line")) {
			toggle.dataset.active = 0;
			for (let lineFilter of lineFilters) {
				if (lineFilter != filter) {
					activeFilters = activeFilters.filter(e => e != lineFilter);
				}
			}
		}
	}

	// Set filter toggle state
	let filterToggle = document.querySelector(`[data-filter="${filter}"]`);
	if (activeFilters.includes(filter)) {
		activeFilters = activeFilters.filter(e => e !== filter);
		filterToggle.dataset.active = 0;
	} else {
		activeFilters.push(filter);
		filterToggle.dataset.active = 1;
	}

	// Filter index items
	let storyItems = document.querySelectorAll(".index-item[data-type='story']");
	let controlsClear = document.querySelector(".controls-clear");
	if (activeFilters.length == 0) {
		if (searchString == "") {
			controlsClear.dataset.active = 0;
		}
		for (let storyItem of storyItems) {
			storyItem.dataset.active = 1;
		}
	} else {
		controlsClear.dataset.active = 1;
		for (let storyItem of storyItems) {
			let key = storyItem.dataset.key;
			storyItem.dataset.active = 1;

			// Calculate line group
			let lineGroup;
			if (parseInt(jsonBackup[key]["lines"]) <= 20) {
				lineGroup = "20 or less";
			} else if (parseInt(jsonBackup[key]["lines"]) <= 40) {
				lineGroup = "21–40";
			} else if (parseInt(jsonBackup[key]["lines"]) <= 60) {
				lineGroup = "41–60";
			} else if (parseInt(jsonBackup[key]["lines"]) <= 80) {
				lineGroup = "61–80";
			} else if (parseInt(jsonBackup[key]["lines"]) <= 100) {
				lineGroup = "81–100";
			} else {
				lineGroup = "More than 100";
			}

			// Add extra filters for line group and authors
			let tags = [];
			let tagsArray = jsonBackup[key]['tags'].split(',');
			for (let tag of tagsArray) {
				tags.push(tag.trim());
			}
			tags.push(lineGroup);

			let authorsArray = jsonBackup[key]["authors"].split(',');
			for (let author of authorsArray) {
				tags.push(author.trim());
			}

			// Detect if filters match
			for (let f of activeFilters) {
				if (!tags.includes(f)) {
					storyItem.dataset.active = 0;
				}
			}
		}
	}

	// Scroll index to top
	let index = document.querySelector("#index");
	index.scrollTop = 0;

	detectEmpty();
	flashIndex();
}
function clearFilters() {
	// Show all items
	activeFilters = [];
	let indexItems = document.querySelectorAll(".index-item");
	for (let indexItem of indexItems) {
		indexItem.dataset.active = 1;
	}
	let filterToggles = document.querySelectorAll(".controls-option[data-filter]");
	for (let filterToggle of filterToggles) {
		filterToggle.dataset.active = 0;
	}
	let controlsClear = document.querySelector(".controls-clear");
	controlsClear.dataset.active = 0;

	// Clear search
	let searchDOM = document.querySelector(".search");
	searchDOM.value = "";
	setSearch("");

	// Hide empty notice
	let emptyNotice = document.querySelector(".index-empty");
	emptyNotice.dataset.active = 0;

	flashIndex();
}

// Search filter
let searchString = "";
function setSearch(query) {
	searchString = query;
	// Show clear button if needed
	let controlsClear = document.querySelector(".controls-clear");
	if (searchString.length > 0) {
		controlsClear.dataset.active = 1;
	} else if (activeFilters.length == 0) {
		controlsClear.dataset.active = 0;
	}

	if (storyType == "story") {
		let storyItems = document.querySelectorAll(".index-item[data-type='story'");
		for (let storyItem of storyItems) {
			let key = storyItem.dataset.key;
			let formattedTitle = jsonBackup[key]["title"].toLowerCase().replace(/[.,\/#!$%\^&*;:{}=\-_`~()‘’“”\?]/g,"");
			formattedInput = searchString.toLowerCase().replace(/[.,\/#!$%\^&*;:{}=\-_`~()‘’“”\?]/g,"");
			if (formattedTitle.includes(formattedInput)) {
				storyItem.dataset.search = 1;
			} else {
				storyItem.dataset.search = 0;
			}
		}
	} else if (storyType == "anthology") {
		let anthologyItems = document.querySelectorAll(".index-item[data-type='anthology'");
		for (let anthologyItem of anthologyItems) {
			let key = anthologyItem.dataset.key;
			let formattedTitle = jsonBackupAnthologies[key]["title"].toLowerCase().replace(/[.,\/#!$%\^&*;:{}=\-_`~()‘’“”\?]/g,"");
			formattedInput = searchString.toLowerCase().replace(/[.,\/#!$%\^&*;:{}=\-_`~()‘’“”\?]/g,"");
			if (formattedTitle.includes(formattedInput)) {
				anthologyItem.dataset.search = 1;
			} else {
				anthologyItem.dataset.search = 0;
			}
		}
	}

	detectEmpty();
	flashIndex();
}

// Empty notice
function detectEmpty() {
	// Check if no items match filter combination
	let activeItems = document.querySelectorAll(`.index-item[data-type='${storyType}'][data-active='1'][data-search='1']`);
	let emptyNotice = document.querySelector(".index-empty");
	if (activeItems.length == 0) {
		emptyNotice.dataset.active = 1;
	} else {
		emptyNotice.dataset.active = 0;
	}
}

// Load in story
let activeStory = "";
function openStoryRandom() {
	openStory(Object.keys(jsonBackup)[Math.floor((Math.random()*Object.keys(jsonBackup).length))]);
}
function openStory(story) {
	activeStory = story;

	// Update URL
	let url = new URL(window.location.href);
	let params = new URLSearchParams(url.search);
	if (params.get("site") != activeStory) {
		params.set("site", activeStory);
		window.history.pushState({site: activeStory},'','?'+params);
	}

	// Build new iframe to prevent incorrent page history
	let previewContainer = document.querySelector("#preview-container");
	let oldPreview = document.querySelector("#preview");
	previewContainer.removeChild(oldPreview);
	let newPreview = document.createElement("iframe");
	newPreview.classList.add("preview-iframe");
	newPreview.id = "preview";
	newPreview.src = `stories/${story}/${story}.html`;
	previewContainer.appendChild(newPreview);

	// Populate story info
	let storyContent = document.querySelector(".story-content");
	storyContent.scrollTop = 0;

	let linesDisplay = document.querySelector("#lines");
	linesDisplay.innerText = parseInt(jsonBackup[story]["lines"]);

	let title = document.querySelector("#title");
	title.innerText = jsonBackup[story]["title"];

	let desc = document.querySelector("#desc");
	desc.innerText = jsonBackup[story]["desc"];

	let authors = document.querySelector("#authors");
	let temp = "";
	let authorsArray = jsonBackup[story]["authors"].split(',');
	for (let i=0; i<authorsArray.length; i++) {
		temp += `<li class="story-link" onclick="clearFilters(); setStoryType('story'); setFilter('${authorsArray[i].trim()}'); mainUp(); catalogIn();">${authorsArray[i].trim()}</li>`;
	}
	authors.innerHTML = temp;

	let tags = document.querySelector("#tags");
	temp = "";
	let tagsArray = jsonBackup[story]["tags"].split(',');
	for (let i=0; i<tagsArray.length; i++) {
		temp += `<li class="story-link" onclick="clearFilters(); setStoryType('story'); setFilter('${tagsArray[i].trim()}'); mainUp(); catalogIn();">${tagsArray[i].trim()}</li>`
	}
	tags.innerHTML = temp;

	// Set up code
	let libraryContainer = document.querySelector("#library-container");
	let codeEditorBorder = document.querySelector(".code-editor-border");
	let libraryLink = document.querySelector("#library-link");
	let libraryText = document.querySelector("#library-text");
	if (jsonBackup[story]["library-name"] == "") {
		libraryContainer.dataset.active = 0;
		codeEditorBorder.dataset.library = 0;
	} else {
		libraryContainer.dataset.active = 1;
		codeEditorBorder.dataset.library = 1;
		libraryLink.href = jsonBackup[story]["library-link"];
		libraryText.innerText = jsonBackup[story]["library-name"];
	}

	// Update fields if story is part of an anthology
	let anthologyContent = document.querySelector(".anthology-content");
	let anthologyTitle = document.querySelector(".anthology-heading");
	let anthologyNumber = document.querySelector("#anthology-number");
	let anthologyTotal = document.querySelector("#anthology-total");
	let anthologyName = jsonBackup[story]["anthology"];
	if (anthologyName != "") {
		let anthologyArray = jsonBackupAnthologies[anthologyName]["stories"].split(',');
		let stories = [];
		for (let story of anthologyArray) {
			stories.push(story.trim());
		}
		anthologyContent.dataset.active = 1;
		anthologyTitle.innerText = jsonBackupAnthologies[anthologyName]["title"];
		anthologyNumber.innerText = stories.indexOf(story)+1;
		anthologyTotal.innerText = stories.length;
	} else {
		anthologyContent.dataset.active = 0;
	}

	loadPreview();

	let optionDownload = document.querySelector("#download");
	let optionNewtab = document.querySelector("#newtab");
	optionDownload.href = `stories/${story}/${story}.zip`;
	optionNewtab.href = `stories/${story}/${story}.html`;

	mainIn();
	catalogDown();
}

// Reset preview and code editor to currently active story
function resetPreview() {
	loadPreview();
	flashStory();
}

// Load in code from external file for code editor
function loadPreview() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			let htmlDoc = this.responseText;

			let htmlStart = "<!-- HTML START -->";
			let htmlEnd = "<!-- HTML END -->";
			let cssStart = "/* CSS START */";
			let cssEnd = "/* CSS END */";
			let jsStart = "// JS START";
			let jsEnd = "// JS END";

			let htmlStartIndex = htmlDoc.indexOf(htmlStart) + htmlStart.length + 1;
			let htmlEndIndex = htmlDoc.indexOf(htmlEnd);
			let cssStartIndex = htmlDoc.indexOf(cssStart) + cssStart.length + 1;
			let cssEndIndex = htmlDoc.indexOf(cssEnd);
			let jsStartIndex = htmlDoc.indexOf(jsStart) + jsStart.length + 1;
			let jsEndIndex = htmlDoc.indexOf(jsEnd);

			CodeMirrorHTML.getDoc().setValue(htmlDoc.substring(htmlStartIndex, htmlEndIndex));
			CodeMirrorCSS.getDoc().setValue(htmlDoc.substring(cssStartIndex, cssEndIndex));
			CodeMirrorJS.getDoc().setValue(htmlDoc.substring(jsStartIndex, jsEndIndex));

			// Build new iframe to prevent incorrent page history
			// Do this after resetting code, or else code overrides src immediately
			let previewContainer = document.querySelector("#preview-container");
			let oldPreview = document.querySelector("#preview");
			previewContainer.removeChild(oldPreview);
			let newPreview = document.createElement("iframe");
			newPreview.classList.add("preview-iframe");
			newPreview.id = "preview";
			newPreview.src = `stories/${activeStory}/${activeStory}.html`;
			previewContainer.appendChild(newPreview);
		}
	};
	xhttp.open("GET", `stories/${activeStory}/${activeStory}.html`, true);
	xhttp.send();
}

// Story traversal for anthologies
function previousStory() {
	let anthologyName = jsonBackup[activeStory]["anthology"];
	let anthologyArray = jsonBackupAnthologies[anthologyName]["stories"].split(',');
	let stories = [];
	for (let story of anthologyArray) {
		stories.push(story.trim());
	}
	let anthologyIndex = stories.indexOf(activeStory);
	let anthologyTotal = stories.length;
	if (anthologyIndex-1 < 0) {
		anthologyIndex = anthologyTotal-1;
	} else {
		anthologyIndex -= 1;
	}
	flashStory();
	openStory(stories[anthologyIndex]);
}
function nextStory() {
	let anthologyName = jsonBackup[activeStory]["anthology"];
	let anthologyArray = jsonBackupAnthologies[anthologyName]["stories"].split(',');
	let stories = [];
	for (let story of anthologyArray) {
		stories.push(story.trim());
	}
	let anthologyIndex = stories.indexOf(activeStory);
	let anthologyTotal = stories.length;
	if (anthologyIndex+1 >= anthologyTotal) {
		anthologyIndex = 0;
	} else {
		anthologyIndex += 1;
	}
	flashStory();
	openStory(stories[anthologyIndex]);
}

// Flash screen when anthology story changes
function flashStory() {
	let flash = document.querySelector(".story-flash");
	flash.style.transition = "0s";
	flash.style.opacity = 1;
	setTimeout(() => {
		flash.style.transition = "opacity .5s";
		flash.style.opacity = 0;
	}, 50);
}