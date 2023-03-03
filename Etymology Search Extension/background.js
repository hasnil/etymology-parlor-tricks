var baseURLs = {
  Wiktionary: "https://wiktionary.org/wiki/",
  "Online Etymology Dictionary": "https://www.etymonline.com/word/",
};


let db = null;

chrome.runtime.onInstalled.addListener((details) => {

  if(details.reason === "install"){

    chrome.storage.sync.set({ etymologyWebsiteBaseURLs: baseURLs });

    for (let key of Object.keys(baseURLs)) {
      chrome.contextMenus.create({
        id: key,
        title: key,
        type: "normal",
        contexts: ["selection"],
      });
    }

    if (!(indexedDB)) {
      console.error("This browser does not support IndexedDB.");
      return;
    }

    const openRequest = indexedDB.open('EtymologySearchExtensionDB', 1);
    
    openRequest.onupgradeneeded = (event) => {
      db = event.target.result;
      let objectStore = db.createObjectStore('history', { keyPath: 'id', autoIncrement: true});

      objectStore.transaction.oncomplete = () => {
        //console.log("ObjectStore created.");
      }
    }
    
    openRequest.onsuccess = (event) => {
      db = event.target.result;
      //console.log("Database opened.");

      db.onerror = function (event) {
          console.error("Failed to open database.")
      }
    }

  }

});


chrome.contextMenus.onClicked.addListener(function (info) {
  chrome.storage.sync.get(["etymologyWebsiteBaseURLs"], (result) => {
    baseURL = result.etymologyWebsiteBaseURLs[info.menuItemId];
    var fullQueryURL = baseURL + info.selectionText;

    if (info.menuItemId == "Wiktionary") {
      fullQueryURL = fullQueryURL + "#Etymology";
    }

    chrome.tabs.create({ url: fullQueryURL });

    const connectDB = indexedDB.open('EtymologySearchExtensionDB');
    connectDB.onsuccess = () => {
      db = connectDB.result;
      const insertTransaction = db.transaction("history", "readwrite");
      const objectStore = insertTransaction.objectStore("history");
    
      return new Promise((resolve, reject) => {
        insertTransaction.oncomplete = () => {
            //console.log("Query successfully added to history.");
            resolve(true);
        }
  
        insertTransaction.onerror = () => {
            console.error("Error adding query to history.")
            resolve(false);
        }
  
        let date = new Date().toLocaleString();
        let query = {datetime: date, query_content: info.selectionText, query_URL: fullQueryURL};
  
        let insertRequest = objectStore.add(query);
        insertRequest.onsuccess = () => {
          //console.log("Added: ", query);
        }
        insertRequest.onerror = () => {
          console.error("Failed to add: ", query);
        }
      });
    }

    connectDB.onerror = function (event) {
      console.error("Failed to connect to database.");
      console.error(event);
    }

  });
});
