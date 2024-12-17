// *******************************************
// Dev (Docking) Panel
// *******************************************
let guid = null;

function SearchPanel(viewer, container, id, title, options) {
    this.viewer = viewer;
    console.log("SearchPanel: ", viewer);
    Autodesk.Viewing.UI.DockingPanel.call(this, container, id, title, options);

    // Panel container styling
    this.container.classList.add('docking-panel-container-solid-color-a');
    this.container.style.top = "10px";
    this.container.style.left = "10px";
    this.container.style.width = "auto";
    this.container.style.height = "auto";
    this.container.style.resize = "auto";

    // Main content container
    var div = document.createElement('div');
    div.style.margin = '10px';
    div.style.width = 'auto';
    div.style.height = 'auto';

    // Add custom controls to the first row
    var controlsDiv = document.createElement('div');
    controlsDiv.id = "controls";
    controlsDiv.style.position = "fixed";
    controlsDiv.style.top = "10px";
    controlsDiv.style.left = "10px";
    controlsDiv.style.zIndex = "5";
    controlsDiv.style.backgroundColor = "white";
    controlsDiv.style.padding = "10px";
    controlsDiv.style.borderRadius = "5px";
    controlsDiv.style.boxShadow = "0 2px 2px rgba(0, 0, 0, 0.2)";

    // Input field for Object ID
    var objectIdInput = document.createElement('input');
    objectIdInput.id = "objectId";
    objectIdInput.type = "text";
    objectIdInput.placeholder = "(Object Id/Search..)";
    objectIdInput.style.margin = "5px 0";
    objectIdInput.style.padding = "5px";
    objectIdInput.style.width = "150px";
    //add event enter
    objectIdInput.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            searchItems(viewer);
        }
    });

    // Buttons
    function createButton(id, text, onClickHandler) {
        var button = document.createElement('button');
        button.id = id;
        button.innerText = text;
        button.style.margin = "5px";
        button.style.padding = "5px";
        button.style.fontSize = "12px";
        button.style.cursor = "pointer";
        button.addEventListener('click', onClickHandler);
        return button;
    }

    var zoomInButton = createButton('zoomInBtn', 'Zoom In', function () {
        zoomIn();
    });
    var zoomOutButton = createButton('zoomOutBtn', 'Zoom Out', function () {
        zoomOut();
    });
    var isolateButton = createButton('isolateBtn', 'Isolate', function () {
        isolateObject();
    });
    var searchButton = createButton('searchBtn', 'Search', function () {
        searchItems(viewer);
    });


    // Add controls to the div
    controlsDiv.appendChild(objectIdInput);
    controlsDiv.appendChild(zoomInButton);
    controlsDiv.appendChild(zoomOutButton);
    controlsDiv.appendChild(isolateButton);
    controlsDiv.appendChild(searchButton);
    // Append the control panel to the main content
    div.appendChild(controlsDiv);

    // Search results container
    var results = document.createElement('div');
    results.setAttribute("id", "search-results");
    results.setAttribute("class", "search-results");
    div.appendChild(results);

    // Append to the docking panel
    this.container.appendChild(div);
}

SearchPanel.prototype = Object.create(Autodesk.Viewing.UI.DockingPanel.prototype);
SearchPanel.prototype.constructor = SearchPanel;

