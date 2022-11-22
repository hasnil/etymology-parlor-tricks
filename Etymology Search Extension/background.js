var baseURLs = {
  Wiktionary: "https://wiktionary.org/wiki/",
  "Online Etymology Dictionary": "https://www.etymonline.com/word/",
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ etymologyWebsiteBaseURLs: baseURLs });

  for (let key of Object.keys(baseURLs)) {
    chrome.contextMenus.create({
      id: key,
      title: key,
      type: "normal",
      contexts: ["selection"],
    });
  }
});

chrome.contextMenus.onClicked.addListener(function (info) {
  chrome.storage.sync.get(["etymologyWebsiteBaseURLs"], (result) => {
    baseURL = result.etymologyWebsiteBaseURLs[info.menuItemId];
    var fullURL = baseURL + info.selectionText;

    if (info.menuItemId == "Wiktionary") {
      fullURL = fullURL + "#Etymology";
    }

    chrome.tabs.create({ url: fullURL });
  });
});
