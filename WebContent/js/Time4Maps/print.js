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
 * This javascript file contains source code for printing functions.
 *
 * @author Hannes Tressel. Professorship of Geoinformation Systems
 */

var ui = {
    mapWidth: 0,
    mapHeight: 0,
    map2_: false,
    legendWidth: 0,
    legendHeight: 0
}

var service_JSON = null;
var layer_JSON = null;
var service_JSON2 = null;
var layer_JSON2 = null;

function openPrintPreview() {
    require(["dojo/_base/window", "dojo/dom-construct", "dojox/gfx", "dojo/io-query", "dojo/dom-style", "dojo/dom", "dojo/query"], function(win, domConstruct, gfx, ioQuery, domStyle, dom, query) {
        var pWindowSettings = "width=" + window.screen.width / 1.3 + ", height=" + window.screen.height / 1.3 + ", scrollbars=yes";
        var pWindow = window.open("", "", pWindowSettings);
        var windowWidth = window.screen.width / 1.3;
        var map2_ = false;
        if (dom.byId("map2") != null) {
            ui.map2_ = true;
        }

        if (!ui.map2_) {
            var featureInfo = dom.byId("feature_label").innerHTML;
        } else {
            var featureInfo1 = dom.byId("featureInfo_frame1").contentDocument.body.innerHTML;
            var featureInfo2 = dom.byId("featureInfo_frame2").contentDocument.body.innerHTML;
            var featureInfo_label1 = null;
            var featureInfo_label2 = null;

            query("#feature_label", dom.byId("featureInfo_frame1").contentDocument.body).forEach(function(node) {
                featureInfo_label1 = query("div:first-of-type", node).forEach(function(node_) {
                    return node_.innerHTML;
                })[0].innerHTML;
            });

            query("#feature_label", dom.byId("featureInfo_frame2").contentDocument.body).forEach(function(node) {
                featureInfo_label2 = query("div:first-of-type", node).forEach(function(node_) {
                    return node_.innerHTML;
                })[0].innerHTML;
            });
        }

        var service_JSON = null;
        wmsDescription_Store.fetchItemByIdentity({
            identity: "serviceDescriptionParam",
            onItem: function(item, request) {
                service_JSON = item;
            }
        });

        /* catch legendImage before change context */
        var legendImage = {
            src: dom.byId("legend_frame").src,
            width: domStyle.get("legend_frame", "width"),
            height: domStyle.get("legend_frame", "height")
        };

        if (map2_) {
            var legendImage2 = {
                src: dom.byId("legend_frame2").src,
                width: domStyle.get("legend_frame2", "width"),
                height: domStyle.get("legend_frame2", "height")
            };
        }

        pWindow.onunload = function() {
            win.setContext(window, window.document);
        };

        /*focus popup*/
        win.setContext(pWindow, pWindow.document);
        domStyle.set(win.body(), "width", "99%");
        var bodyWidth = windowWidth * 0.99;

        domConstruct.create("div", {
            id: "wrapper",
            style: {
                "position": "relative",
                "width": "90%",
                "marginLeft": "auto",
                "marginRight": "auto"
            }
        }, win.body());
        var wrapperWidth = bodyWidth * 0.90;

        domConstruct.create("section", {
            id: "headings",
            style: {
                "marginTop": " 10px"
            }
        }, "wrapper");

        domConstruct.create("h1", {
            innerHTML: "Name of this service: " + service_JSON.title[0],
            style: {
                fontFamiliy: "'Myriad Pro','Helvetica Neue',Helvetica,Arial,Sans-Serif",
                textShadow: "0px 1px 1px silver"
            }
        }, "headings");

        domConstruct.create("h3", {
            innerHTML: "Abstract of this service: " + service_JSON.abstractText[0],
            style: {
                fontFamiliy: "'Myriad Pro','Helvetica Neue',Helvetica,Arial,Sans-Serif",
                textShadow: "0px 1px 1px silver"
            }
        }, "headings");

        domConstruct.create("section", {
            id: "MapAndLegend1",
            style: {
                "marginTop": " 10px"
            }
        }, "wrapper");

        domConstruct.create("div", {
            id: "map1",
            style: {
                "display": "inline-flex",
                "width": "70%",
                "height": "400px"
            }
        }, "MapAndLegend1");

        domConstruct.create("div", {
            id: "legend1",
            style: {
                "display": " inline-block",
                "width": "20%",
                "height": "400px",
                "marginLeft": "10px"
            }
        }, "MapAndLegend1");

        if (ui.map2_) {

            domConstruct.create("section", {
                id: "MapAndLegend2",
                style: {
                    "marginTop": " 1px"
                }
            }, "wrapper");

            domConstruct.create("div", {
                id: "map2",
                style: {
                    "display": "inline-flex",
                    "width": "70%",
                    "height": "400px"
                }
            }, "MapAndLegend2");

            domConstruct.create("div", {
                id: "legend2",
                style: {
                    "display": " inline-block",
                    "width": "20%",
                    "height": "400px",
                    "marginLeft": "10px"
                }
            }, "MapAndLegend2");
        }

        domConstruct.create("section", {
            id: "featureInfo",
            style: {
                "marginTop": "10px"
            }
        }, "wrapper");

        if (!ui.map2_) {
            if (featureInfo != "Click on the map to get feature information.") {
                domConstruct.create("h3", {
                    id: "featureInfoLabel",
                    innerHTML: "Feature Information",
                    style: {

                    }
                }, "featureInfo");

                domConstruct.create("article", {
                    id: "fi1",
                    innerHTML: featureInfo,
                    style: {
                        "display": "inline-block",
                        "maxWidth": "99%"
                    }
                }, "featureInfo");
            }
        } else {
            if (featureInfo_label1 != "Click on the map to get feature information." && featureInfo_label2 != "Click on the map to get feature information.") {

                domConstruct.create("h3", {
                    id: "featureInfoLabel",
                    innerHTML: "Feature Information",
                    style: {

                    }
                }, "featureInfo");

                domConstruct.create("article", {
                    id: "fi1",
                    innerHTML: featureInfo1,
                    style: {
                        "display": "inline-block",
                        "maxWidth": "45%",
                        "marginRight": "4%"
                    }
                }, "featureInfo");

                domConstruct.create("article", {
                    id: "fi2",
                    innerHTML: featureInfo2,
                    style: {
                        "display": "inline-block",
                        "maxWidth": "45%"
                    }
                }, "featureInfo");
            }
        }

        domConstruct.create("section", {
            id: "BtnArea",
            style: {
                "marginTop": "10px"
            }
        }, "wrapper");

        domConstruct.create("input", {
            type: "button",
            value: "Print",
            style: {
                width: "100px",
                height: "25px",
                "marginLeft": "30px"
            },
            onclick: function() {
                pWindow.print();
            }
        }, "BtnArea");

        domConstruct.create("input", {
            type: "button",
            value: "Cancel",
            style: {
                width: "100px",
                height: "25px",
                "marginLeft": "30px"
            },
            onclick: function() {
                pWindow.close();
            }
        }, "BtnArea");

        ui.mapWidth = wrapperWidth * 0.70;
        ui.mapHeight = 400;
        ui.legendWidth = wrapperWidth * 0.20;
        ui.legendHeight = 400;

        var layers = "";
        var time = null;
        map.getLayers().forEach(function(layer){
        	if (layer instanceof ol.layer.Image && layer.getVisible()){
        		layers += layer.getSource().getParams().LAYERS + ",";
                (layer.getSource().getParams().time != undefined)?(time=layer.getSource().getParams().time):(time="x");
            }
        	
        });
        //entferne ','
        layers = layers.slice(0, layers.length - 1);
      
        if (layers.length > 0) {
            mapSurface = gfx.createSurface("map1", ui.mapWidth, ui.mapHeight);
            mapSurface.createImage({
                x: 0,
                y: 0,
                width: ui.mapWidth + "px",
                height: ui.mapHeight + "px",
                src: getMapImage({
                    url: service_JSON.url[0],
                    version: service_JSON.version[0],
                    srs: service_JSON.srs[0],
                    format: service_JSON.format[0],
                    layers: layers,
                    time: time
                }, map)
            });
        }


        if (ui.map2_) {
            var layers2 = "";
            time = null;
            map2.getLayers().forEach(function(layer){
            	if (layer instanceof ol.layer.Image && layer.getVisible()){
            		layers2 += layer.getSource().getParams().LAYERS + ",";
                    (layer.getSource().getParams().time != undefined)?(time=layer.getSource().getParams().time):(time="x");
            	}
            });
            layers2 = layers2.slice(0, layers2.length - 1);
            if (layers2.length > 0) {
                mapSurface2 = gfx.createSurface("map2", ui.mapWidth, ui.mapHeight);
                mapSurface2.createImage({
                    x: 0,
                    y: 0,
                    width: ui.mapWidth + "px",
                    height: ui.mapHeight + "px",
                    src: getMapImage({
                        url: service_JSON2.url[0],
                        version: service_JSON2.version[0],
                        srs: service_JSON2.srs[0],
                        format: service_JSON2.format[0],
                        layers: layers2,
                        time: time
                    }, map2)
                });
            }
        }


        layers = "";
        for (var i = map.getLayers().array_.length - 1; i > 0; i--) {
            var layer = map.getLayers().array_[i];
            if (layer.getVisible()) {
                layers = layer.getSource().getParams().LAYERS;
                break;
            }
        }

        if (layers.length > 0) {
            var legendSurface = gfx.createSurface("legend1", ui.legendWidth, ui.legendHeight);
            var img = new Image();
            img.src = getLegendImage({
                url: service_JSON.url[0],
                version: service_JSON.version[0],
                format: service_JSON.format[0],
                layers: layers
            });
            img.onload = function() {
                legendSurface.createImage({
                    x: 0,
                    y: 0,
                    width: (this.width < ui.legendWidth) ? (this.width) : (this.width / (this.width / ui.legendWidth)),
                    height: (this.height < ui.legendHeight) ? (this.height) : (this.height / (this.height / ui.legendHeight)),
                    src: this.src
                });
            }
        }


        if (ui.map2_) {

            layers2 = "";
            for (var i = map2.getLayers().array_.length - 1; i > 0; i--) {
                var layer = map2.getLayers().array_[i];
                if (layer instanceof ol.layer.Image && layer.getVisible()) {
                    layers2 = layer.getSource().getParams().LAYERS;
                    break;
                }
            }

            if (layers2.length > 0) {
                var legendSurface2 = gfx.createSurface("legend2", ui.legendWidth, ui.legendHeight);
                var img2 = new Image();
                img2.src = getLegendImage({
                    url: service_JSON2.url[0],
                    version: service_JSON2.version[0],
                    format: service_JSON2.format[0],
                    layers: layers2
                });

                img2.onload = function() {
                    legendSurface2.createImage({
                        x: 0,
                        y: 0,
                        width: (this.width < ui.legendWidth) ? (this.width) : (this.width / (this.width / ui.legendWidth)),
                        height: (this.height < ui.legendHeight) ? (this.height) : (this.height / (this.height / ui.legendHeight)),
                        src: this.src
                    });
                }
            }
        }

        var pos = null;
        var markerImg = null;
        map.getOverlays().forEach(function(marker) {
            pos = getMarkerPosition(map);
            markerImg = marker.values_.element.src
            mapSurface.createImage({
                x: pos.x,
                y: pos.y,
                width: 16,
                height: 16,
                src: markerImg
            });
        });

        if (ui.map2_) {
            var pos2 = null;
            var markerImg2 = null;
            map2.getOverlays().forEach(function(marker) {
                pos2 = getMarkerPosition(map2);
                markerImg2 = marker.values_.element.src
                mapSurface2.createImage({
                    x: pos.x,
                    y: pos.y,
                    width: 16,
                    height: 16,
                    src: markerImg2
                });
            });
        }


    });

}