// search model properties by filters
function searchItems(viewer) {

    let searchValue = document.getElementById("objectId").value;
    console.log("searchValue: ", searchValue);
    if (searchValue === "") {
        viewer.fitToView();
        return;
    }
    // if searchValue is number meaning flag is true
    if (searchValue.match(/^[0-9]+$/) != null) {
        // get select by object id
        let dbId = parseInt(document.getElementById("objectId").value);
        // find object id in model
        if (viewer.model.getData().instanceTree.nodeAccess.dbIdToIndex[dbId] != null) {
            // zoom to that object and isolate
            getProperty(viewer.model, dbId);
            zoomAndIsoObject(viewer, dbId);
            selectObject(viewer, dbId);
            return;
        }
    }
    // if user input match 45 characters include string and number, allow console information of object properties
    // example : 5bb069ca-e4fe-4e63-be31-f8ac44e80d30-0004718e
    if (document.getElementById("objectId").value.match(/^[a-z0-9]{8}(-[a-z0-9]{4}){3}-[a-z0-9]{12}-[a-z0-9]{8}$/) != null) {
        // get select by guid
        guid = document.getElementById("objectId").value;
        // find external id in model : https://aps.autodesk.com/blog/get-dbid-externalid
        console.log("externalId: ", guid);
        viewer.model.getExternalIdMapping(function (mapping) {
            mappingAndIsolate(mapping, viewer);
        });
        return;
    }
    viewer.search(
        document.getElementById("objectId").value,
        function (dbIDs) {
            viewer.isolate(dbIDs);
            // select objects
            viewer.select(dbIDs);
            viewer.fitToView(dbIDs);
            // set color to object
            //viewer.setThemingColor(dbIDs, new THREE.Vector4(0, 1, 0, 1));
        }
    );
}

function mappingAndIsolate(mapping, viewer) {
    // get dbId by guid
    let dbId = mapping[guid];
    zoomAndIsoObject(viewer, dbId);
    // print properties by object id
    getProperty(viewer.model, dbId);
    // print type of object
    console.log("Object Id: ", dbId);
}

function zoomAndIsoObject(viewer, dbId) {
    console.log('Zoom Iso Object: ', dbId);
    viewer.isolate(dbId);
    viewer.fitToView(dbId);
}

function selectObject(viewer, dbId) {
    console.log('Select Object: ', dbId);
    viewer.select(dbId);
    viewer.fitToView(dbId);
}

// Zoom In function
function zoomIn() {
    const objects = getSelectedOrInputObject(this.viewer);
    if (objects && objects.length > 0) {
        this.viewer.fitToView(objects);
        // select objects
        this.viewer.select(objects);
        console.log(`Zoomed to objects: ${objects}`);
    } else {
        console.log('No object selected or input to zoom in.');
    }
}

// Zoom Out function
function zoomOut() {
    // reset isolate
    console.log("Reset And Zoom Out");
    this.viewer.isolate([]);
    this.viewer.navigation.fitBounds(true);
    this.viewer.fitToView();
}

// Isolate function
function isolateObject() {
    const objects = getSelectedOrInputObject(this.viewer);
    if (objects && objects.length > 0) {
        this.viewer.isolate(objects); // Isolate specified objects
        this.viewer.fitToView(objects); // Zoom into isolated objects
        console.log(`Isolated objects: ${objects}`);
    } else {
        console.log('No object selected or input to isolate.');
    }
}

// Helper function to get object from input or selection
function getSelectedOrInputObject(viewer) {
    if (viewer.getSelection().length > 0) {
        return viewer.getSelection(); // Return selected objects
    }
    const inputId = document.getElementById('objectId').value;
    // if contains, parse to list of object IDs
    if (inputId.includes(',')) {
        return inputId.split(',').map(id => parseInt(id));
    }
    if (inputId) {
        const parsedId = parseInt(inputId);
        if (!isNaN(parsedId)) {
            return [parsedId]; // Return array of object ID
        }
        console.error('Invalid Object ID input.');
    }
    return; // Fallback to current selection
}

// allow search by element id in revit
function searchByElementId(viewer, elementId) {
    // get all name of object
    let allName = [];
    // get all object id
    let allDbId = [];
    let objects = viewer.model.getData().instanceTree.nodeAccess.dbIdToIndex;
    for (var key in objects) {
        if (objects.hasOwnProperty(key)) {
            let name = viewer.model.getData().instanceTree.getNodeName(key);
            if (name !== undefined && name.includes(elementId)) {
                allName.push(name);
                allDbId.push(key);
            }
        }
    }
    return allDbId;
}
