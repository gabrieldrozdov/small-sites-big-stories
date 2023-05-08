// Intro
let colors = ["red", "blue", "purple", "yellow", "pink", "green"];
let activeColor = colors[Math.floor(Math.random()*colors.length)];
function setRandomColor() {
	let loop = true;
	while (loop) {
		let color = colors[Math.floor(Math.random()*colors.length)];
		if (color != activeColor) {
			activeColor = color;
			document.documentElement.style.setProperty('--primary', "var(--"+activeColor+")");
			loop = false;
		}
	}
}
setTimeout(setRandomColor, 50);
let introAnimation = setInterval(setRandomColor, 2000);
let intro = document.querySelector(".intro");
function introOut() {
	intro.style.transform = "translate(0%, -100%)";
	clearInterval(introAnimation);
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
let library = document.querySelector(".library");
function libraryIn() {
	library.style.transform = "translate(0%, 0%)";
}
function libraryUp() {
	library.style.transform = "translate(0%, -100%)";
}
function libraryDown() {
	library.style.transform = "translate(0%, 100%)";
}

// Content tracking
let siteLibrary = {
	"1" : {
		"title": "Really Small",
		"tags": "tag1,tag2,tag3",
		"lines": "20",
		"src": "reallysmall.html",
		"library": "none",
		"color": "green"
	}
}

// Code editor
let srcIFRAME = document.querySelector(".main-iframe");
let srcHTML = document.querySelector("#html");
let srcCSS = document.querySelector("#css");
let srcJS = document.querySelector("#js");
function updatePreview() {
	srcIFRAME.src = "";
	srcIFRAME.srcdoc = '<html>' + srcHTML.textContent + '</html>' + '<style>' + srcCSS.textContent + '</style>' + '<script>' + srcJS.textContent + '</script>';
}
srcHTML.addEventListener("keydown", (e) => {
	fixTabEnter(e, srcHTML);
})
srcCSS.addEventListener("keydown", (e) => {
	fixTabEnter(e, srcCSS);
})
srcJS.addEventListener("keydown", (e) => {
	fixTabEnter(e, srcJS);
})
function fixTabEnter(e, editor) {
	// if (e.key === 'Enter') {
	// 	document.execCommand('insertLineBreak')
	// 	e.preventDefault();
	// }
	if (e.keyCode === 9) {
		e.preventDefault();
		let doc = editor.ownerDocument.defaultView;
        let sel = doc.getSelection();
        let range = sel.getRangeAt(0);
        let tabNode = document.createTextNode('    ');
        range.insertNode(tabNode);
        range.setStartAfter(tabNode);
        range.setEndAfter(tabNode); 
        sel.removeAllRanges();
        sel.addRange(range);
	}
}