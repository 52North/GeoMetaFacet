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

/**
 * This javascript file contains source code for initalizing the OpenLayers map and legend.
 * The general params, such as wms name, layer name ... will be added to the gui element.
 * Time information is checked and appropriate methods to generate time slider or time combobox are called.
 *
 * @author Hannes Tressel, Christin Henzen, Daniel Kadner. Professorship of Geoinformation Systems
 */

//OL map, list of available layer
var map, wms_layer, layer_Array;
//number of actually visible layer
var vis_layer_number = 0;

/**
 * This method will be called from index.jsp/start.jsp to initialize the content filling.
 * Choosen layer are added to the map and click events on the map are registered here.
 */
function initializeMapping() {
    //getting objects from the json store

    var service_JSON = null;
    var layer_JSON = null;
    var time_JSON = null;
    var period_JSON = null;

    wmsDescription_Store.fetchItemByIdentity({
        identity: "layerDescriptionParam",
        onItem: function(item, request) {
            layer_JSON = item;
        }
    });

    wmsDescription_Store.fetchItemByIdentity({
        identity: "serviceDescriptionParam",
        onItem: function(item, request) {
            service_JSON = item;
        }
    });

    wmsDescription_Store.fetchItemByIdentity({
        identity: "timeParam",
        onItem: function(item, request) {
            time_JSON = item;
        }
    });

    wmsDescription_Store.fetchItemByIdentity({
        identity: "periodParam",
        onItem: function(item, request) {
            period_JSON = item;
        }
    });

    map = new ol.Map({
        renderer: "canvas",
        target: "map",
        layers: [
            new ol.layer.Tile({
                title: "vmap0",
                source: new ol.source.TileWMS({
                    url: 'http://vmap0.tiles.osgeo.org/wms/vmap0',
                    params: {
                        'VERSION': '1.1.1',
                        'LAYERS': 'basic',
                        'FORMAT': 'image/jpeg'
                    }
                })
            })
        ],
        view: new ol.View2D({
            center: transform(0, 0),
            zoom: 0,
            projection: "EPSG:4326"
        }),
        controls: [
            new ol.control.MousePosition({
                projection: "EPSG:4326"
            }),
            new ol.control.ZoomSlider()
        ]
    });

    layer_Array = new Array(layer_JSON.name.length);

    for (var i = 0; i < layer_Array.length; i++) {
        if (time_JSON != null && time_JSON.def[i] != null && time_JSON.start[i] != null && period_JSON.year[i] != null && period_JSON.month[i] != null && period_JSON.day[i] != null) {
            if (service_JSON.format === "image/tiff" || service_JSON.format == "image/tiff") {
                wms_layer = new ol.layer.Image({
                    title: layer_JSON.title[i],
                    source: new ol.source.ImageWMS({
                        url: service_JSON.url,
                        params: {
                            "LAYERS": layer_JSON.name[i],
                            "FORMAT": "image/png",
                            "VERSION": service_JSON.version[0],
                            "time": cutDate(new Date(time_JSON.def[i]))
                        }
                    })
                });

                map.addLayer(wms_layer);
                layer_Array[i] = wms_layer;

            } else {
                wms_layer = new ol.layer.Image({
                    title: layer_JSON.title[i],
                    source: new ol.source.ImageWMS({
                        url: service_JSON.url,
                        params: {
                            "LAYERS": layer_JSON.name[i],
                            "FORMAT": service_JSON.format[0],
                            "VERSION": service_JSON.version[0],
                            "time": cutDate(new Date(time_JSON.def[i]))
                        }
                    })
                });
                map.addLayer(wms_layer);
                layer_Array[i] = wms_layer;

            }
        } else {
            if (service_JSON.format === "image/tiff") {
                wms_layer = new ol.layer.Image({
                    title: layer_JSON.title[i],
                    source: new ol.source.ImageWMS({
                        url: service_JSON.url,
                        params: {
                            "LAYERS": layer_JSON.name[i],
                            "FORMAT": "image/png"
                        }
                    })
                });
                map.addLayer(wms_layer);
                layer_Array[i] = wms_layer;

            } else {
                wms_layer = new ol.layer.Image({
                    title: layer_JSON.title[i],
                    source: new ol.source.ImageWMS({
                        url: service_JSON.url,
                        params: {
                            "LAYERS": layer_JSON.name[i],
                            "FORMAT": "image/png"
                        }
                    })
                });
                map.addLayer(wms_layer);
                layer_Array[i] = wms_layer;
            }
        }
        if (i < layer_Array.length - 1) wms_layer.setVisible(false);
    }

    //initialize map params 
    setLegendValues(layer_Array.length - 1);

    if (markers != null) {
        markers = null;
    }

    if (heatmap) { //@see heatmap.js
        addClickListener(panZoomBar.id, "T4M");
        addClickListener2(OLSwitcher, "T4M");
    }

    initLayerControlWidget();
    manageGetFeatureInfoOfAllLayersCheckBox();
}

