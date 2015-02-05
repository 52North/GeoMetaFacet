/**
 * Copyright 2012 52�North Initiative for Geospatial Open Source Software GmbH
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

/* Variables */
var map2 = null;
var selectOneBox = false;
var featureStore = null;
var latestBoxSelection = null;

/**
 * This javascript file contains source code for initalizing the OpenLayers map and legend.
 * The general params, such as wms name, layer name ... will be added to the gui element.
 * Time information is checked and appropriate methods to generate time slider or time combobox are called.
 *
 * @author Hannes Tressel. Professorship of Geoinformation Systems
 */
function initMap() {
    require(["dojo/dom-attr"], function(domAttr) {
        if (domAttr.get("mapII", "innerHTML") === "") {

            map2 = new ol.Map({
                interactions: ol.interaction.defaults().extend([selectInteraction()]),
                target: "mapII",
                renderer: "canvas",
                view: new ol.View2D({
                    center: transform(0, 0),
                    zoom: 0
                }),
                layers: [
                    new ol.layer.Tile({
                        source: new ol.source.MapQuest({
                            crossOrigin: 'anonymous',
                            layer: "osm"
                        })
                    }),

                    new ol.layer.Vector({
                        source: new ol.source.GeoJSON(),
                        style: new ol.style.Style({
                            stroke: new ol.style.Stroke({
                                color: "#007C95", //#F9B200
                                width: 2,
                                opacity: 0.8
                            })
                        })
                    })
                ],
                controls: [
                    new ol.control.MousePosition({
                        projection: "EPSG:4326"
                    }),
                    new ol.control.ZoomSlider()
                ]

            });

            manageMapToolIcons();

            map2.on("mousemove", function(evt) {
                var features_ = [];
                map2.forEachFeatureAtPixel(evt.pixel, function(feature) {
                    features_.push(feature);
                });
                features_.length > 0 ?
                    document.getElementById("mapII").style.cursor = "pointer" :
                    document.getElementById("mapII").style.cursor = "";
            });

        }
    });
}

function transform(lon, lat) {
    return ol.proj.transform([lon, lat], "EPSG:4326", "EPSG:3857");
}

function addFeatures_() {
    createAllBoxesFromDB();
}

function createPoint(lon, lat) {
    var point = new ol.Feature({
        geometry: new ol.geom.Point(transform(lon, lat))
    });

    return point;
}

function createAllBoxesFromDB() {
    require(["dojo/store/Memory", "dojo/_base/array"], function(Memory, arrayUtil) {
        featureStore = new Memory();
        var areas = new Memory();

        unselectAllFeatures();
        removeAllFeatures_();

        //get selected boundingbox 
        var items;
        var selectedTopics = getTopicSelection();
        var selectedDatatypes = getDatatypeSelection();
        var selectedOrganizations = getOrganizationSelection();
        var selectedScenarios = getScenarioSelection();
        var selectedHierarchylevelnames = getHierarchylevelnameSelection();


        //preparing database request - order of attributes is important!
        //if no selection is made - a simple "getAll" request is done
        if (selectedTopics == "-" && selectedDatatypes == "-" && selectedOrganizations == "-" && selectedScenarios == "-" && selectedHierarchylevelnames == "-") {
            items = httpGet(findAllBBox);
            allBoxes = true;
        } else {
            items = httpGet(findMixedBox + "/" + selectedHierarchylevelnames + "/" + selectedTopics + "/" + selectedDatatypes + "/" + selectedOrganizations + "/" + selectedScenarios);
            allBoxes = false;
        }

        var extent = ol.extent.createEmpty();
        arrayUtil.forEach(items, function(item) {
            if (item != null && item.geographicboundingbox != "") {
                if (featureStore.query({
                    extent: item.geographicboundingbox
                }).length === 0) {

                    //Erzeugung einer Punktliste aus der im Anschluss ein LineString Feature erzeugt wird
                    var bbox = LonLatToPointArray(item);
                    ol.extent.extend(extent, ol.extent.boundingExtent(bbox));


                    if (bbox != null) {

                        featureStore.put({
                            id: [item.id],
                            extent: item.geographicboundingbox,
                            extent_: ol.extent.boundingExtent(bbox),
                            isClustered: false,
                            area: ol.extent.getArea(bbox.extent),
                            coordinates: bbox,
                            centerLon: ol.extent.getCenter(bbox.extent)[0],
                            centerLat: ol.extent.getCenter(bbox.extent)[1]
                        });

                        areas.put({
                            area: ol.extent.getArea(bbox.extent)
                        });

                    }
                } else {
                    featureStore.query({
                        extent: item.geographicboundingbox
                    }).forEach(function(feature) {
                        feature.id.push(item.id);
                    });
                }
            }

        });
        if (items.length > 0) {
            initCluster(featureStore, areas);
            map2.updateSize();
            map2.getView().getView2D().fitExtent(extent, map2.getSize());
        }

        if (latestBoxSelection != null) {
            var extent = latestBoxSelection.getProperties().properties.extent_;
            map2.interactions_.array_[10].getFeatures().push(latestBoxSelection);
            map2.getView().getView2D().fitExtent(extent, map2.getSize());
        }
        latestBoxSelection = null;

    });

}

