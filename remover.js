const queries = ["img._1ift", "span._6qdm", "span._21wj"]

chrome.storage.local.get({
	action: "hide",
	imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Adobe_XD_CC_icon.svg/1024px-Adobe_XD_CC_icon.svg.png",
	filtered: ["1f602"],
	uploadedImage: null
}, result => {
	settings = result;
	MutationObserver = window.MutationObserver || window.WebKitMutationObserver
	monitor = new MutationObserver((mutations, observer) => {
		let emojis = [];
		for (query of queries) {
			queryResult = document.querySelectorAll(query);
			emojis.push(...queryResult);
		}

		if (settings.action === "url") {
			for (elem of emojis) {
				// if (elem.tagName === "IMG") {
				// 	let charUnicode = elem.src.split("/");
				// 	charUnicode = charUnicode[charUnicode.length - 1].split(".")[0];
				// 	if (settings.filtered.includes(charUnicode)) {
				// 		elem.src = settings.imgUrl;
				// 	}
				// } else {
				// 	let charUnicode = elem.style.backgroundImage.split("/");
				// 	charUnicode = charUnicode[charUnicode.length - 1].split(".")[0];
				// 	if (settings.filtered.includes(charUnicode)) {
				// 		elem.style.backgroundImage = 'url("' + settings.imgUrl + '")';
				// 		elem.style.backgroundPosition = "center";
				// 		elem.style.backgroundSize = "100%";
				// 	}
				// }
				replaceEmoji(elem, settings.imgUrl);
			}
		} else if (settings.action === "upload") {
			for (elem of emojis) {
				// if (elem.tagName === "IMG") {
				// 	let charUnicode = elem.src.split("/");
				// 	charUnicode = charUnicode[charUnicode.length - 1].split(".")[0];

				// 	if (settings.filtered.includes(charUnicode)) {
				// 		elem.src = settings.uploadedImage;
				// 	}
				// } else {
				// 	let charUnicode = elem.style.backgroundImage.split("/");
				// 	charUnicode = charUnicode[charUnicode.length - 1].split(".")[0];
				// 	if (settings.filtered.includes(charUnicode)) {
				// 		elem.style.backgroundImage = 'url("' + settings.uploadedImage + '")';
				// 		elem.style.backgroundPosition = "center";
				// 		elem.style.backgroundSize = "100%";
				// 	}
				// }
				replaceEmoji(elem, settings.uploadedImage);
			}
		} else if (settings.action === "hide") {
			for (elem of emojis) {
				if (elem.tagName === "IMG") {
					let charUnicode = elem.src.split("/");
					charUnicode = charUnicode[charUnicode.length - 1].split(".")[0];
					if (settings.filtered.includes(charUnicode)) {
						elem.style.display = "none";
					}
				} else {
					let charUnicode = elem.style.backgroundImage.split("/");
					charUnicode = charUnicode[charUnicode.length - 1].split(".")[0];
					if (settings.filtered.includes(charUnicode)) {
						elem.style.display = "none";
					}
				}
			}
		}

	});

	monitor.observe(document, {
		subtree: true,
		// attributes: true,
		childList: true
	});
})

function replaceEmoji(node, image) {
	if (node.tagName === "IMG") {
		let charUnicode = node.src.split("/");
		charUnicode = charUnicode[charUnicode.length - 1].split(".")[0];

		if (settings.filtered.includes(charUnicode)) {
			elem.src = image;
		}
	} else if (node.tagName === "SPAN") {
		let charUnicode = node.style.backgroundImage.split("/");
		charUnicode = charUnicode[charUnicode.length - 1].split(".")[0];
		if (settings.filtered.includes(charUnicode)) {
			node.style.backgroundImage = 'url("' + image + '")';
			node.style.backgroundPosition = "center";
			node.style.backgroundSize = "100%";
		}
	}
}