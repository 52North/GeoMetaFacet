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
 * This javascript file generates a layer switcher control
 *
 * @author Hannes Tressel. Professorship of Geoinformation Systems
 */
function initLayerControlWidget() {
    require(["dojo/dom-construct", "dijit/form/HorizontalSlider", "dojo/dom-attr", "dojo/dom", "dijit/registry", "dojo/query"], function(domConstruct, HzSlider, domAttr, dom, registry, query) {
        var checkedAll = false;
        map.getLayers().forEach(function(layer, index) {
            if (layer instanceof ol.layer.Image) {
                domConstruct.destroy(layer.getProperties().title + "_checkbox");
                domConstruct.place(domConstruct.create("div", {
                    id: layer.getProperties().title + "_area",
                    style: {
                        display: "block",
                        position: "relative",
                        top: "20px",
                        left: "5px",
                        width: "90%",
                        marginBottom: "10px"
                    }
                }), "layerSwitcherCustom", "first");

                domConstruct.create("div", {
                    id: layer.getProperties().title,
                    innerHTML: layer.getProperties().title,
                    style: {
                        display: "block",
                        width: "90%",
                        marginTop: "0px",
                        font: "bold 11px sans-serif",
                        color: "#333"
                    }
                }, layer.getProperties().title + "_area");

                domConstruct.create("input", {
                    id: layer.getProperties().title + "_checkbox",
                    type: "checkbox",
                    name: "visibility",
                    checked: layer.getVisible(),
                    index_: index,
                    style: {
                        position: "relative",
                        top: "5px",
                        marginTop: "1px",
                        marginLeft: "0px"
                    },
                    onclick: function() {
                        if (this.checked) {
                            layer.setVisible(true);
                        } else {
                            layer.setVisible(false);
                        }
                        updateLegend();
                        updateTimeValues();
                        updateFeatureInfo();
                        //change LAyerLegend

                    }
                }, layer.getProperties().title + "_area");

                domConstruct.create("img", {
                    src: "images/icons/layerswitcher/moveup.png",
                    style: {
                        position: "relative",
                        top: "5px",
                        left: "4px"
                    },
                    onclick: function() {
                        map.getLayers().removeAt(index);
                        map.getLayers().insertAt(index + 1, layer);
                        updateLayerControlWidget();
                    }
                }, layer.getProperties().title + "_area");

                domConstruct.create("img", {
                    src: "images/icons/layerswitcher/movedown.png",
                    style: {
                        position: "relative",
                        top: "5px",
                        left: "15px"
                    },
                    onclick: function() {
                        map.getLayers().removeAt(index);
                        map.getLayers().insertAt(index - 1, layer);
                        updateLayerControlWidget();
                    }
                }, layer.getProperties().title + "_area");

                domConstruct.create("div", {
                    id: layer.getProperties().title + "_slider"
                }, layer.getProperties().title + "_area");

                if (registry.byId(layer.getProperties().title + "_slider") != undefined) {
                    registry.byId(layer.getProperties().title + "_slider").destroyRecursive();
                }

                new HzSlider({
                    minimum: 0,
                    maximum: 10,
                    value: 10,
                    intermediateChanges: true,
                    style: {
                        "position": "relative",
                        "top": "-11px",
                        "left": "50px",
                        "width": "110px"
                    },
                    onChange: function(value) {
                        layer.setOpacity(value / 10);
                    }

                }, layer.getProperties().title + "_slider");
            }

        });

        domConstruct.create("input", {
            type: "button",
            value: "Select All/None",
            style: {
                position: "relative",
                bottom: "-22px",
                left: "27px"
            },
            onclick: function() {
                query("#layerSwitcherCustom input[type='checkbox']").forEach(function(widget) {
                    (!checkedAll) ? (widget.checked = true) : (widget.checked = false);
                });

                if (checkedAll) {
                    map.getLayers().forEach(function(layer) {
                        if (layer instanceof ol.layer.Image) {
                            layer.setVisible(false);
                        }
                    });
                    checkedAll = false
                } else {
                    map.getLayers().forEach(function(layer) {
                        (layer instanceof ol.layer.Image) ? (layer.setVisible(true)) : (layer.setVisible(true));
                    });
                    checkedAll = true
                }

                updateLegend();
                updateTimeValues();
                updateFeatureInfo();
            }

        }, "layerSwitcherCustom");
    });
}