function LonLatToPointArray(item) {
    if (item instanceof Object) {
        item = item.geographicboundingbox;
    } else {
        item = item;
    }

    if (item != null) {

        var latlng = item.split(";");

        var koord = [];
        for (var i = 0; i < latlng.length; i++) {
            latlngSplit = latlng[i].split(",");

            if (parseFloat(latlngSplit[1]) > 85.1) latlngSplit[1] = "85";
            if (parseFloat(latlngSplit[1]) < -85.1) latlngSplit[1] = "-85";
            //if (parseFloat(latlngSplit[0]) > 89) latlngSplit[0] = "85";
            //if (parseFloat(latlngSplit[0]) < -89) latlngSplit[0] = "-85";

            latlngSplit[0] = parseFloat(latlngSplit[0]);
            latlngSplit[1] = parseFloat(latlngSplit[1]);

            koord.push(transform(latlngSplit[0], latlngSplit[1]));

        }

        //koord.push([koord[3][0], koord[0][1]]);
        koord.push(koord[0]);
        koord.extent = ol.extent.boundingExtent(koord);

        return koord;
    } else return null;

}

function removeAllFeatures_() {
    map2.getLayers().array_[1].getSource().rBush_.clear();
    map2.getLayers().array_[1].getSource().rBush_ = new ol.structs.RBush();
    map2.updateSize();
    map2.render();
}

function showFeature(id) {
    focusSingleFeature(id);
}

function focusSingleFeature(id) {
    if (!metaVizOn) {
        var feature = httpGet(findOne + "/" + id);
        var bbox = null;
        if (feature instanceof Object) {
            bbox = LonLatToPointArray(feature.geographicboundingbox);
            var extent = ol.extent.boundingExtent(bbox);
            map2.getView().getView2D().fitExtent(extent, map2.getSize());
            unselectAllFeatures();

            //Select choosen Feature from HTML-List
            var featureToSelect = getFeatureByExtent(feature.geographicboundingbox);
            if (featureToSelect != null) {
                map2.interactions_.array_[10].getFeatures().push(featureToSelect);
            } else {
                console.log("es ist ein Fehler aufgetreten!");
            }
        }
    }
}

