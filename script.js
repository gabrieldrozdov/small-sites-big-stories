// Intro
let colors = ["red", "blue", "purple", "yellow", "pink", "green"];
let activeColor = Math.floor(Math.random()*colors.length);
function setRandomColor() {
	let loop = true;
	while (loop) {
		activeColor++;
		if (activeColor >= colors.length) {
			activeColor = 0;
		}
		document.documentElement.style.setProperty('--primary', "var(--"+colors[activeColor]+")");
		loop = false;
	}
}
setTimeout(setRandomColor, 50);
let introAnimation = setInterval(setRandomColor, 2000);
let intro = document.querySelector(".intro");
function introOut() {
	intro.style.transform = "translate(0%, -100%)";
	clearInterval(introAnimation);
	openStory(Object.keys(jsonBackup)[Math.floor((Math.random()*Object.keys(jsonBackup).length))]);
	setSorting("random");
}

// Navigation
let about = document.querySelector(".about");
function aboutIn() {
	about.style.transform = "translate(0%, 0%)";
}
function aboutOut() {
	about.style.transform = "translate(0%, -100%)";
}
let main = document.querySelector(".main");
function mainIn() {
	main.style.transform = "translate(0%, 0%)";
}
function mainUp() {
	main.style.transform = "translate(0%, -100%)";
}
function mainDown() {
	main.style.transform = "translate(0%, 100%)";
}
let catalog = document.querySelector(".catalog");
function catalogIn() {
	catalog.style.transform = "translate(0%, 0%)";
}
function catalogUp() {
	catalog.style.transform = "translate(0%, -100%)";
}
function catalogDown() {
	catalog.style.transform = "translate(0%, 100%)";
}

// Toggle views on main screen
let storyView = true;
let codeView = true;
function toggleStory() {
	let toggle = document.querySelector("#toggle-story");
	let story = document.querySelector("#story");
	let preview = document.querySelector("#preview-container");
	if (storyView) {
		toggle.innerText = "Hide Story Details";
		toggle.dataset.active = 1;
		story.dataset.active = 0;
		preview.dataset.story = 0;
		storyView = false;
	} else {
		toggle.innerText = "Show Story Details";
		toggle.dataset.active = 0;
		story.dataset.active = 1;
		preview.dataset.story = 1;
		storyView = true;
	}
}
function toggleCode() {
	let toggle = document.querySelector("#toggle-code");
	let code = document.querySelector("#code");
	let preview = document.querySelector("#preview-container");
	if (codeView) {
		toggle.innerText = "Show Code Editor";
		toggle.dataset.active = 1;
		code.dataset.active = 0;
		preview.dataset.code = 0;
		codeView = false;
	} else {
		toggle.innerText = "Hide Code Editor";
		toggle.dataset.active = 0;
		code.dataset.active = 1;
		preview.dataset.code = 1;
		codeView = true;
	}
}

