export function loadSources(result) {
    var orderedList = document.createElement("ol");
  
    for (let i of Object.keys(result["etymologyWebsiteBaseURLs"])) {
      let listItem = document.createElement("li");
      listItem.innerHTML = i;
  
      if (i != "Online Etymology Dictionary" && i != "Wiktionary") {
        var padding = "\u00A0".repeat(3);
        listItem.appendChild(document.createTextNode(padding));
        var buttonElement = listItem.appendChild(
          document.createElement("button")
        );
        buttonElement.innerHTML = "Delete";
        buttonElement.onclick = function () {
          this.parentElement.remove();
          var baseURLs = result["etymologyWebsiteBaseURLs"];
          delete baseURLs[i];
  
          chrome.storage.sync.set({ etymologyWebsiteBaseURLs: baseURLs });
  
          chrome.contextMenus.remove(i);
        };
      }
  
      orderedList.appendChild(listItem);
    }
  
    document.getElementById("current-sources").appendChild(orderedList);
  };

chrome.storage.sync.get(["etymologyWebsiteBaseURLs"], (result) => {
  loadSources(result);
});
