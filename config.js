let actionSelect = document.getElementById("action");
let url = document.getElementById("url")

xhr = new XMLHttpRequest();
xhr.addEventListener("readystatechange", () => {
	if (xhr.readyState === 4) {
		let emojiInfo = JSON.parse(xhr.response)
		console.log(emojiInfo)
		let emojiTable = document.querySelector("#settings__filter > table");
		console.time("start")
		for (let [key, value] of Object.entries(emojiInfo)) {
			let row = document.createElement("tr");
			let emojiLabel = value.name;

			let tdPreview = document.createElement("td");
			tdPreview.appendChild(document.createTextNode(String.fromCodePoint(parseInt(key, 16))));
			row.appendChild(tdPreview);

			let tdName = document.createElement("td");
			tdName.appendChild(document.createTextNode(emojiLabel));
			row.appendChild(tdName);

			let tdCheckbox = document.createElement("td");
			let checkbox = document.createElement("input");
			checkbox.type = "checkbox";
			checkbox.name = emojiLabel;
			tdCheckbox.appendChild(checkbox);
			row.appendChild(tdCheckbox);

			emojiTable.appendChild(row);
		}
		console.timeEnd("start")
	}
});
xhr.open("GET", chrome.extension.getURL("/emoji_db.json"), true);
xhr.send();

chrome.storage.local.get({ action: "hide", imgUrl: "" }, data => {
	actionType = data.action;
	url.value = data.imgUrl;
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
})

actionSelect.addEventListener("change", () => {
	let selectedValue = actionSelect.value;
	let options = actionSelect.children;

	switch (selectedValue) {
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

document.getElementById("settings__action").onsubmit = () => {
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