function getMarkerPosition(map) {
    var x = 0;
    var y = 0;
    var mapCenter = map.getView().getCenter();
    map.getOverlays().forEach(function(marker) {
        map.getView().setCenter(marker.getPosition());
        /* 
            berechneter Extent der Karte anhand der Ausdehnung des Div Elementes in dem
            diese Platziert wird
        */
        var extent = map.getView().calculateExtent([ui.mapWidth, ui.mapHeight]);
        /*
            Marker X und Y Koordinate (EPSG:4326) auf der Karte
        */
        var markerX = marker.getPosition()[0];
        var markerY = marker.getPosition()[1];
        /*
            crsWidth entspricht Breite des Intervalls extent[0] - extent[2]
            crsHeight entspricht Höhe des Intervalls extent[1] - extent[3]
        */
        var crsWidth = null;
        var crsHeight = null;
        /*
            imgX entspricht der Marker x Position auf dem Druckbild in Pixelkoordinaten
            imgY entspricht der Marker y Position auf dem Druckbild in Pixelkoordinaten
        */
        var imgX = null;
        var imgY = null;

        /*
            Berechnungen der Intervalle -> Kartenbreite und Kartenhöhe in Pixel anhand gegebenen Extents
        */
        if (extent[0] > 0 && extent[2] > 0) {
            (extent[0] > extent[2]) ? (crsWidth = extent[0] - extent[2]) : (crsWidth = extent[2] - extent[0]);
        } else if (extent[0] < 0 && extent[2] < 0) {
            (extent[0] > extent[2]) ? (crsWidth = Math.abs(extent[2] - extent[0])) : (crsWidth = Math.abs(extent[0] - extent[2]));
        } else {
            crsWidth = Math.abs(extent[0]) + Math.abs(extent[2]);
        }

        if (extent[1] > 0 && extent[3] > 0) {
            (extent[1] > extent[3]) ? (crsHeight = extent[1] - extent[3]) : (crsHeight = extent[3] - extent[1]);
        } else if (extent[1] < 0 && extent[3] < 0) {
            (extent[1] > extent[3]) ? (crsHeight = Math.abs(extent[3] - extent[1])) : (crsHeight = Math.abs(extent[1] - extent[3]));
        } else {
            crsHeight = Math.abs(extent[1]) + Math.abs(extent[3]);
        }


        /*
            Berechnung der Koordinaten des Markers im Druckbild in EPSG:4326 Koordinaten
        */
        if (markerY > 0) {
            imgY = Math.abs(extent[3]) - markerY;
            y = (ui.mapHeight * imgY) / (crsHeight);
            y = y - 16; //offset
        } else {
            (extent[1] < 0) ? (imgY = markerY - extent[1]) : (imgY = Math.abs(extent[3]) + Math.abs(extent[1])) - (Math.abs(extent[1]) - Math.abs(markerY));
            y = (ui.mapHeight * imgY) / (crsHeight);
            y = y - 16; //offset
        }

        if (markerX > 0) {
            (extent[0] < 0) ? (imgX = Math.abs(extent[0]) + markerX) : (imgX = markerX - extent[0]);
            x = (ui.mapWidth * imgX) / (crsWidth);
            x = x - 8; //offset
        } else {
            imgX = Math.abs(extent[0]) - Math.abs(markerX);
            x = (ui.mapWidth * imgX) / (crsWidth);
            x = x - 8; //offset
        }
    });

    map.getView().setCenter(mapCenter);

    var data = {
        x: x,
        y: y
    };

    return data;
}

