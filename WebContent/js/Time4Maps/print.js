function openPrintPreview(){
	require(["dojo/_base/window", "dojo/dom-construct", "dojox/gfx", "dojo/io-query", "dojo/dom-style", "dojo/dom"], function(win, domConstruct, gfx, ioQuery, domStyle, dom) {
        var pWindowSettings = "width=" + window.screen.width / 1.3 + ", height=" + window.screen.height / 1.3 + ", scrollbars=yes";
        var pWindow = window.open("", "", pWindowSettings);
        
        var featureInfo = dom.byId("feature_label").innerHTML;
        
        
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

        pWindow.onunload = function() {
            win.setContext(window, window.document);
        };

        /*focus popup*/
        win.setContext(pWindow, pWindow.document);

        domConstruct.create("h1", {
            innerHTML: "Name of this service: " + service_JSON.title[0],
            style: {
                fontFamiliy: "'Myriad Pro','Helvetica Neue',Helvetica,Arial,Sans-Serif",
                textShadow: "0px 1px 1px silver"
            }
        }, win.body());

        domConstruct.create("h3", {
            innerHTML: "Abstract of this service: " + service_JSON.abstractText[0],
            style: {
                fontFamiliy: "'Myriad Pro','Helvetica Neue',Helvetica,Arial,Sans-Serif",
                textShadow: "0px 1px 1px silver"
            }
        }, win.body());

        /* get Map Image */
        var mapImage = null;
        var bbox = "";
        var imageUrl = [];

        map.getLayers().forEach(function(layer) {
            if (layer instanceof ol.layer.Image) {
                var extent = map.getView().getView2D().calculateExtent(map.getSize());
                for (var i in extent) {
                    bbox = bbox + extent[i].toString() + ",";
                }
                bbox = bbox.substring(0, bbox.length - 1);

                var resolution = map.getView().getResolution();
                var pixelRatio = 1;
                var projection = map.getView().getProjection();
                mapImage = layer.getSource().getImage(extent, resolution, pixelRatio, projection);
                imageUrl.push({
                        url: mapImage.image_.src.substring(0, mapImage.image_.src.indexOf("BBOX")) + ioQuery.objectToQuery({
                            BBOX: bbox
                        }),
                        width: mapImage.image_.width,
                        height: mapImage.image_.height
                    }
                );
            }
        });

        domConstruct.create("div", {
            id: "leftItemBox",
            style: {
                width: (58 * (window.screen.width / 1.3)) / 100 + "px",
                height: "400px",
                float: "left",
                marginLeft: "10px",
                backgroundColor: "lightgray"
            }
        }, win.body());


        domConstruct.create("div", {
            id: "rightItemBox",
            style: {
                width: (36 * (window.screen.width / 1.3)) / 100 + "px",
                height: "400px",
                float: "right",
                marginRight: "10px"
            }
        }, win.body());


        /*create & display map and overlay image */

        domConstruct.create("div", {
            id: "mapSurface",
            style: {
                width: domStyle.get("leftItemBox", "width"),
                height: "400px",
                margin: "0 auto",
            }
        }, "leftItemBox");
        
        var mapSurface = gfx.createSurface("mapSurface", domStyle.get("leftItemBox", "width"), 400);
        for (var i in imageUrl) {
            mapSurface.createImage({
                x: 0,
                y: 0,
                width: (domStyle.get("leftItemBox", "width") / imageUrl[i].width) * imageUrl[i].width,
                height: (400 / imageUrl[i].height) * imageUrl[i].height,
                src: imageUrl[i].url
            });
        }

        /* if overlays are available...*/
        map.getOverlays().forEach(function(overlay) {
            mapSurface.createImage({
                x: ((domStyle.get("leftItemBox", "width") / map.getSize()[0]) * map.getPixelFromCoordinate(overlay.getProperties().position)[0]) - 21 / 2,
                y: ((400 / map.getSize()[1]) * map.getPixelFromCoordinate(overlay.getProperties().position)[1]) - 25,

                width: overlay.values_.element.width,
                height: overlay.values_.element.height,
                src: overlay.values_.element.src
            });
        });
        
        
        /* add legend image */
        var legendSurface = gfx.createSurface("rightItemBox", domStyle.get("rightItemBox", "width"), 400);
        if (legendImage.width > domStyle.get("rightItemBox", "width")){
        	legendSurface.createImage({
            	x: 0,
            	y: 0,
            	width: (domStyle.get("rightItemBox", "width") / legendImage.width) * legendImage.width +"px" ,
            	height: legendImage.height + "px",
            	src: legendImage.src
            });

        }else{
        	legendSurface.createImage({
            	x: 0,
            	y: 0,
            	width: legendImage.width+"px" ,
            	height: legendImage.height+"px",
            	src: legendImage.src
            });
        }
        
        domConstruct.create("div", {
        	id: "featureInfo",
        	style: {
        		marginTop: "440px",
        		marginLeft: "auto",
        		marginRight: "auto",
        		width: "98%"
        	}
        }, win.body());
        
        
        
        if (featureInfo != "Click on the map to get feature information."){        	
        	domConstruct.create("h3", {
        		id: "featureInfoLabel",
                innerHTML: "Feature Information",
                style: {
                	
                }
            }, "featureInfo");
        	
        	domConstruct.create("div", {
        		innerHTML: featureInfo
        	}, "featureInfo");		
        }
        
        domConstruct.create("button", {
        	type: "button",
        	innerHTML: "Print",
        	style: {
        		width: "100px",
        		height: "25px",
        		marginTop: "30px"
        	},
        	onclick: function(){
        		pWindow.print();
        	}
        }, "featureInfo");
        
        domConstruct.create("button", {
        	type: "button",
        	innerHTML: "Cancel",
        	style: {
        		width: "100px",
        		height: "25px",
        		marginTop: "30px",
        		marginLeft: "40px"
        	},
        	onclick: function(){
        		pWindow.close();
        	}
        }, "featureInfo");
        
        
        //pWindow.close();
    });

}