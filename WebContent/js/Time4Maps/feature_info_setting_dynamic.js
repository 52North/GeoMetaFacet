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

var markers;
var service_url, service_version, service_srs;
var featureInfoUrl;

var map_width = 990;
var map_height = 660;

/**
 * This method is used to register an event listener that sets the marker on the map, when the user has clicked into the map.
 * Further, the feature info response is initialized and embedded.
 *
 * @param time_info - string param that is set to "time", if the service is time enabled and empty if not.
 */
var infoControls;

function bindFeatureControls(time_info) {
    //getting general information of web service
    var service_JSON;
    wmsDescription_Store.fetchItemByIdentity({
        identity: "serviceDescriptionParam",
        onItem: function(item, request) {
            service_JSON = item;
        }
    });
    service_url = wmsDescription_Store.getValue(service_JSON, "url");
    service_version = wmsDescription_Store.getValue(service_JSON, "version");
    service_srs = wmsDescription_Store.getValue(service_JSON, "srs");

    map.on("singleclick", function(evt) {
        grabFeatureInfo(evt);
    });



    /*
    map.on("singleclick", function(evt) {
        require(["dojo/dom-attr", "dojo/request/xhr", "dojo/io-query", "dojo/dom"], function(domAttr, xhr, ioQuery, dom) {
            for (var i = map.getLayers().array_.length - 1; i > 0; i--) {
                var layer = map.getLayers().array_[i];
                if (domAttr.get(map.getLayers().array_[i].getProperties().title + "_checkbox", "checked")) {
                    last_event = evt.coordinate;
                    var resolution = map.getView().getResolution();
                    var projection = map.getView().getProjection();
                    var source = layer.getSource().getGetFeatureInfoUrl(evt.coordinate, resolution, projection, {
                        "INFO_FORMAT": "text/html",
                    });
                    featureInfoUrl = source;

                    if (typeof source != null) {
                        var sourceObject = ioQuery.queryToObject(source);
                        if (time_info === "time") {
                            $.ajax({
                                "url": 'FeatureInfoRequester',
                                "type": 'GET',
                                "data": {
                                    "url": service_url + "?request=GetFeatureInfo&service=WMS",
                                    "version": sourceObject.VERSION,
                                    "query_layers": sourceObject.QUERY_LAYERS,
                                    "crs": (sourceObject.VERSION === "1.3.0") ? (sourceObject.CRS) : (sourceObject.SRS),
                                    "bbox": sourceObject.BBOX,
                                    "width": sourceObject.WIDTH,
                                    "height": sourceObject.HEIGHT,
                                    "I": (sourceObject.VERSION === "1.3.0") ? (sourceObject.I) : (sourceObject.X),
                                    "J": (sourceObject.VERSION === "1.3.0") ? (sourceObject.J) : (sourceObject.Y),
                                    "time": sourceObject.time,
                                },
                                "success": function(data, status) {
                                    if (dom.byId("feature_label")) {
                                        domAttr.set('feature_label', "innerHTML", data);
                                        if (domAttr.get('feature_label', "innerHTML") == "") {
                                            domAttr.set('feature_label', "innerHTML", "Click on the map to get feature information.");
                                        }
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
                                    "query_layers": sourceObject.QUERY_LAYERS,
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
                                },
                                "error": function(error) {
                                    console.log(error);
                                }
                            });
                        }
                    } else {
                        domAttr.set("feature_label", "innerHTML", "Click on the map to get feature information.");
                    }

                   
                    map.getOverlays().forEach(function(overlay) {
                        map.removeOverlay(overlay);
                    });

                   
                    var overlayElement = null;
                    require(["dojo/dom-construct", "dojo/query"], function(domConstruct, domStyle) {
                        overlayElement = domConstruct.create("img", {
                            src: 'js/ol3/resources/marker-blue.png',
                            style: {
                                position: "absolute",
                                top: "-25px",
                                left: "-10.5px",
                                color: "darkslateblue"
                            }
                        });
                    });

                    
                    var overlay = new ol.Overlay({
                        position: evt.coordinate,
                        element: overlayElement
                    });

                    map.addOverlay(overlay);
                    break;
                }
            }
        });
    }); */
}

