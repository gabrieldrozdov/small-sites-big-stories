// Fetch overview data and check if story in URL exists
// If not, load random story
let activeStory;
let storyData;
let storyNames;
async function initStory() {
	const pageHref = window.location.search;
	const searchParams = new URLSearchParams(pageHref.substring(pageHref.indexOf('?')));
	if (searchParams.has('story')) {
		activeStory = searchParams.get('story');
	} else {
		activeStory = '_NO_ACTIVE_STORY_';
	}
	try {
		let response = await fetch(`../stories.json`);
		response.json().then((json) => {
			storyData = json;
			storyNames = Object.keys(storyData);
			if (!storyNames.includes(activeStory)) {
				activeStory = storyNames[Math.floor(Math.random()*storyNames.length)];
			}
			fetchStory();
		});
	}
	catch(e) {
		alert("Something went wrong while trying to load your story! Try checking your Internet connection and refreshing the page.");
	}
}
initStory();

let activeStoryData;
let activeStoryHTML;
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
async function fetchStory() {
	// Populate header
	activeStoryData = storyData[activeStory];

	const headerInfoTitle = document.querySelector(`.header-info-title`);
	headerInfoTitle.innerHTML = activeStoryData['title'];

	const headerInfoDetails = document.querySelector(`.header-info-details`);
	const date = activeStoryData['date'];
	headerInfoDetails.innerHTML = `<li>Published ${months[date[0]-1]} ${date[1]}, ${date[2]}</li>`;
	for (let detail of activeStoryData['details']) {
		headerInfoDetails.innerHTML += `<li>${detail}</li>`;
	}

	const headerDesc = document.querySelector(`.header-desc`);
	headerDesc.innerHTML = activeStoryData['desc'];

	let prevStory, nextStory;
	let activeStoryIndex = storyNames.indexOf(activeStory);

	if (activeStoryIndex == 0) {
		prevStory = storyNames[storyNames.length-1];
	} else {
		prevStory = storyNames[activeStoryIndex-1];
	}
	const navPrev = document.querySelector('#nav-prev');
	navPrev.href = `./?story=${prevStory}`;

	if (activeStoryIndex == storyNames.length-1) {
		nextStory = storyNames[0];
	} else {
		nextStory = storyNames[activeStoryIndex+1];
	}
	const navNext = document.querySelector('#nav-next');
	navNext.href = `./?story=${nextStory}`;

	// Fetch story data
	try {
		let response = await fetch(`./${activeStory}.html`);
		response.text().then((text) => {
			activeStoryHTML = text;
			generateEditor();
		});
	}
	catch(e) {
		alert("Something went wrong while trying to load your story! Try checking your Internet connection and refreshing the page.");
	}
}

let cm;
let update;
let updateCount = 0;
let wrapping = false;
let fullscreen = false;
let themes = [ 'smallsites-bw', 'smallsites-light', 'smallsites-dark'];
let themeIndex = 0;
function generateEditor() {	
	const codeContainer = document.querySelector('.code-cm');
	cm = CodeMirror(codeContainer, {
		mode: "htmlmixed",
		value: activeStoryHTML,
		autoCloseTags: false,
		autoCloseBrackets: false,
		matchBrackets: true,
		smartIndent: true,
		indentWithTabs: true,
		lineNumbers: true,
		tabSize: 3,
		indentUnit: 3,
		extraKeys: {
			"Ctrl-[": "indentLess",
			"Ctrl-]": "indentMore",
			'Cmd-/': 'toggleComment',
			'Ctrl-/': 'toggleComment',
		},
		lineWrapping: false,
		theme: "smallsites-bw",
	});
	cm.on("change", updatePreview);

	// Make tabbed lines appear on continuous indentation
	cm.on("renderLine", function(cm, line, elmnt) {
		let tabs = CodeMirror.countColumn(line.text, null, 1);
		elmnt.style.textIndent = `-${tabs*1.8}em`;
		elmnt.style.paddingLeft = `calc(${tabs*1.8}em + 4px)`;
	});

	window.addEventListener("focus", cm.refresh());
	cm.refresh();

	updatePreview();
}

// Update preview when changes made in editor
function updatePreview() {
	// Add warning before closing the tab if editor changed by user
	if (updateCount > 1) {
		window.addEventListener('beforeunload', function (e) {
			e.preventDefault();
			e.returnValue = '';
		});
	}
	updateCount++;

	clearTimeout(update);

	// Fetch code from CodeMirror
	let previewCode = preventInfiniteLoops(cm.getValue());

	// Handle paused and delay states
	const previewIframe = document.querySelector('.preview-iframe');

	previewIframe.srcdoc = previewCode;
}

// Theme
function editorToggleTheme() {
	themeIndex++;
	if (themeIndex >= themes.length) {
		themeIndex = 0;
	}
	cm.setOption('theme', themes[themeIndex]);
}

// Line wrapping
function editorToggleWrapping() {
	wrapping = !wrapping;
	cm.setOption('lineWrapping', wrapping);
}

// Fullscreen
function editorToggleFullscreen() {
	fullscreen = !fullscreen;
	const container = document.querySelector('.container');
	container.dataset.fullscreen = fullscreen;
}

// Reset code
function editorReset() {
	window.location.reload();
}

// Rerun current demo
function editorRerun() {
	updatePreview();
}

// Download current demo
function editorDownload() {
	let codeBlob = new Blob([ cm.getValue()], { type: 'text/html' })
	blobURL = URL.createObjectURL(codeBlob);
	let tempLink = document.createElement("a");
	tempLink.href = blobURL;
	tempLink.download = activeStory;
	tempLink.click();
}

// Fix CodeMirror text not aligning with cursor
window.addEventListener('focus', () => {cm.refresh()});

// Prevent infinite loops inside preview
function preventInfiniteLoops(code) {
	// Track loop counts and enforce timeout
	const safetyWrapper = `
		<script>
			let __loopStart = Date.now();
			let __loopCounter = 0;
			function __loopReset() {
				__loopStart = Date.now();
				__loopCounter = 0;
			}
			function __checkLoop(lineNumber) {
				if (++__loopCounter > 10000) {
					alert("Your code has an infinite loop! We stopped previewing your code so that your browser won’t freeze. Once you fix your infinite loop, the code will run again.");
					throw new Error("Infinite loop detected!");
				}
				if (Date.now() - __loopStart > 2000) {
					alert("Your code has an infinite loop! We stopped previewing your code so that your browser won’t freeze. Once you fix your infinite loop, the code will run again.");
					throw new Error("Infinite loop detected!");
				}
			}
		</script>
	`;

	// Add code at the *start* of any loop
	code = code.replace(
		/\b(for|while|do)\b\s*(?:await\s+)?\([^)]*\)\s*\{/g,
		match => "__loopReset(); " + match
	  );

	// Replace loop headers and inject line number
	let line = 1;
	code = code.replace(/^.*$/gm, (fullLine) => {
		const loopMatch = fullLine.match(/\b(for|while|do)\b\s*(?:await\s+)?\([^)]*\)\s*\{/);
		if (loopMatch) {
			fullLine = fullLine.replace('{', `{__checkLoop(${line});`);
		}
		line++;
		return fullLine;
	});
  
	return safetyWrapper + "\n" + code;
}

// TODO
// Make editor based on url params