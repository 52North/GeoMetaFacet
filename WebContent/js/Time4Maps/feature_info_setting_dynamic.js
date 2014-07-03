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
        last_event = evt.coordinate;
        map.getLayers().forEach(function(layer) {
            if (layer.getProperties().title === layer_Array[vis_layer_number].getProperties().title) {
                var resolution = map.getView().getResolution();
                var projection = map.getView().getProjection();
                var source = layer.getSource().getGetFeatureInfoUrl(evt.coordinate, resolution, projection, {
                    "INFO_FORMAT": "text/html",
                });
                featureInfoUrl = source;

                if (typeof source != null) {
                    require(["dojo/dom-attr", "dojo/request/xhr", "dojo/io-query"], function(domAttr, xhr, ioQuery) {
                        var sourceObject = ioQuery.queryToObject(source);
                        if (time_info === "time") {
                            $.ajax({
                                "url": 'FeatureInfoRequester',
                                "type": 'GET',
                                "data": {
                                    "url": service_url + "?request=GetFeatureInfo&service=WMS",
                                    "version": sourceObject.VERSION,
                                    "query_layers": sourceObject.QUERY_LAYERS,
                                    "crs": sourceObject.SRS,
                                    "bbox": sourceObject.BBOX,
                                    "width": sourceObject.WIDTH,
                                    "height": sourceObject.HEIGHT,
                                    "I": sourceObject.X,
                                    "J": sourceObject.Y,
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
                                    "query_layers": sourceObject.QUERY_LAYERS,
                                    "crs": (typeof sourceObject.CRS != "undefined" ? sourceObject.CRS : sourceObject.SRS),
                                    "bbox": sourceObject.BBOX,
                                    "width": sourceObject.WIDTH,
                                    "height": sourceObject.HEIGHT,
                                    "I": (typeof sourceObject.X != "undefined" ? sourceObject.X : sourceObject.I),
                                    "J": (typeof sourceObject.Y != "undefined" ? sourceObject.Y : sourceObject.J),
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
                    });

                } else {
                    require(["dojo/dom-attr"], function(domAttr) {
                        domAttr.set("feature_label", "innerHTML", "Click on the map to get feature information.");
                    });
                }

                /* remove existant Overlays */
                map.getOverlays().forEach(function(overlay) {
                    map.removeOverlay(overlay);
                });

                /*create overlay image*/
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
            }
        });
    });
}