chrome.storage.local.set({ xd: "xid" })

var censoredSrc = ["https://static.xx.fbcdn.net/images/emoji.php/v9/te3/1.5/32/1f602.png",
	"https://static.xx.fbcdn.net/images/emoji.php/v9/t29/1.5/16/1f602.png",
	"https://static.xx.fbcdn.net/images/emoji.php/v9/ta/1.5/28/1f602.png",
	"https://static.xx.fbcdn.net/images/emoji.php/v9/t31/1.5/128/1f602.png"]

var censoredBg = ['url("https://static.xx.fbcdn.net/images/emoji.php/v9/t29/1.5/16/1f602.png")', 'url("https://www.facebook.com/images/emoji.php/v9/tdc/1.5/16/1f60e.png")',
	'url("https://www.facebook.com/images/emoji.php/v9/t29/1.5/16/1f602.png")', 'url("https://www.facebook.com/images/emoji.php/v9/t29/1.5/16/1f602.png")',
	'url("https://static.xx.fbcdn.net/images/emoji.php/v9/t8a/1/32/1f602.png")', 'url("https://static.xx.fbcdn.net/images/emoji.php/v9/te3/1.5/32/1f602.png")']

var spans = ["_6qdm", "_3gl1", "_21wj", "_1ift", "_1ifu", "_5zft", "_19_s"]

filterImg = "https://cdn.worldvectorlogo.com/logos/adobe-xd.svg"

MutationObserver = window.MutationObserver || window.WebKitMutationObserve
monitor = new MutationObserver(function (mutations, observer) {

	emoji = []

	for (spanClass of spans) {
		toAdd = Array.prototype.slice.call(document.getElementsByClassName(spanClass));
		emoji = emoji.concat(toAdd);
	}

	if (emoji.length > 0) {
		for (i = 0; i < emoji.length; i++) {
			if (emoji[i].tagName == "IMG") {
				if (censoredSrc.includes(emoji[i].src)) {
					emoji[i].src = filterImg;
				}
			} else {
				if (censoredBg.includes(emoji[i].style.backgroundImage)) {
					emoji[i].style.backgroundImage = 'url("' + filterImg + '")'
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


