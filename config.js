var imgSrc = document.getElementById("img_src");
var url = document.getElementById("url")

//Pierwsza linia ustawia wartość domyślną do pierwszego użycia
chrome.storage.local.get({ action: "hide", imgUrl: "" }, data => {
	actionType = data.action
	for (option of imgSrc.children) {
		if (option.value == actionType) {
			option.selected = true;
		}
	}
	switch (actionType) {
		case "hide":
			document.getElementById("url").disabled = true;
			break;
		case "url":
			document.getElementById("url").disabled = false;
	}

	alert(data.imgUrl)
})

imgSrc.addEventListener("change", () => {
	var selected = imgSrc.value;
	options = imgSrc.children;
	switch (selected) {
		case "hide":
			document.getElementById("url").disabled = true;
			actionType = "hide"
			break;
		case "url":
			document.getElementById("url").disabled = false;
			actionType = "url";
			break;
	}
})

form = document.getElementById("settings");


form.onsubmit = () => {
	if (!url.disabled) {
		if (url.value.length) {
			chrome.storage.local.set({ action: actionType });
			chrome.storage.local.set({ imgUrl: url.value });
		} else {
			alert("Adres URL grafiki nie może być pusty");
			return false;
		}
	} else {
		chrome.storage.local.set({ action: actionType });
	}

	/*chrome.storage.local.get(["xd"], function (result) {
		alert("Pomyślnie zapisano ustawienia:" + result.xd)
	})*/
}