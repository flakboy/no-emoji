//chrome.storage.local.set({ xd: "xid" })
/*
chrome.storage.local.get(["xd"], function (result) {
	document.getElementById("value").innerText = result.xd
})
*/

img_srcs = document.getElementsByClassName("settings__file")

for (let src of img_srcs) {
	src.onchange = () => {
		var fields = document.getElementsByClassName("settings__address")
		for (let field of fields) {
			field.disabled = true
		}
		document.getElementById(src.dataset.field).disabled = false
	}
}

form = document.getElementById("settings")

form.onsubmit = () => {
	var url = document.getElementById("url")

	if (url.value.length) {
		chrome.storage.local.set({ xd: url.value })
	}

	chrome.storage.local.get(["xd"], function (result) {
		//alert(result.xd)
		alert("Pomyślnie zapisano ustawienia")
	})
	return false
}