/**
 * The method is called, if the visibility of a layer is changed.
 *
 * @param pos_Array - the position of the legend url in the array of all legends to all loaded layer
 */
function setLegendValues(pos_Array) {
    var legend_JSON;
    wmsDescription_Store.fetchItemByIdentity({
        identity: "legendParam",
        onItem: function(item, request) {
            legend_JSON = item;
        }
    });

    //Hannes 11.02.2013
    if (legend_JSON.url === null || legend_JSON.url == "" || legend_JSON.url === undefined || legend_JSON.url[pos_Array] === "null" || legend_JSON.url[pos_Array] === null || legend_JSON.url[pos_Array] === undefined) {
        hideLegend();
    } else {

        //get height, width for the legend image
        if (legend_JSON.width[pos_Array] > 170) {
            var map_width_string = dojo.byId('map').style.width.substring(0, dojo.byId('map').style.width.length - 2);
            var total_width_int = parseInt(map_width_string) + parseInt(legend_JSON.width[pos_Array]) + parseInt(50);
            var width_string = total_width_int + 'px';
        }

        //set visibility for legend image
        showLegend();

        //Hannes 20.02.2013 
        dojo.byId('legend_frame').src = legend_JSON.url[pos_Array] + "&height=" + legend_JSON.height[pos_Array] + "&width=" + legend_JSON.width[pos_Array];
    }
}

/**
 * This method hides the image frame for the legend.
 */
function hideLegend() {
    dojo.byId('legend_frame').style.visibility = 'hidden';
}

/**
 * This method shows the image frame for the legend.
 */
function showLegend() {
    dojo.byId('legend_frame').style.visibility = 'visible';
}

/**
 * This method adapts time information of OpenLayers layer param to change the map based on new chosen time stamp.
 *
 * @param date_JSDate - the time stamp choosen by the user
 */
var lastDate;

function setMapTime(date_JSDate) {
    for (var i = 0; i < layer_Array.length; i++) {
        if (combo == false) {
            var newD = cutDate(date_JSDate);
            if (newD != "0NaN-NaN" && newD != "0NaN") {
                layer_Array[i].getSource().updateParams({
                    'time': newD
                });
                lastDate = newD;
            } else {
                //CH 2013-04-09 Mozilla verschluckt sich am Datum 
                newD = cutDate(lastDate);
                layer_Array[i].getSource().updateParams({
                    'time': newD
                });
                //layer_Array[i].mergeNewParams({ 'time': date_JSDate }); 
            }
        } else {
            layer_Array[i].getSource().updateParams({
                'time': date_JSDate
            });
        }
    }
}

function updateServicesLayersConfigUserClick(layer) {
    layer.visibilityUser = layer.visibility;
}

