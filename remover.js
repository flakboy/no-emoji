const queries = ["img._1ift", "span._6qdm", "span._21wj"]

chrome.storage.local.get({
	action: "hide",
	imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Adobe_XD_CC_icon.svg/1024px-Adobe_XD_CC_icon.svg.png",
	filtered: ["1f602"]
}, result => {
	settings = result;

	MutationObserver = window.MutationObserver || window.WebKitMutationObserver
	monitor = new MutationObserver((mutations, observer) => {
		let emojis = [];
		for (query of queries) {
			queryResult = document.querySelectorAll(query);
			emojis.push(...queryResult)
		}

		if (settings.action === "url") {
			for (elem of emojis) {
				if (elem.tagName === "IMG") {
					let charUnicode = elem.src.split("/");
					charUnicode = charUnicode[charUnicode.length - 1].split(".")[0];

					//
					if (settings.filtered.includes(charUnicode)) {
						elem.src = settings.imgUrl;
					}
					// if (elem.src.endsWith("1f602.png")) 
					// 	elem.src = settings.imgUrl;
					// } else if (elem.style.backgroundImage.indexOf("1f602.png") != -1) {
					// 	elem.style.backgroundImage = 'url("' + settings.imgUrl + '")';
					// 	elem.style.backgroundPosition = "center";
					// 	elem.style.backgroundSize = "100%";
					// 	// 	elem.src = settings.imgUrl;

					//
				} else {
					let charUnicode = elem.style.backgroundImage.split("/");
					charUnicode = charUnicode[charUnicode.length - 1].split(".")[0];
					if (settings.filtered.includes(charUnicode)) {
						elem.style.backgroundImage = 'url("' + settings.imgUrl + '")';
						elem.style.backgroundPosition = "center";
						elem.style.backgroundSize = "100%";
					}
				}
			}
		} else if (settings.action === "hide") {
			for (elem of emojis) {
				if (elem.tagName === "IMG") {
					if (elem.src.endsWith("1f602.png")) {
						elem.style.display = "none";
					}
				} else if (elem.style.backgroundImage.indexOf("1f602.png") != -1) {
					elem.style.display = "none";
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