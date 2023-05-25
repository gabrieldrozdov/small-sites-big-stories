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
		story.dataset.active = 0;
		preview.dataset.story = 0;
		storyView = false;
	} else {
		toggle.innerText = "Show Story Details";
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
		code.dataset.active = 0;
		preview.dataset.code = 0;
		codeView = false;
	} else {
		toggle.innerText = "Hide Code Editor";
		code.dataset.active = 1;
		preview.dataset.code = 1;
		codeView = true;
	}
}

// Code editor live update
let codeEditorPreview = document.querySelector(".preview-iframe");
let codeEditorHTML = document.querySelector("#html");
let codeEditorCSS = document.querySelector("#css");
let codeEditorJS = document.querySelector("#js");
function updatePreview() {
	codeEditorPreview.src = "";
	if (jsonBackup[activeStory]["library"].length > 0) {
		codeEditorPreview.srcdoc = '<html>' + codeEditorHTML.textContent + '</html>' + '<style>' + codeEditorCSS.textContent + '</style>' + '<script src="' + jsonBackup[activeStory]["library"][2] + '"></script>' + '<script>' + codeEditorJS.textContent + '</script>';
	} else {
		codeEditorPreview.srcdoc = '<html>' + codeEditorHTML.textContent + '</html>' + '<style>' + codeEditorCSS.textContent + '</style>' + '<script>' + codeEditorJS.textContent + '</script>';
	}
}
codeEditorHTML.addEventListener("keydown", (e) => {
	fixTabEnter(e, codeEditorHTML);
})
codeEditorCSS.addEventListener("keydown", (e) => {
	fixTabEnter(e, codeEditorCSS);
})
codeEditorJS.addEventListener("keydown", (e) => {
	fixTabEnter(e, codeEditorJS);
})
function fixTabEnter(e, editor) {
	if (e.keyCode === 9) {
		e.preventDefault();
		let doc = editor.ownerDocument.defaultView;
        let sel = doc.getSelection();
        let range = sel.getRangeAt(0);
        let tabNode = document.createTextNode('	');
        range.insertNode(tabNode);
        range.setStartAfter(tabNode);
        range.setEndAfter(tabNode); 
        sel.removeAllRanges();
        sel.addRange(range);
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
function setSorting(sorting) {
	activeSorting = sorting;

	// Set active toggle
	let sortingToggles = document.querySelectorAll(".toggle-sorting")
	for (let sortingToggle of sortingToggles) {
		sortingToggle.dataset.active = 0;
	}
	let activeToggle = document.querySelector(`[data-sorting="${activeSorting}"]`);
	activeToggle.dataset.active = 1;

	// Sort index items
	let indexItems = document.querySelectorAll(".index-item");
	for (let indexItem of indexItems) {
		let key = indexItem.dataset.key;
		let entry = jsonBackup[key];
		if (activeSorting == "leastcode") {
			indexItem.style.order = entry["lines"];
		} else if (activeSorting == "mostcode") {
			indexItem.style.order = -entry["lines"];
		} else if (activeSorting == "titleaz") {
			let orderValue = entry["title"].codePointAt(0);
			indexItem.style.order = parseInt(orderValue);
		} else if (activeSorting == "titleza") {
			let orderValue = entry["title"].codePointAt(0);
			indexItem.style.order = -parseInt(orderValue);
		} else if (activeSorting == "authoraz") {
			let orderValue = entry["authors"][0][0].codePointAt(0);
			indexItem.style.order = parseInt(orderValue);
		} else if (activeSorting == "authorza") {
			let orderValue = entry["authors"][0][0].codePointAt(0);
			indexItem.style.order = -parseInt(orderValue);
		} else if (activeSorting == "random") {
			indexItem.style.order = Math.floor(Math.random()*1000);
		}
	}

	flashIndex();
}
setSorting("random");

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

			document.getElementById("html").innerText = htmlDoc.substring(htmlStartIndex, htmlEndIndex);
			document.getElementById("css").innerText = htmlDoc.substring(cssStartIndex, cssEndIndex);
			document.getElementById("js").innerText = htmlDoc.substring(jsStartIndex, jsEndIndex);
		}
	};
	xhttp.open("GET", jsonBackup[activeStory]["src"], true);
	xhttp.send();
}

// ————————————————— ————————————————— ————————————————— ————————————————— ————————————————— ————————————————— ————————————————— ————————————————— ————————————————— ————————————————— ————————————————— ————————————————— ————————————————— ————————————————— ————————————————— ————————————————— FIX THIS: paste text without formatting————————————————— ————————————————— ————————————————— ———also needs to work for dragged-in text —————————————— ————————————————— ————————————————— ————————————————— ————————————————— ————————————————— ————————————————— ————————————————— ————————————————— ————————————————— ————————————————— ————————————————— —————————————————
codeEditorHTML.addEventListener("paste", function(e) {
    // cancel paste
    e.preventDefault();

    // get text representation of clipboard
    var text = (e.originalEvent || e).clipboardData.getData('text/plain');

    // insert text manually
    document.execCommand("insertHTML", false, text);
});
codeEditorCSS.addEventListener("paste", function(e) {
    // cancel paste
    e.preventDefault();

    // get text representation of clipboard
    var text = (e.originalEvent || e).clipboardData.getData('text/plain');

    // insert text manually
    document.execCommand("insertHTML", false, text);
});
codeEditorJS.addEventListener("paste", function(e) {
    // cancel paste
    e.preventDefault();

    // get text representation of clipboard
    var text = (e.originalEvent || e).clipboardData.getData('text/plain');

    // insert text manually
    document.execCommand("insertHTML", false, text);
});

// TO DO: PREV and NEXT buttons
// TO DO: sorting that looks deeper than first character
// TO DO: updated home screen/instructions
// make some filter categories toggle instead of multiple select
// make tags and author not need display names
// make code have coloring
// number lines in code editor
// show number of lines per language
// what counts as a line?
// add alpha sorting field
// allow some normal css (margin 0, padding 0, box-sizing)
// make tabs just spaces for space sake?
// split up html, css, js, library tags
// allow comments in the code
// scroll story and code to the top when loading new story
// figure out how to manage assets