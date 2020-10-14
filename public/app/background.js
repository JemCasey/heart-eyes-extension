var customEmojis;

chrome.browserAction.setTitle({ title: "Change reacts for Facebook Messenger" });

chrome.storage.sync.get("customEmojis", function (obj) {
	customEmojis = JSON.parse(obj.customEmojis || "{}");
});

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

			if (customEmojis[requestVariables.data.reaction]) {
				requestVariables.data.reaction = customEmojis[requestVariables.data.reaction];
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