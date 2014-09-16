/**
 * Copyright 2012 52°North Initiative for Geospatial Open Source Software GmbH
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *    http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 */

var wmsDescription_Store;
var time4Maps = {};

/**
 * Method to call requestController servlet and get json string.
 */
time4Maps.dataBaseRequestWithLayer = function(service, layer, callback) {
    var request_string = service + "?version=1.1.1&layer=" + layer;
    $.ajax({
        url: 'RequestController',
        type: "GET",
        async: false,
        data: {
            url: request_string,
            layer: layer,
            service: service,
        },
        success: function(data, status) {
            return callback(data);
        },
        error: function(err) {}
    });
};

/**
 * Method to call requestController servlet and get json string for layers
 */
time4Maps.dataBaseRequestWithoutLayer = function(service, callback) {
    this.service = service;
    var request_string = service;
    $.ajax({
        url: 'RequestController',
        type: "GET",
        async: false,
        data: {
            url: request_string,
            service: service,
            layer: "",
        },
        success: function(data, status) {
            return callback(data);
        },
        error: function(err) {
            if (err.status == 200) {

            } else {
                console.log('Error:' + err.responseText + '  Status: ' + err.status);
            }
        }
    });
};

/**
 * Method to display the layer chooser (if there are several layers registered)
 */
time4Maps.displayLayerChooser = function(data) {
    var jsonObject = $.parseJSON(data);

    dojo.require("dojo.data.ItemFileReadStore");
    dojo.require("dijit.form.Button");
    dojo.require("dijit.form.CheckBox");

    var storeData = {
        identifier: 'paramName', //each element and sub element must have an attribute 'paramName'
        items: [jsonObject]
    };

    var load_bt = dojo.byId("load_button");
    if (!load_bt) {
        var load_button = new dijit.form.Button({
            id: "load_button",
            label: "View in TIME4MAPS",
            onClick: function(e) {
                if (heatmap)
                    addCheckboxClick(e);
                time4Maps.layerChooserReload();
            }
        }, "load");
    }

    var mapping_JSON = "";
    wmsDescription_Store = new dojo.data.ItemFileReadStore({
        data: storeData,
        identifier: "id"
    });

    wmsDescription_Store.fetchItemByIdentity({
        identity: "layers",
        onItem: function(item, request) {
            mapping_JSON = item;
        }
    });
    var DefCharSpan = dojo.doc.createElement("span");
    if (mapping_JSON.number[0] == 1) {
        var layername = wmsDescription_Store.getValues(mapping_JSON, "layer_0")[0].name[0];
        time4Maps.dataBaseRequestWithLayer(this.service, layername, function(data) {
            time4Maps.displayTime4MapsMap(data);
        });
        return;
    } else {
        var cb = dojo.byId("cb");
        //if cb has already child nodes --> remove all of them
        while (cb.hasChildNodes()) {
            cb.removeChild(cb.lastChild);
        }

        for (var k = 0; k < mapping_JSON.number[0]; k++) {
            var layer = wmsDescription_Store.getValues(mapping_JSON, "layer_" + k);
            // if widget already exists --> destroy
            var dojolayer = dijit.byId("layer_" + k);
            if (dojolayer) dojolayer.destroy();

            var DefCharCheckbox = new dijit.form.CheckBox({
                name: layer[0].name[0] + "//" + layer[0].title[0],
                id: "layer_" + k,
                value: layer[0].name[0] + "//" + layer[0].title[0],
                checked: false
            });
            var DefCharLabel = dojo.doc.createElement("span");
            DefCharLabel.innerHTML = "name: " + layer[0].name[0] + " title: " + layer[0].title[0];
            var DefCharBreak = dojo.doc.createElement("br");
            DefCharSpan.appendChild(DefCharCheckbox.domNode);
            DefCharSpan.appendChild(DefCharLabel);
            DefCharSpan.appendChild(DefCharBreak);
            dojo.place(DefCharSpan, dojo.byId("cb"), "last");
        }
    };

    dojo.byId("layerChooser").style.display = "block";
    if (dojo.byId("mapII")) {
        hideSelectionTools();
        dojo.byId("mapII").style.display = "none";
    }

    dijit.byId("map_contentPane").resize();
};
/**
 * Method to load map after layers are chosen.
 * A new database request is send to receive new json string.
 */
time4Maps.layerChooserReload = function() {
    var layers = "";
    var layer_set = false;
    var mapping_JSON;
    wmsDescription_Store.fetchItemByIdentity({
        identity: "layers",
        onItem: function(item, request) {
            mapping_JSON = item;
        }
    });
    for (var k = 0; k < mapping_JSON.number[0]; k++) {
        var layer = wmsDescription_Store.getValues(mapping_JSON, "layer_" + k);
        if (dijit.byId("layer_" + k).get("checked")) {
            if (layer_set)
                layers += "," + layer[0].name[0];
            else {
                layers += layer[0].name[0];
                layer_set = true;
            }
        }
    }
    if (layers != "") {
        //wait for callback than display map
        time4Maps.dataBaseRequestWithLayer(this.service, layers, function(data) {
            document.getElementById("layerChooser").style.display = "none";

            //dojo.byId("map_contentPane").style.height = "90%";	
            //dijit.byId("map_contentPane").resize();
            time4Maps.displayTime4MapsMap(data);

        });
    } else alert("Please choose at least one layer!");
};

/**
 * Method for displaying the map and initializing time4maps gui.
 * Internally called.
 */
