const censoredSrc = [
	"https://static.xx.fbcdn.net/images/emoji.php/v9/te3/1.5/32/1f602.png",
	"https://static.xx.fbcdn.net/images/emoji.php/v9/t29/1.5/16/1f602.png",
	"https://static.xx.fbcdn.net/images/emoji.php/v9/ta/1.5/28/1f602.png",
	"https://static.xx.fbcdn.net/images/emoji.php/v9/t31/1.5/128/1f602.png",
	"https://static.xx.fbcdn.net/images/emoji.php/v9/t8a/1/32/1f602.png",
	"https://static.xx.fbcdn.net/images/emoji.php/v9/t6a/1/128/1f602.png",
	"https://static.xx.fbcdn.net/images/emoji.php/v9/td0/1/16/1f602.png"
];

const censoredBg = [
	'url("https://static.xx.fbcdn.net/images/emoji.php/v9/t29/1.5/16/1f602.png")',
	'url("https://www.facebook.com/images/emoji.php/v9/tdc/1.5/16/1f60e.png")',
	'url("https://www.facebook.com/images/emoji.php/v9/t29/1.5/16/1f602.png")',
	'url("https://static.xx.fbcdn.net/images/emoji.php/v9/t8a/1/32/1f602.png")',
	'url("https://static.xx.fbcdn.net/images/emoji.php/v9/te3/1.5/32/1f602.png")'
];

const spans = ["_6qdm", "_3gl1", "_21wj", "_1ift", "_1ifu", "_5zft", "_19_s"];

chrome.storage.local.get({ action: "hide", imgUrl: "" }, result => {
	settings = result;

	MutationObserver = window.MutationObserver || window.WebKitMutationObserve
	monitor = new MutationObserver((mutations, observer) => {

		var emoji = [];

		for (spanClass of spans) {
			toAdd = Array.prototype.slice.call(document.getElementsByClassName(spanClass));
			emoji = emoji.concat(toAdd);
		}

		if (settings.action == "url") {
			if (emoji.length > 0) {
				for (span of emoji) {
					if (span.tagName == "IMG") {
						if (censoredSrc.includes(span.src)) {
							span.src = settings.imgUrl;
						}
					} else if (censoredBg.includes(span.style.backgroundImage)) {
						span.style.backgroundImage = 'url("' + settings.imgUrl + '")';
						span.style.backgroundPosition = "center";
						span.style.backgroundSize = "cover";
					}
				}
			}
		} else if (settings.action == "hide") {
			if (emoji.length > 0) {
				for (span of emoji) {
					if (span.tagName == "IMG") {
						if (censoredSrc.includes(span.src)) {
							span.style.display = "none";
						}
					} else if (censoredBg.includes(span.style.backgroundImage)) {
						span.style.display = "none";
					}
				}
			}
		}
	});

	monitor.observe(document, {
		subtree: true,
		attributes: true,
		childList: true
	});
})