function getMapImage(data, map) {
    //holt Koordinate des aktuellen Kartenzentrums
    var mapCenter = map.getView().getCenter();
    map.getOverlays().forEach(function(marker) {
        /*
            Marker Position wird zum neuen Mapzentrum,
            -> Marker in Druckkarte ist dann immer zentral angeordnet
        */
        map.getView().setCenter(marker.getPosition());
    });
    /* 
        Berechnet extent für die Druckkarte anhand der Größe des 
        Div Elements, in dem es platziert werden soll
    */
    var extent = map.getView().calculateExtent([ui.mapWidth, ui.mapHeight]);
    /*
        setze ursprüngliches Kartenzentrum
    */
    map.getView().setCenter(mapCenter);

    /*
        width: Koordninatenintervall (extent[0] - extent[2]) entspricht Kartenbreite in Pixel
        height: Koordinatenintervall (extent[1] - extent[3]) entspricht Kartenhöhe in Pixel
        bbox: extent
    */
    var styles = {
        width: Math.abs(extent[0]) + Math.abs(extent[2]),
        height: Math.abs(extent[1]) + Math.abs(extent[3]),
        bbox: extent[0] + "," + extent[1] + "," + extent[2] + "," + extent[3]
    };

    /*
        Koeffizienten (Faktoren) für eine verzerrungsfreie Transformation
    */
    var faktor = {
        x: styles.width / ui.mapWidth,
        y: styles.height / ui.mapHeight
    }

    /*
        Einzelteile des GetMap Requests
    */
    var imgURL = {
        url: (data.url[data.url.length - 1 === "?"]) ? (data.url) : (data.url += "?"),
        service: "SERVICE=WMS",
        version: "&VERSION=" + data.version,
        request: "&REQUEST=GetMap",
        format: "&FORMAT=" + data.format,
        transparent: "&TRANSPARENT=true",
        layers: "&LAYERS=" + data.layers,
        time: (data.time != "x")?("&TIME="+data.time):(""),
        srs: (data.version === "1.1.1") ? ("&SRS=" + data.srs) : ((data.srs === "EPSG:4326") ? ("&CRS=CRS:84") : ("&CRS=" + data.srs)),
        styles: "&STYLES=&WIDTH=" + Math.floor(styles.width / faktor.x) + "&HEIGHT=" + Math.floor(styles.height / faktor.y) + "&BBOX=" + styles.bbox
    }

    console.log(imgURL.url + imgURL.service + imgURL.version + imgURL.request + imgURL.format + imgURL.transparent + imgURL.layers + imgURL.time + imgURL.srs + imgURL.styles);
    return (imgURL.url + imgURL.service + imgURL.version + imgURL.request + imgURL.format + imgURL.transparent + imgURL.layers + imgURL.time + imgURL.srs + imgURL.styles);
}

function getLegendImage(data) {
    /* jedes Symbol hat bekommt Breite und Höhe von 20 Pixeln zugeordnet */
    var styles = {
        width: 20,
        height: 20
    }

    /* Einzelteile des GetLegendGraphics Requests */
    var imgURL = {
        url: (data.url[data.url.length - 1 === "?"]) ? (data.url) : (data.url += "?"),
        request: "REQUEST=GetLegendGraphic",
        version: "&VERSION=" + data.version,
        format: "&FORMAT=" + data.format,
        styles: "&WIDTH=" + styles.width + "&HEIGHT=" + styles.height,
        layers: "&LAYER=" + data.layers
    }
    return (imgURL.url + imgURL.request + imgURL.version + imgURL.format + imgURL.styles + imgURL.layers);
}