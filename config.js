let actionSelect = document.getElementById("action"),
	url = document.getElementById("url");

(async () => {
	let emojiInfo;
	await fetch(chrome.extension.getURL("/emoji_db.json"))
		.then(res => res.json())
		.then(res => emojiInfo = res);

	let section = document.getElementById("settings__selected-emoji");

	for (let category of Object.keys(emojiInfo)) {
		let categoryWrapper = document.createElement("div")
		categoryWrapper.classList.add("category__wrapper");
		categoryWrapper.id = "wrapper-" + category;

		let categoryTitle = document.createElement("h3");

		categoryTitle.textContent = category;
		categoryTitle.classList.add("category__title");
		categoryTitle.addEventListener("click", () => {
			if (categoryWrapper.style.height === "0px" || categoryWrapper.style.height === "")
				categoryWrapper.style.height = `${categoryWrapper.scrollHeight}px`;
			else
				categoryWrapper.style.height = "0px";
		});

		let btSelectAll = document.createElement("button");
		btSelectAll.textContent = "Select/Deselect all";
		categoryWrapper.appendChild(btSelectAll);

		let categoryTable = document.createElement("div");
		categoryTable.classList.add("emoji-list");
		categoryWrapper.appendChild(categoryTable);

		for (let [key, value] of Object.entries(emojiInfo[category])) {
			let categoryCell = document.createElement("div");
			categoryCell.classList.add("emoji-list__cell");

			let tdPreview = document.createElement("div");
			let emojiSurrogates = key.split("_")
			if (emojiSurrogates.length === 1) {
				tdPreview.textContent = String.fromCodePoint(parseInt(key, 16));
			} else {
				tdPreview.textContent += emojiSurrogates.map(char => {
					return String.fromCodePoint(parseInt(char, 16))
				}).join("");
			}

			tdPreview.classList.add("emoji-list__icon");
			categoryCell.appendChild(tdPreview);

			let tdName = document.createElement("div");
			tdName.textContent = value.name;
			tdName.classList.add("emoji-list__name")
			categoryCell.appendChild(tdName);

			// let tdCheckbox = document.createElement("div")
			let checkbox = document.createElement("input");

			checkbox.type = "checkbox";
			checkbox.name = "emoji[]";
			checkbox.value = key;
			// tdCheckbox.appendChild(checkbox);
			// categoryCell.appendChild(tdCheckbox);
			categoryCell.appendChild(checkbox);

			categoryTable.appendChild(categoryCell);
		}

		btSelectAll.onclick = () => {
			let allSelected = true;
			for (let div of categoryTable.childNodes) {
				if (!div.querySelector("input[type=checkbox]").checked) {
					allSelected = false;
					break;
				}
			}
			for (let div of categoryTable.childNodes) {
				div.querySelector("input[type=checkbox]").checked = !allSelected;
			}
		}

		section.appendChild(categoryTitle);
		section.appendChild(categoryWrapper);
	}
})();

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
			document.getElementById("file").disabled = true;
			break;
		case "url":
			document.getElementById("url").disabled = false;
			document.getElementById("file").disabled = true;
			break;
		case "upload":
			document.getElementById("url").disabled = true;
			document.getElementById("file").disabled = false;
			break;
	}
})

actionSelect.addEventListener("change", () => {
	let selectedValue = actionSelect.value;

	switch (selectedValue) {
		case "hide":
			document.getElementById("url").disabled = true;
			document.getElementById("file").disabled = true;
			actionType = "hide"
			break;
		case "url":
			document.getElementById("url").disabled = false;
			document.getElementById("file").disabled = true;
			actionType = "url";
			break;
		case "upload":
			document.getElementById("url").disabled = true;
			document.getElementById("file").disabled = false;
			actionType = "upload";
			break;
	}
})

let inputFile = document.getElementById("file");
let inputFileData;
let canvas = document.getElementById("file-compress");
let ctx = canvas.getContext("2d");

inputFile.onchange = () => {
	let fileReader = new FileReader();
	fileReader.onloadend = () => {
		inputFileData = fileReader.result;
		if (inputFileData.match(/^data:image\/(jpeg|png|webp)/) != null) {
			let img = new Image();
			img.onload = () => {
				let drawHeight = (img.width > img.height) ? 120 : img.height * 120 / img.width;
				let drawWidth = (img.height > img.width) ? 120 : img.width * 120 / img.height;
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.drawImage(img, 0, 0, drawWidth, drawHeight);
			}
			img.src = inputFileData;
		} else {
			inputFile.value = "";
		}
	}
	fileReader.readAsDataURL(inputFile.files[0]);
}


document.getElementById("settings__action").onsubmit = () => {
	if (actionType === url) {
		if (url.value.length) {
			chrome.storage.local.set({
				action: actionType,
				imgUrl: url.value,
			}, () => {
				alert("Twoje ustawienia zostały pomyślnie zapisane")
			});
		} else {
			alert('Pole "Adres URL" nie może być puste');
		}
	} else if (actionType === "upload") {
		if (inputFile.value) {
			let imageData;
			if (inputFileData.match(/^data:image\/(png|webp)/)) {
				imageData = ctx.canvas.toDataURL();
			} else /*if (inputFileData.startsWith("data:image/jpeg"))*/ {
				imageData = ctx.canvas.toDataURL("image/jpeg", 0.9);
			}
			chrome.storage.local.set({
				action: actionType,
				uploadedImage: imageData,
			});
		}
	} else {
		chrome.storage.local.set({ action: actionType }, () => {
			console.log("Twoje ustawienia zostały pomyślnie zapisane")
		});
	}
	return false;
}

document.getElementById("settings__selected-emoji").onsubmit = () => {
	let checkboxes = document.forms["settings__selected-emoji"].elements["emoji[]"];
	let filtered = [];
	for (let checkbox of checkboxes) {
		if (checkbox.checked) {
			filtered.push(checkbox.value)
		}
	}
	chrome.storage.local.set({ filtered: filtered });
	return false;
}