time4Maps.displayTime4MapsMap = function(data) {
    //reset all gui values
    var layerSwitcherCustom = dojo.byId("layerSwitcherCustom");
    while (layerSwitcherCustom.hasChildNodes()) {
        layerSwitcherCustom.removeChild(layerSwitcherCustom.lastChild);
    };
    var legend_frame = dojo.byId("legend_frame");
    legend_frame.setAttribute("src", "");

    var time_start_label = dojo.byId("time_start_label");
    time_start_label.innerHTML = "startTime";
    var time_end_label = dojo.byId("time_end_label");
    time_end_label.innerHTML = "endTime";

    dojo.byId("feature_label").innerHTML = "Click on the map to get feature information.";

    try {
        var jsonObject = $.parseJSON(data);
    } catch (e) {
        console.log("Error with jsonString from database");
        return;
    }

    if (data == null) {
        alert("Connection error. The map service is not available. Please check the service or contact the support team. Loading of the application stops now.");
        window.stop();
    }

    var storeData = {
        identifier: 'paramName',
        items: [jsonObject]
    };

    if (!dijit.byId("play_button")) {
        play_button = new dijit.form.Button({
            id: "play_button",
            label: "Animate map",
            onClick: function(e) {
                playSequence();
            }
        }, "play_div");
    };

    if (!dijit.byId("print_button")) {
        print_button = new dijit.form.Button({
            id: "print_button",
            label: "Print map",
            onClick: function(e) {
                openPrintPreview();
            }
        }, "print_div");
    };

    wmsDescription_Store = new dojo.data.ItemFileReadStore({
        data: storeData,
        identifier: "id"
    });

    if (dojo.byId("time4mapsMap"))
        dojo.byId("time4mapsMap").style.display = "block";
    if (dijit.byId("time4mapsMap"))
        dijit.byId("time4mapsMap").resize();
    if (dojo.byId("mapII")) {
        hideSelectionTools();
        dojo.byId("mapII").style.display = "none";
    }

    guiFunctions.resizeAll();

    if (map != null) {
        try {
            //map_width = map.getCurrentSize().w;
            //map_height = map.getCurrentSize().h;
            map_width = map.getSize()[0];
            map_height = map.getSize()[1];
        } catch (e) {
            console.log("Error in time4maps.js");
            console.log(e);
            //map_width = map.getCurrentSize().w;
            //map_height = map.getCurrentSize().h;
        }
    } else {
        console.log("map not available");
    }

    initializeMapping();
    initializeLayerGuiFilling();
    initializeTimeGuiFilling();
    buildToolTips();
};

/**
 * external call for showTime4Maps with id
 */
time4Maps.showTime4MapsId = function(id) {
    hideSelectionTools();
    dojo.byId("mapII").style.display = "none";
    metaViz.hideMetaViz();
    time4Maps.hideTime4Maps();

    dojo.byId("map_info_text").innerHTML = "Click on an item in the list to reset the map.";

    var entry = httpGet(findOne + "/" + id);
    if (entry["related service"] && entry["related layer"]) {
        var service = entry["related service"].toString();
        var layer = entry["related layer"].toString();
        time4Maps.showTime4Maps(service, layer);
    } else if (entry["related service"] && !entry["related layer"] && entry["related service"].indexOf("csw") < 0) {
        var service = entry["related service"].toString();
        time4Maps.showTime4MapsLayer(service);
    } else
        console.log("Time4Maps: Something went wrong with displaying Time4Maps");
};

/** 
 * internal call for showing time4Maps layers which are connected to service
 * @param
 */
time4Maps.showTime4MapsLayer = function(service) {
    if (heatmap)
        time4MapsMode = true;

    require(["dojo/dom"], function(dom) {
        var title = dom.byId("metaDataTable").rows[0].cells[1].innerHTML;
        dom.byId("description_wms_title").innerHTML = "Visualize " + title + " layers in Time4Maps";
    });

    time4Maps.dataBaseRequestWithoutLayer(service, function(data) {
        var map = dojo.byId("map");
        //delete children of map
        if (map) {
            while (map.hasChildNodes()) {
                map.removeChild(map.lastChild);
            }
        }

        if (data != "null\n") {
            time4Maps.displayLayerChooser(data);
        } else {
            console.log("no data");
        }
    });
};

/**
 * internal call for showing time4Maps with service and layer
 * @param service
 * @param layer
 */
time4Maps.showTime4Maps = function(service, layer) {
    if (heatmap)
        time4MapsMode = true;

    var map = dojo.byId("map");
    //delete children of map
    if (map) {
        while (map.hasChildNodes()) {
            map.removeChild(map.lastChild);
        }
    }
    time4Maps.dataBaseRequestWithLayer(service, layer, function(data) {
        time4Maps.displayTime4MapsMap(data);
    });
};

time4Maps.hideTime4Maps = function() {
    if (heatmap)
        time4MapsMode = false;

    dojo.byId("map_info_text").innerHTML = "Click on a boundingbox to get further information.";

    guiFunctions.resizeAll();

    var map = dojo.byId("map");
    //delete children of map
    if (map) {
        while (map.hasChildNodes()) {
            map.removeChild(map.lastChild);
        }
    }

    dojo.byId("time4mapsMap").style.display = "none";
    dojo.byId("layerChooser").style.display = "none";

    if (map2) {
        if (dojo.byId("map_contentPane").style.height.indexOf("%") < 0)
            dojo.byId("mapII").style.height = dojo.byId("map_contentPane").style.height;
        else
            dojo.byId("mapII").style.height = "100%";

        dojo.byId("mapII").style.display = "block";
        showSelectionTools();

        map2.updateSize();
        //vector.redraw();
    }
};