// Code editor live update
let codeEditorPreview = document.querySelector(".preview-iframe");
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
	codeEditorPreview.src = "";
	if (jsonBackup[activeStory]["library"].length > 0) {
		codeEditorPreview.srcdoc = '<html>' + CodeMirrorHTML.getValue() + '</html>' + '<style>' + CodeMirrorCSS.getValue() + '</style>' + '<script src="' + jsonBackup[activeStory]["library"][2] + '"></script>' + '<script>' + CodeMirrorJS.getValue() + '</script>';
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

// Fetch JSON and build index
// JSON format:
// title: string (short)
// desc: string (long)
// authors: array of arrays [tag name, display name]
// tags: array of arrays [actual tag, display tag]
// lines: int
// library: array [display text, url, cdn code]
// src: url as string
let jsonBackup;
fetch('sites.json')
	.then((response) => response.json())
	.then((json) => {
			jsonBackup = json;
			let index = document.querySelector("#index");
			let keys = Object.keys(json);
			let temp = "";
			for (let key of keys) {
				let entry = json[key];

				// Build authors string
				let authors = "";
				for (let i=0; i<entry["authors"].length; i++) {
					if (i==entry["authors"].length-1) {
						authors += entry["authors"][i][1];
					} else {
						authors += entry["authors"][i][1] + ", ";
					}
				}

				// Build tags
				let tags = "";
				for (let tag of entry["tags"]) {
					if (tag.length == 2) {
						tags += `<li class="index-item-tag">${tag[1]}</li>`;
					}
				}

				// Set category for lines of code
				let category = "";
				let lines = entry["lines"];
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

				temp += `
					<div class="index-item" data-key="${key}" data-category="${category}" data-active="1" onclick="openStory('${key}')">
						<div class="index-item-lines">
							<p class="index-item-lines-text">Lines</p>
							<p class="index-item-lines-number">${entry["lines"]}</p>
							<p class="index-item-lines-text">of Code</p>
						</div>
						<div class="index-item-info">
							<h4 class="index-item-title">${entry["title"]}</h4>
							<h5 class="index-item-authors">${authors}</h5>
							<ul class="index-item-tags">
								${tags}
							</ul>
						</div>
					</div>
				`
			}
			index.innerHTML += temp;
})

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

// Set sorting order
let activeSorting = "";
let sortOrder = [];
function sortNumber() {
	var numArray = [140000, 104, 99];
	numArray.sort(function(a, b) {
	return a - b;
});
}
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
	if (activeSorting == "leastcode") {
		// Separate entries into sets of unique lines of code (sort lines, then alpha per number of lines) | format: {"lines": {"alpha": key, "alpha": key}}
		let lineGroups = {};
		for (let key of Object.keys(jsonBackup)) {
			let entry = jsonBackup[key];
			let entryAlpha = entry['alpha'];
			let entryLines = entry['lines'];
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
			let entryLines = entry['lines'];
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

	console.log(sortOrder);
	flashIndex();
}

// Set filters
let activeFilters = [];
let lineFilters = ["20less", "21to40", "41to60", "61to80", "81to100", "100more"];
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
	let indexItems = document.querySelectorAll(".index-item");
	let controlsClear = document.querySelector(".controls-clear");
	if (activeFilters.length == 0) {
		controlsClear.dataset.active = 0;
		for (let indexItem of indexItems) {
			indexItem.dataset.active = 1;
		}
	} else {
		controlsClear.dataset.active = 1;
		for (let indexItem of indexItems) {
			let key = indexItem.dataset.key;
			indexItem.dataset.active = 1;
			let tags = [];
			for (let tag of jsonBackup[key]["tags"]) {
				tags.push(tag[0]);
			}
			for (let f of activeFilters) {
				if (!tags.includes(f)) {
					indexItem.dataset.active = 0;
				}
			}
		}
	}

	// Check if no items match filter combination
	let activeItems = document.querySelectorAll(".index-item[data-active='1'");
	let emptyNotice = document.querySelector(".index-empty");
	if (activeItems.length == 0) {
		emptyNotice.dataset.active = 1;
	} else {
		emptyNotice.dataset.active = 0;
	}

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

	// Hide empty notice
	let emptyNotice = document.querySelector(".index-empty");
	emptyNotice.dataset.active = 0;

	flashIndex();
}

// Load in story
let activeStory = "";
function openStory(story) {
	activeStory = story;

	let preview = document.querySelector("#preview");
	preview.src = jsonBackup[story]["src"];
	preview.removeAttribute("srcdoc");

	// Set color based on lines of code
	let lines = jsonBackup[story]["lines"];
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

	// Populate story info
	let linesDisplay = document.querySelector("#lines");
	linesDisplay.innerText = jsonBackup[story]["lines"];

	let title = document.querySelector("#title");
	title.innerText = jsonBackup[story]["title"];

	let desc = document.querySelector("#desc");
	desc.innerText = jsonBackup[story]["desc"];

	let authors = document.querySelector("#authors");
	let temp = "";
	for (let i=0; i<jsonBackup[story]["authors"].length; i++) {
		temp += `<li class="story-link" onclick="clearFilters(); setFilter('${jsonBackup[story]["authors"][i][0]}'); mainUp(); catalogIn();">${jsonBackup[story]["authors"][i][1]}</li>`
	}
	authors.innerHTML = temp;

	let tags = document.querySelector("#tags");
	temp = "";
	for (let i=0; i<jsonBackup[story]["tags"].length; i++) {
		if (jsonBackup[story]["tags"][i].length == 2) {
			temp += `<li class="story-link" onclick="clearFilters(); setFilter('${jsonBackup[story]["tags"][i][0]}'); mainUp(); catalogIn();">${jsonBackup[story]["tags"][i][1]}</li>`
		}
	}
	tags.innerHTML = temp;

	// Set up code
	let libraryContainer = document.querySelector("#library-container");
	let libraryLink = document.querySelector("#library-link");
	let libraryText = document.querySelector("#library-text");
	if (jsonBackup[story]["library"].length == 0) {
		libraryContainer.dataset.active = 0;
	} else {
		libraryContainer.dataset.active = 1;
		libraryLink.href = jsonBackup[story]["library"][1];
		libraryText.innerText = jsonBackup[story]["library"][0];
	}

	loadPreview();

	let optionDownload = document.querySelector("#download");
	let optionNewtab = document.querySelector("#newtab");
	optionDownload.href = jsonBackup[story]["src"];
	optionNewtab.href = jsonBackup[story]["src"];

	mainIn();
	catalogDown();
}

// Reset preview and code editor to currently active story
function resetPreview() {
	let preview = document.querySelector("#preview");
	preview.src = jsonBackup[activeStory]["src"];
	preview.removeAttribute("srcdoc");
	loadPreview();
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
		}
	};
	xhttp.open("GET", jsonBackup[activeStory]["src"], true);
	xhttp.send();
}

// TO DO: updated home screen/instructions
// make some filter categories toggle instead of multiple select
// make tags and author not need display names
// what counts as a line?
// allow some normal css (margin 0, padding 0, box-sizing)
// split up html, css, js, library tags
// scroll story and code to the top when loading new story (also catalog!)
// figure out how to manage assets

// add collection functionality
// - catalog screens allows toggling between stories and collections
// - need to add json values for collection + collection order
// - prev/next buttons change story in collection

// for iframe srcdoc image path issues:
// detect all src fields for audio or image (or font!)
// set file paths to have prefix automatically

// FREE CODE
// margins 0, padding 0, box-sizing border box
// images get max-width of 100%
// flexbox centered