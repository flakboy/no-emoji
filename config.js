var actionSelect = document.getElementById("action");
var url = document.getElementById("url")

chrome.storage.local.get({ action: "hide", imgUrl: "" }, data => {
	actionType = data.action
	for (option of actionSelect.children) {
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

	//console.log(data.imgUrl)
})

actionSelect.addEventListener("change", () => {
	var selected = actionSelect.value;
	var options = actionSelect.children;


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
			alert('Pole "Adres URL" nie może być puste');
			return false;
		}
	} else {
		chrome.storage.local.set({ action: actionType });
	}

	/*chrome.storage.local.get(["xd"], function (result) {
		alert("Pomyślnie zapisano ustawienia:" + result.xd)
	})*/
}