let actionSelect = document.getElementById("action"),
	url = document.getElementById("url");

let xhr = new XMLHttpRequest();
xhr.addEventListener("readystatechange", () => {
	if (xhr.readyState === 4) {
		let emojiInfo = JSON.parse(xhr.response);
		let section = document.getElementById("settings__selected-emoji");

		for (let category of Object.keys(emojiInfo)) {
			let categoryWrapper = document.createElement("div")
			categoryWrapper.classList.add("category__wrapper");
			categoryWrapper.id = "wrapper-" + category;

			let categoryTable = document.createElement("div"),
				categoryTitle = document.createElement("h3");
			categoryTable.classList.add("emoji-list")

			categoryTitle.textContent = category;
			categoryTitle.classList.add("category__title");
			categoryTitle.addEventListener("click", function () {

				if (categoryWrapper.style.height == "0px" || categoryWrapper.style.height == "")
					categoryWrapper.style.height = `${categoryWrapper.scrollHeight}px`;
				else
					categoryWrapper.style.height = "0px";

				console.log(categoryWrapper.style.height)
			});

			categoryWrapper.appendChild(categoryTable);

			for (let [key, value] of Object.entries(emojiInfo[category])) {
				let categoryCell = document.createElement("div");
				categoryCell.classList.add("emoji-list__cell");

				let tdPreview = document.createElement("div");
				tdPreview.textContent = String.fromCodePoint(parseInt(key, 16));
				tdPreview.classList.add("emoji-list__icon");
				categoryCell.appendChild(tdPreview);

				let tdName = document.createElement("div");
				tdName.textContent = value.name;
				tdName.classList.add("emoji-list__name")
				categoryCell.appendChild(tdName);


				let tdCheckbox = document.createElement("div"),
					checkbox = document.createElement("input");
				checkbox.type = "checkbox";
				checkbox.name = "emoji[]";
				checkbox.value = value.name;
				tdCheckbox.appendChild(checkbox);
				categoryCell.appendChild(tdCheckbox);

				categoryTable.appendChild(categoryCell);
			}
			section.appendChild(categoryTitle);
			section.appendChild(categoryWrapper);
		}
	}
});
xhr.open("GET", chrome.extension.getURL("/emoji_db.json"), true);
xhr.send();

chrome.storage.local.get({ action: "hide", imgUrl: "" }, data => {
	actionType = data.action;
	url.value = data.imgUrl;
	for (option of actionSelect.children) {
		if (option.value === actionType) {
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
			chrome.storage.local.set({
				action: actionType,
				imgUrl: url.value,
			});
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