function manageMapToolIcons() {
    var mouseOnMap = null;
    require(["dojo/dom-class", "dojo/dom-attr", "dojo/dom", "dojo/on", "dojo/mouse", "dojo/dom-style"],
        function(domClass, domAttr, dom, on, mouse, domStyle) {
            domStyle.set("btnCursor", "display", "block");
            domStyle.set("btnFilter", "display", "block");
            domStyle.set("btnRectangle", "display", "block");


            /*
            btnCursor
            */
            on(dom.byId("mapII"), mouse.enter, function(evt) {
                mouseOnMap = true;
            });

            on(dom.byId("mapII"), mouse.leave, function(evt) {
                mouseOnMap = false;
            });

            map2.on("singleclick", function() {
                map2.getInteractions().array_[10].getFeatures().once("add", function(evt) {
                    if (domClass.contains("btnCursor", "mapToolIcon_active") && mouseOnMap) {
                        updateResultList([evt.element]);
                        latestBoxSelection = evt.element;
                    }
                });
            });

            domAttr.set("btnCursor", "onclick", function() {
                if (!domClass.contains("btnCursor", "mapToolIcon_active")) {
                    domClass.toggle("btnCursor", "mapToolIcon_active");
                    domClass.remove("btnFilter", "mapToolIcon_active");
                    domClass.remove("btnRectangle", "mapToolIcon_active");
                    unselectAllFeatures();
                    if (statusDragBoxInteraction()) {
                        map2.getInteractions().array_.pop();
                    }
                }
            });

            /*
            btnFilter
            */
            domAttr.set("btnFilter", "onclick", function() {
                if (!domClass.contains("btnFilter", "mapToolIcon_active")) {
                    domClass.toggle("btnFilter", "mapToolIcon_active");
                    domClass.remove("btnCursor", "mapToolIcon_active");
                    domClass.remove("btnRectangle", "mapToolIcon_active");

                    if (statusDragBoxInteraction()) {
                        map2.getInteractions().array_.pop();
                    }

                    var vectorLayer = getVectorLayer();
                    if (vectorLayer != null) {
                        unselectAllFeatures();
                        var features = vectorLayer.getSource().getFeatures();
                        var mapExtent = map2.getView().getView2D().calculateExtent(map2.getSize());
                        for (var i in features) {
                            var featureExtent = features[i].getProperties().properties.extent_;
                            if (ol.extent.containsExtent(mapExtent, featureExtent)) {
                                map2.interactions_.array_[10].getFeatures().push(features[i]);
                            }
                        }

                        if (map2.interactions_.array_[10].getFeatures().array_.length > 0) {
                            updateResultList(map2.interactions_.array_[10].getFeatures().array_);
                        }

                    } else {
                        console.log("Es ist ein Fehler aufgetreten!");
                    }



                } else {
                    unselectAllFeatures();
                    domClass.toggle("btnFilter", "mapToolIcon_active");
                    domClass.toggle("btnCursor", "mapToolIcon_active");
                }
            });

            /*
            btnRectangle
             */
            domAttr.set("btnRectangle", "onclick", function() {
                if (!domClass.contains("btnRectangle", "mapToolIcon_active")) {
                    domClass.toggle("btnRectangle", "mapToolIcon_active");
                    domClass.remove("btnCursor", "mapToolIcon_active");
                    domClass.remove("btnFilter", "mapToolIcon_active");
                    unselectAllFeatures();
                    map2.addInteraction(dragBoxInteraction());
                }
            });


        });
}

function getVectorLayer() {
    var layer = map2.getLayers().array_;
    for (var i in layer) {
        if (layer[i] instanceof ol.layer.Vector) {
            return layer[i];
        }
    }

    return null;
}

function getFeatureByExtent(extent) {
    var features = map2.getLayers().array_[1].getSource().getFeatures();
    var feature = null;

    for (var i in features) {
        var featureExtent = features[i].getProperties().properties.extent;
        if (featureExtent === extent) {
            feature = features[i];
            return feature;
        }
    }

    if (feature === null) {
        require(["dojo/store/Memory"], function(Memory) {
            featureStore.query({
                extent: extent
            }).forEach(function(item) {

                feature = new ol.Feature({
                    geometry: new ol.geom.LineString(item.coordinates),
                    properties: {
                        id: item.id,
                        extent: item.extent,
                        extent_: item.extent_
                    }
                });

                map2.getLayers().array_[1].getSource().addFeature(feature);
            });
        });
    }

    return feature;
}