function setEventHandlerResizeMap() {
    require(["dojo/parser", "dojo/ready", "dijit/registry", "dojo/dom", "dojo/dom-style", "dojo/aspect",
        "dijit/form/CheckBox", "dojo/cookie", "dijit/layout/BorderContainer", "dijit/layout/TabContainer", "dijit/layout/ContentPane"
    ], function(parser, ready, registry, dom, domStyle, aspect) {

        var splitter_left = registry.byId("time4mapsMap").getSplitter("left");
        var splitter_top = registry.byId("time4mapsMap_Left").getSplitter("top");
        var splitter_base = registry.byId("base_borderContainer").getSplitter("left");
        var splitter_middle = registry.byId("middle_borderContainer").getSplitter("top");
        var splitter_bottom = registry.byId("bottom_borderContainer").getSplitter("left");

        var moveHandle_left = null;
        var moveHandle_top = null;
        var moveHandle_base = null;
        var moveHandle_middle = null;
        var moveHandle_bottom = null;

        //split: list - detail
        aspect.after(splitter_bottom, "_startDrag", function() {
            moveHandle_bottom = aspect.after(splitter_left.domNode, "onmousemove", function() {
                resizeMap();
            });
        });
        aspect.after(splitter_bottom, "_stopDrag", function() {
            if (heatmap) addSplitterChange("listDetailSplitter");
            moveHandle_bottom && moveHandle_bottom.remove();
        });

        //split: map - featureInfo
        aspect.after(splitter_left, "_startDrag", function() {
            moveHandle_left = aspect.after(splitter_left.domNode, "onmousemove", function() {
                resizeMap();
            });
        });
        aspect.after(splitter_left, "_stopDrag", function() {
            if (heatmap) addSplitterChange("mapFInfoSplitter");
            moveHandle_left && moveHandle_left.remove();
        });

        //split facets - middle panel
        aspect.after(splitter_base, "_startDrag", function() {
            moveHandle_base = aspect.after(splitter_base.domNode, "onmousemove", function() {
                resizeMap();
            });
        });
        aspect.after(splitter_base, "_stopDrag", function() {
            if (heatmap) addSplitterChange("facetMiddleSplitter");
            moveHandle_base && moveHandle_base.remove();
        });

        //splitter: map - time info
        aspect.after(splitter_top, "_startDrag", function() {
            moveHandle_top = aspect.after(splitter_top.domNode, "onmousemove", function() {
                resizeMap();
            });
        });
        aspect.after(splitter_top, "_stopDrag", function() {
            if (heatmap) addSplitterChange("mapTimeSplitter");
            moveHandle_top && moveHandle_top.remove();
        });

        //splitter: details/result list - map
        aspect.after(splitter_middle, "_startDrag", function() {
            moveHandle_middle = aspect.after(splitter_middle.domNode, "onmousemove", function() {
                resizeMap();
            });
        });
        aspect.after(splitter_middle, "_stopDrag", function() {
            if (heatmap) addSplitterChange("mapListDetailSplitter");
            moveHandle_middle && moveHandle_middle.remove();
        });
    });
}

function resizeMap() {
    if (map) {
        map.updateSize();

        //defined in feature_info_setting_dynamic.js  

        map_height = map.getSize()[0];
        map_width = map.getSize()[1];
    }
    if (map2) {
        map2.updateSize();
    }

}

function manageGetFeatureInfoOfAllLayersCheckBox() {
    require(["dojo/dom-style", "dijit/registry"], function(domStyle, reg) {
        if (map.getLayers().array_.length > 2) {
            domStyle.set("cp_FeatureInfoAllLayerCheckbox", "display", "block");
            domStyle.set("cp_layerSwitcher", "height", "20%");
            domStyle.set("cp_legendFrame", "height", "30%");
            domStyle.set("cp_FeatureInfoAllLayerCheckbox", "height", "10%");
            domStyle.set("cp_finfo", "height", "40%");
            reg.byId("bc_t4m_right").resize();
        } else {
            domStyle.set("cp_FeatureInfoAllLayerCheckbox", "display", "none");
            domStyle.set("cp_layerSwitcher", "height", "20%");
            domStyle.set("cp_legendFrame", "height", "40%");
            domStyle.set("cp_finfo", "height", "40%");
            reg.byId("bc_t4m_right").resize();
        }
    });
}