function grabFeatureInfo(evt) {
    require(["dojo/dom-attr", "dojo/io-query", "dojo/dom-construct", "dojo/query", "dojo/dom"], function(domAttr, ioQuery, domConstruct, query, dom) {
        if (domAttr.get("featureInfoAllLayer", "checked")) {
            manageFeatureInfoWindow();
            for (var i = map.getLayers().array_.length - 1; i > 0; i--) {
                var layer = map.getLayers().array_[i];
                if (layer.getVisible()) {
                    last_event = evt.coordinate;
                    var resolution = map.getView().getResolution();
                    var projection = map.getView().getProjection();
                    var source = layer.getSource().getGetFeatureInfoUrl(evt.coordinate, resolution, projection, {
                        "INFO_FORMAT": "text/html",
                    });
                    featureInfoUrl = source;

                    if (typeof source != null) {
                        var sourceObject = ioQuery.queryToObject(source);
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

            map.getOverlays().forEach(function(overlay) {
                map.removeOverlay(overlay);
            });

            var overlayElement = null;
            require(["dojo/dom-construct", "dojo/query"], function(domConstruct, domStyle) {
                overlayElement = domConstruct.create("img", {
                    src: 'js/ol3/resources/marker-blue.png',
                    style: {
                        position: "absolute",
                        top: "-25px",
                        left: "-10.5px",
                        color: "darkslateblue"
                    }
                });
            });

            /* create overlay */
            var overlay = new ol.Overlay({
                position: evt.coordinate,
                element: overlayElement
            });

            map.addOverlay(overlay);

        } else {
            manageFeatureInfoWindow();
            for (var i = map.getLayers().array_.length - 1; i > 0; i--) {
                layer = map.getLayers().array_[i];
                if (layer.getVisible()) {
                    last_event = evt.coordinate;
                    var resolution = map.getView().getResolution();
                    var projection = map.getView().getProjection();
                    var source = layer.getSource().getGetFeatureInfoUrl(evt.coordinate, resolution, projection, {
                        "INFO_FORMAT": "text/html",
                    });
                    featureInfoUrl = source;
                    if (typeof source != null) {
                        var sourceObject = ioQuery.queryToObject(source);
                        if (hasTimeData) {
                            $.ajax({
                                "url": 'FeatureInfoRequester',
                                "type": 'GET',
                                "data": {
                                    "url": service_url + "?request=GetFeatureInfo&service=WMS",
                                    "version": sourceObject.VERSION,
                                    "query_layers": sourceObject.QUERY_LAYERS,
                                    "crs": (sourceObject.VERSION === "1.3.0") ? (sourceObject.CRS) : (sourceObject.SRS),
                                    "bbox": sourceObject.BBOX,
                                    "width": sourceObject.WIDTH,
                                    "height": sourceObject.HEIGHT,
                                    "I": (sourceObject.VERSION === "1.3.0") ? (sourceObject.I) : (sourceObject.X),
                                    "J": (sourceObject.VERSION === "1.3.0") ? (sourceObject.J) : (sourceObject.Y),
                                    "time": sourceObject.time,
                                },
                                "success": function(data, status) {
                                    if (dom.byId("feature_label")) {
                                        domAttr.set('feature_label', "innerHTML", data);
                                        if (domAttr.get('feature_label', "innerHTML") == "") {
                                            domAttr.set('feature_label', "innerHTML", "Click on the map to get feature information.");
                                        }
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
                                    "query_layers": sourceObject.QUERY_LAYERS,
                                    "crs": (sourceObject.VERSION === "1.3.0") ? (sourceObject.CRS) : (sourceObject.SRS),
                                    "bbox": sourceObject.BBOX,
                                    "width": sourceObject.WIDTH,
                                    "height": sourceObject.HEIGHT,
                                    "I": (sourceObject.VERSION === "1.3.0") ? (sourceObject.I) : (sourceObject.X),
                                    "J": (sourceObject.VERSION === "1.3.0") ? (sourceObject.J) : (sourceObject.Y),
                                    "time": "x",
                                },
                                "success": function(data, status) {
                                    if (dom.byId("feature_label")) {
                                        domAttr.set('feature_label', "innerHTML", data);
                                        if (domAttr.get('feature_label', "innerHTML") == "") {
                                            domAttr.set('feature_label', "innerHTML", "Click on the map to get feature information.");
                                        }
                                    }
                                }
                            });
                        }
                    }

                    map.getOverlays().forEach(function(overlay) {
                        map.removeOverlay(overlay);
                    });

                    /* create overlay image */
                    var overlayElement = null;
                    require(["dojo/dom-construct", "dojo/query"], function(domConstruct, domStyle) {
                        overlayElement = domConstruct.create("img", {
                            src: 'js/ol3/resources/marker-blue.png',
                            style: {
                                position: "absolute",
                                top: "-25px",
                                left: "-10.5px",
                                color: "darkslateblue"
                            }
                        });
                    });

                    /* create overlay */
                    var overlay = new ol.Overlay({
                        position: evt.coordinate,
                        element: overlayElement
                    });

                    map.addOverlay(overlay);
                    break;
                }
            }
        }
    });
}

function manageFeatureInfoWindow() {
    require(["dojo/dom-attr", "dojo/dom-style", "dojo/dom-construct", "dojo/query"], function(domAttr, domStyle, domConstruct, query) {
        if (domAttr.get("featureInfoAllLayer", "checked")) {
            query("#featureinfo > div").forEach(domConstruct.destroy);
            domStyle.set("feature_label", "display", "none");
            domStyle.set("featureinfo", "overflow", "auto");

        } else {
            query("#featureinfo > div").forEach(domConstruct.destroy);
            domStyle.set("featureinfo", "overflow", "auto");
            domStyle.set("feature_label", "display", "block");

        }
    });
}