function unselectAllFeatures() {
    map2.interactions_.array_[10].getFeatures().clear();
}

function updateResultList(features) {
    guiFunctions.showPreloaderCallback().then(function() {
        var i = 0;
        var extents = [];

        var counter = setInterval(function() {
            extents.push(features[i].getProperties().properties.extent);

            if (i === (features.length - 1)) {
                setBoundingboxSelection(extents);
                hidePreloader();
                clearInterval(counter);
            }

            i++;

        }, 1);
    });
}

function selectInteraction() {
    var select = new ol.interaction.Select({
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: "#F9B200",
                width: 2,
                opacity: 0.8
            })
        })
    });

    return select;
}

function dragBoxInteraction() {
    var dragBox = new ol.interaction.DragBox({
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: "rgba(230,230,250, 0.5)"
            }),
            stroke: new ol.style.Stroke({
                color: "#F9B200",
                width: 2
            })
        })
    });

    dragBox.on("boxend", function() {
        unselectAllFeatures();
        var dragBoxExtent = dragBox.getGeometry().getExtent();
        var vectorLayer = getVectorLayer();
        var features = vectorLayer.getSource().getFeatures();
        for (var i in features) {
            var featureExtent = features[i].getProperties().properties.extent_;
            if (ol.extent.containsExtent(dragBoxExtent, featureExtent)) {
                map2.getInteractions().array_[10].getFeatures().push(features[i]);
            }
        }

        if (map2.interactions_.array_[10].getFeatures().array_.length > 0) {
            updateResultList(map2.interactions_.array_[10].getFeatures().array_);
        }

    });

    return dragBox;
}

function statusDragBoxInteraction() {
    /*
        ol.interaction.DragZoom (=9) is an instance of ol.interaction.DragBox(=11) too!
        I'm looking for a better and safer way to check if Interaction is an instance of
        ol.interaction.DragBox
    
    */
    var interactionArray = map2.getInteractions().array_;

    if (interactionArray.length > 11) {
        return true;
    } else {
        return false;
    }
}

function initCluster(featureStore, areas) {
    /*
        Calculate important values for cluster process
    */
    var threshold = 15;
    var resolution = map2.getView().getResolution();
    var bbox = map2.getView().calculateExtent(map2.getSize());
    Cluster(featureStore, resolution, bbox, 1, threshold, calculateAreaThreshold(areas));

    /*
        Events...
    */
    map2.getView().on("change:resolution", function() {
        var resolution = map2.getView().getResolution();
        var bbox = map2.getView().calculateExtent(map2.getSize());
        Cluster(featureStore, resolution, bbox, 1, threshold, calculateAreaThreshold(areas));
    });

    map2.getView().on("change:center", function() {
        var resolution = map2.getView().getResolution();
        var bbox = map2.getView().calculateExtent(map2.getSize());
        Cluster(featureStore, resolution, bbox, 1, threshold, calculateAreaThreshold(areas));
    });
}

function calculateAreaThreshold(areas) {
    var areaThreshold = null;

    require(["dojo/store/Memory"], function(Memory) {
        var area = areas.query(function(item) {
            return item.area >= 0;
        }, {
            sort: [{
                attribute: "area"
            }]
        });

        areaThreshold = {
            min: area[Math.floor((area.length * 2) / 100)].area,
            max: area[(area.length - 1) - Math.floor((area.length * 2) / 100)].area
        };

    });

    return areaThreshold;
}

function hideSelectionTools() {
    require(["dojo/dom-style"], function(domStyle) {
        domStyle.set("btnCursor", "display", "none");
        domStyle.set("btnFilter", "display", "none");
        domStyle.set("btnRectangle", "display", "none");
    });
}

function showSelectionTools() {
    require(["dojo/dom-style"], function(domStyle) {
        domStyle.set("btnCursor", "display", "block");
        domStyle.set("btnFilter", "display", "block");
        domStyle.set("btnRectangle", "display", "block");
    });
}