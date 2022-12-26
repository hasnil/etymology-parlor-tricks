function load_history() {
    let db = null;

    const openRequest = indexedDB.open('EtymologySearchExtensionDB');

    openRequest.onsuccess = () => {

        db = openRequest.result;
        const getTransaction = db.transaction('history', 'readonly');
        const objectStore = getTransaction.objectStore("history");

        getTransaction.onerror = () => {
            console.error("Error retrieving history.")
        }        


        var table = document.createElement("table");
        table.style.textAlign = "center";
        table.style.tableLayout = "fixed";
        table.style.marginLeft = "auto";
        table.style.marginRight = "auto";

        let tableHeaderRow = document.createElement("tr");
        let tableHeader1 = document.createElement("th");
        tableHeader1.style.border = "1px solid";
        tableHeader1.innerText = "Datetime";
        let tableHeader2 = document.createElement("th");
        tableHeader2.innerText = "Query Content";
        tableHeader2.style.border = "1px solid";
        tableHeaderRow.appendChild(tableHeader1);
        tableHeaderRow.appendChild(tableHeader2);

        table.appendChild(tableHeaderRow);


        let getAllRequest = objectStore.openCursor(null, 'prev');

        getAllRequest.onsuccess = (event) => {
            const cursor = event.target.result;
            if(cursor){
                let id = cursor.value['id'];

                let tableRow = document.createElement("tr");
                let tableDataCell1 = document.createElement("td");
                tableDataCell1.style.border = "1px solid";
                tableDataCell1.style.maxWidth = "50em";
                tableDataCell1.style.overflowWrap = "anywhere";
                tableDataCell1.innerText = cursor.value['datetime'];
                tableRow.appendChild(tableDataCell1);
    
                let tableDataCell2 = document.createElement("td");
                tableDataCell2.style.border = "1px solid";
                tableDataCell2.style.maxWidth = "50em";
                tableDataCell2.style.overflowWrap = "anywhere";
                tableDataCell2.innerHTML = "<a target=\"_blank\" href=" + cursor.value['query_URL'] + ">" + cursor.value['query_content'] + "</a>";
                tableRow.appendChild(tableDataCell2);


                var deleteButton = document.createElement("button");
                deleteButton.innerHTML = "X";
                deleteButton.addEventListener('click', () => {

                    const deleteTransaction = db.transaction("history", "readwrite");

                    deleteTransaction.onerror = (event) => {
                        console.error("Failed to delete entry from history.");
                        console.error(event);
                    };
        
                    const deleteFromObjectStore = deleteTransaction.objectStore("history");
                    const deleteFromObjectStoreRequest = deleteFromObjectStore.delete(id);
        
                    deleteFromObjectStoreRequest.onsuccess = () => {
                        //console.log("Deleted entry from history.");
                        document.getElementById("history-table").innerHTML = "";
                        load_history();
                    };
        
                    deleteFromObjectStoreRequest.onerror = (event) => {
                        console.error("Error deleting record from history.");
                        console.error(event);
                    }

                });
                let tableDataCell3 = document.createElement("td");
                tableDataCell3.appendChild(deleteButton);
                tableRow.appendChild(tableDataCell3);

                table.append(tableRow);
                
                cursor.continue();
            }
        }

        getAllRequest.onerror = (event) => {
            console.error("ObjectStore error.");
            console.error(event);
        }

        document.getElementById("history-table").appendChild(table);


        var clearButton = document.createElement("button");
        clearButton.innerHTML = "Clear History";
        clearButton.onclick = () => {

            const clearTransaction = db.transaction("history", "readwrite");

            
            clearTransaction.onerror = (event) => {
                console.error("Failed to clear history.");
                console.error(event);
            };

            const clearObjectStore = clearTransaction.objectStore("history");

            const clearObjectStoreRequest = clearObjectStore.clear();

            clearObjectStoreRequest.onsuccess = () => {
                //console.log("History cleared");
                document.getElementById("history-table").innerHTML = "";
                load_history();
            };

            clearObjectStoreRequest.onerror = (event) => {
                console.error("Error clearing history.");
                console.error(event);
            }
        }

        
        var div = document.createElement("div");
        div.setAttribute('style', 'text-align:center;');
        div.style.marginTop = "20px";
        div.appendChild(clearButton);
        document.getElementById("history-table").appendChild(div);
    }

    openRequest.onerror = (event) => {
        console.error("IndexedDB error.");
        console.error(event);
    }
}

load_history();