function updateLayerControlWidget() {
    require(["dojo/dom-construct", "dojo/query"], function(domConstruct, query) {
        query("#layerSwitcherCustom *").forEach(function(node) {
            domConstruct.destroy(node);
        });
        initLayerControlWidget();
        updateLegend();
        updateTimeValues();
        updateFeatureInfo();

    });
}

function updateLegend() {
    require(["dojo/dom", "dojo/query"], function(dom, query) {
        for (var i = map.getLayers().array_.length - 1; i > 0; i--) {
            if (dom.byId(map.getLayers().array_[i].getProperties().title + "_checkbox").checked) {
                setLegendValues(i - 1);
                vis_layer_number = i - 1;
                break;
            }
        }
    });
}

function updateFeatureInfo() {
    require(["dojo/dom-attr", "dojo/io-query", "dijit/registry", "dojo/dom", "dojo/query", "dojo/request/iframe", "dojo/dom-construct"], function(domAttr, ioQuery, registry, dom, query, iframe, domConstruct) {

        if (last_event != null) {
            manageFeatureInfoWindow();
            var layer_JSON;
            wmsDescription_Store.fetchItemByIdentity({
                identity: "layerDescriptionParam",
                onItem: function(item, request) {
                    layer_JSON = item;
                }
            });

            var layer = null;
            var visible = false;

            if (domAttr.get("featureInfoAllLayer", "checked")) {
                for (var i = map.getLayers().array_.length - 1; i > 0; i--) {
                    layer = map.getLayers().array_[i];
                    if (layer.getVisible()) {
                        visible = true;
                        var source = featureInfoUrl;
                        if (source != null) {
                            var sourceObject = ioQuery.queryToObject(source);
                            var url = null;
                            if (hasTimeData) {
                                $.ajax({
                                    "url": 'FeatureInfoRequester',
                                    "type": 'GET',
                                    "data": {
                                        "url": service_url + "?request=GetFeatureInfo&service=WMS",
                                        "version": sourceObject.VERSION,
                                        "query_layers": layer.getSource().getParams().LAYERS,
                                        "crs": (sourceObject.VERSION === "1.3.0") ? (sourceObject.CRS) : (sourceObject.SRS),
                                        "bbox": sourceObject.BBOX,
                                        "width": sourceObject.WIDTH,
                                        "height": sourceObject.HEIGHT,
                                        "I": (sourceObject.VERSION === "1.3.0") ? (sourceObject.I) : (sourceObject.X),
                                        "J": (sourceObject.VERSION === "1.3.0") ? (sourceObject.J) : (sourceObject.Y),
                                        "time": sourceObject.time,
                                    },
                                    "success": function(data, status) {
                                        domConstruct.create("div", {
                                            id: "featureInfo_multi",
                                            innerHTML: data,
                                            style: {
                                                "display": "inline-block",
                                                "margin": "0 5px 10px 0px"
                                            }
                                        }, "featureinfo");

                                    }
                                });
                            } else {
                                $.ajax({
                                    "url": 'FeatureInfoRequester',
                                    "type": 'GET',
                                    "data": {
                                        "url": service_url + "?request=GetFeatureInfo&service=WMS",
                                        "version": sourceObject.VERSION,
                                        "query_layers": layer.getSource().getParams().LAYERS,
                                        "crs": (sourceObject.VERSION === "1.3.0") ? (sourceObject.CRS) : (sourceObject.SRS),
                                        "bbox": sourceObject.BBOX,
                                        "width": sourceObject.WIDTH,
                                        "height": sourceObject.HEIGHT,
                                        "I": (sourceObject.VERSION === "1.3.0") ? (sourceObject.I) : (sourceObject.X),
                                        "J": (sourceObject.VERSION === "1.3.0") ? (sourceObject.J) : (sourceObject.Y),
                                        "time": "x",
                                    },
                                    "success": function(data, status) {
                                        domConstruct.create("div", {
                                            id: "featureInfo_multi",
                                            innerHTML: data,
                                            style: {
                                                "display": "inline-block",
                                                "margin": "0 5px 10px 0px"
                                            }
                                        }, "featureinfo");

                                    }
                                });
                            }
                        }
                    }
                }

                if (!visible) {
                    query("#featureinfo > div").forEach(domConstruct.destroy);
                    domConstruct.create("div", {
                        id: "featureInfo_multi",
                        innerHTML: "Click on the map to get feature information.",
                        style: {
                            "display": "inline-block",
                            "margin": "0 5px 10px 0px"
                        }
                    }, "featureinfo");

                    map.getOverlays().forEach(function(overlay) {
                        map.removeOverlay(overlay);
                    });
                    last_event = null;
                    source = null;
                }


            } else {
                for (var i = map.getLayers().array_.length - 1; i > 0; i--) {
                    layer = map.getLayers().array_[i];
                    if (layer.getVisible()) {
                        visible = true;
                        var source = featureInfoUrl;
                        if (typeof source != null) {
                            var sourceObject = ioQuery.queryToObject(source);
                            var url = null;
                            if (hasTimeData) {
                                $.ajax({
                                    "url": 'FeatureInfoRequester',
                                    "type": 'GET',
                                    "data": {
                                        "url": service_url + "?request=GetFeatureInfo&service=WMS",
                                        "version": sourceObject.VERSION,
                                        "query_layers": layer.getSource().getParams().LAYERS,
                                        "crs": (sourceObject.VERSION === "1.3.0") ? (sourceObject.CRS) : (sourceObject.SRS),
                                        "bbox": sourceObject.BBOX,
                                        "width": sourceObject.WIDTH,
                                        "height": sourceObject.HEIGHT,
                                        "I": (sourceObject.VERSION === "1.3.0") ? (sourceObject.I) : (sourceObject.X),
                                        "J": (sourceObject.VERSION === "1.3.0") ? (sourceObject.J) : (sourceObject.Y),
                                        "time": sourceObject.time,
                                    },
                                    "success": function(data, status) {
                                        domAttr.set('feature_label', "innerHTML", data);
                                        if (domAttr.get('feature_label', "innerHTML") == "") {
                                            domAttr.set('feature_label', "innerHTML", "Click on the map to get feature information.");
                                        }
                                    }
                                });
                            } else {
                                $.ajax({
                                    "url": 'FeatureInfoRequester',
                                    "type": 'GET',
                                    "data": {
                                        "url": service_url + "?request=GetFeatureInfo&service=WMS",
                                        "version": sourceObject.VERSION,
                                        "query_layers": layer.getSource().getParams().LAYERS,
                                        "crs": (sourceObject.VERSION === "1.3.0") ? (sourceObject.CRS) : (sourceObject.SRS),
                                        "bbox": sourceObject.BBOX,
                                        "width": sourceObject.WIDTH,
                                        "height": sourceObject.HEIGHT,
                                        "I": (sourceObject.VERSION === "1.3.0") ? (sourceObject.I) : (sourceObject.X),
                                        "J": (sourceObject.VERSION === "1.3.0") ? (sourceObject.J) : (sourceObject.Y),
                                        "time": "x",
                                    },
                                    "success": function(data, status) {
                                        domAttr.set('feature_label', "innerHTML", data);
                                        if (domAttr.get('feature_label', "innerHTML") == "") {
                                            domAttr.set('feature_label', "innerHTML", "Click on the map to get feature information.");
                                        }
                                    }
                                });
                            }
                        }
                        break;
                    }
                }

                if (!visible) {
                    //Click on the map to get feature information.
                    domAttr.set('feature_label', "innerHTML", "Click on the map to get feature information.");
                    map.getOverlays().forEach(function(overlay) {
                        map.removeOverlay(overlay);
                    });
                    last_event = null;
                    source = null;
                }
            }
        }
    });
}