var heartEyesActivated;

chrome.browserAction.setTitle({ title: "Toggle 😍 react for Facebook Messenger" });

var updateIcon = function () {
	if (heartEyesActivated)
		chrome.browserAction.setIcon({ path: "../logo-small-active.png" });
	else
		chrome.browserAction.setIcon({ path: "../logo-small-inactive.png" });
};

chrome.storage.sync.get("heartEyesActivated", function (obj) {
	console.log(obj);
	heartEyesActivated = obj.heartEyesActivated;
	updateIcon();
});

var toggleHeartEyesActivated = function (tab) {
	heartEyesActivated = !heartEyesActivated;

	chrome.storage.sync.set({ heartEyesActivated: heartEyesActivated }, function () {
		console.log("😍 react toggled");
		updateIcon();
	});
};

chrome.browserAction.onClicked.addListener(toggleHeartEyesActivated);

(function () {
	const networkFilters = {
		urls: [
			'*://*.facebook.com/webgraphql*ADD_REACTION*',
			'*://*.messenger.com/webgraphql*ADD_REACTION*'
		]
	};
	chrome.webRequest.onBeforeRequest.addListener(
		function (details) {

			var requestVariables = JSON.parse(decodeURIComponent(details.url.match(/&variables=(.*)/)[1]));

			if (requestVariables.data.reaction === "❤" && heartEyesActivated) {
				requestVariables.data.reaction = "😍";
				var redirectUrl = details.url.replace(/&variables=(.*)/, '&variables=' + encodeURIComponent(JSON.stringify(requestVariables)))

				return {
					redirectUrl
				};
			}
		},
		networkFilters,
		['blocking', 'requestBody']
	);
}());