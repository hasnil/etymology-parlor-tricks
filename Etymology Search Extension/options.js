import { loadSources } from "./options-load-sources.js";

function save_options() {
  var title = document.getElementById("title").value;
  var url = document.getElementById("url").value;

  if (title && url) {
    chrome.storage.sync.get(["etymologyWebsiteBaseURLs"], (result) => {
      var baseURLs = result.etymologyWebsiteBaseURLs;
      baseURLs[title] = url;

      chrome.contextMenus.removeAll(); // To avoid duplicate error

      for (let key of Object.keys(baseURLs)) {
        chrome.contextMenus.create({
          id: key,
          title: key,
          type: "normal",
          contexts: ["selection"],
        });
      }

      chrome.storage.sync.set({ etymologyWebsiteBaseURLs: baseURLs }, () => {
        var status = document.getElementById("status");
        status.textContent = "Source saved.";
        setTimeout(function () {
          status.textContent = "";
        }, 1000);
      });
    });
    let sourceNode = document.getElementById("current-sources");
    sourceNode.removeChild(sourceNode.lastChild);

    chrome.storage.sync.get(["etymologyWebsiteBaseURLs"], (result) => {
      result.etymologyWebsiteBaseURLs[title] = url;
      loadSources(result);
    });
  }
}

document.getElementById("save").addEventListener("click", save_options);

document.addEventListener("keypress", (x) => {
  if (x.key === "Enter") {
    save_options();
  }
});
