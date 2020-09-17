// const classQueries = [
//Old Facebook UI
// "_1ift", "_6qdm", "_21wj",
//New Facebook UI
// "tbxw36s4", "_5zft", "_3gl1"
// ];

const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

chrome.storage.local.get({
	action: "hide",
	imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Adobe_XD_CC_icon.svg/1024px-Adobe_XD_CC_icon.svg.png",
	filtered: ["1f602"],
	uploadedImage: null
}, result => {
	settings = result;

	if (settings.action === "url") {
		let removerStylesheet = document.createElement("style");
		document.head.appendChild(removerStylesheet);
		removerStylesheet.sheet.insertRule(`.emoji__replaced { background-image: url('${settings.imgUrl}') !important }`);
	} else if (settings.action === "upload") {
		let removerStylesheet = document.createElement("style");
		document.head.appendChild(removerStylesheet);
		removerStylesheet.sheet.insertRule(`.emoji__replaced { background-image: url('${settings.uploadedImage}') !important }`);
	}

	const monitor = new MutationObserver(getEmoji);

	monitor.observe(document, {
		subtree: true,
		childList: true
	});
})

function getEmoji() {
	let emojiElements = document.body.querySelectorAll(".tbxw36s4, ._5zft, ._3gl1");

	if (settings.action === "url") {
		for (let elem of emojiElements) {
			replaceEmoji(elem, settings.imgUrl);
		}
	} else if (settings.action === "upload") {
		for (let elem of emojiElements) {
			replaceEmoji(elem, settings.uploadedImage);
		}
	} else if (settings.action === "hide") {
		for (let elem of emojiElements) {
			if (elem.tagName === "IMG") {
				let charUnicode = elem.src.split("/");

				//sprawdzić, czy bardziej wydajne jest rozbijanie stringa w jednej linii, czy też kawałek po kawałku
				charUnicode = charUnicode[charUnicode.length - 1].split(".")[0];

				if (settings.filtered.includes(charUnicode)) {
					elem.classList.add("emoji__hidden");
				}
			} else if (elem.tagName === "SPAN") {
				let charUnicode = elem.style.backgroundImage.split("/");
				charUnicode = charUnicode[charUnicode.length - 1].split(".")[0];
				if (settings.filtered.includes(charUnicode)) {
					elem.classList.add("emoji__hidden");
				}
			}
		}
	}
}

function replaceEmoji(node, image) {
	if (node.tagName === "IMG") {
		let charUnicode = node.src.split("/");
		charUnicode = charUnicode[charUnicode.length - 1].split(".")[0];
		if (settings.filtered.includes(charUnicode)) {
			node.src = image;
		}
	} else if (node.tagName === "SPAN") {
		//for new version of Facebook UI
		if (node.classList.contains("tbxw36s4")) {
			let elem = node.children[0];
			let charUnicode = elem.src.split("/");
			charUnicode = charUnicode[charUnicode.length - 1].split(".")[0];
			if (settings.filtered.includes(charUnicode)) {
				elem.src = image;
			}
		} else { //works with old and new UI (except for .tbxw36s4)
			let charUnicode = node.style.backgroundImage.split("/");
			charUnicode = charUnicode[charUnicode.length - 1].split(".")[0];
			if (settings.filtered.includes(charUnicode)) {
				node.classList.add("emoji__replaced");
			}
		}
	}
}