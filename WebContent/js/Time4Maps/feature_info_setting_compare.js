/**
 * This class handles feature info settings for the compare2maps view. it binds feature information to the iframe.
 * 
 * @author Christin Henzen, Daniel Kadner. Professorship of Geoinformation Systems
 */

var markers; 
var service_url, service_version, service_srs;
var markers2; 
var service_url2, service_version2, service_srs2;

/**
 * This method is used to register an event listener that sets the marker on the map, when the user has clicked into the map.
 * Further, the feature info response is initialized and embedded.
 * 
 * @param time_info - string param that is set to "time", if the service is time enabled and empty if not.
 */
function bindFeatureControls(time_info) { 
	//getting general information of first web service
	var service_JSON;
	wmsDescription_Store.fetchItemByIdentity({
		identity : "serviceDescriptionParam",
		onItem : function(item, request) {
			service_JSON = item;
		}
	});
	service_url = wmsDescription_Store.getValue(service_JSON, "url");
	service_version = wmsDescription_Store.getValue(service_JSON, "version");
	service_srs = wmsDescription_Store.getValue(service_JSON, "srs");
	
	//getting general information of second web service
	var service_JSON2;
	wmsDescription_Store2.fetchItemByIdentity({
		identity : "serviceDescriptionParam",
		onItem : function(item, request) {
			service_JSON2 = item;
		}
	});
	service_url2 = wmsDescription_Store2.getValue(service_JSON2, "url");
	service_version2 = wmsDescription_Store2.getValue(service_JSON2, "version");
	service_srs2 = wmsDescription_Store2.getValue(service_JSON2, "srs");
	
	//decide which time gui should be loaded
	//and which listener should be added to request feature info 
	//(with time changes -> calling time gui methods, or without)
	var infoControls;
	
	if (time_info == "time" && combo == false) { //with time -> SLIDER
		infoControls = { click : new OpenLayers.Control.WMSGetFeatureInfo(
		{ url : service_url, 
			infoFormat : 'text/xml',
			title : 'Identify features by clicking',
			layers : [ layer_Array[vis_layer_number].params.LAYERS ],
			queryVisible : true,
			vendorParams : {
				time : cutDate(dijit.byId('time_slider').get('value'))
			}, 
			//register an event lister for clicks on the map
			eventListeners : {
				beforegetfeatureinfo : function(event) {
					last_event = event;
					
					//add time information to the OpenLayers map params
					this.vendorParams = {
						time : cutDate(dijit.byId('time_slider').get('value'))
					};
					
					//add a marker and destroy old one, if there is one
					if (markers != null) markers.destroy();
					markers = new OpenLayers.Layer.Markers("Markers");
					map.addLayer(markers);
					if (markers2 != null) markers2.destroy();
					markers2 = new OpenLayers.Layer.Markers("Markers2");
					map2.addLayer(markers2);
					var size = new OpenLayers.Size(21, 25);
					var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
					var icon = new OpenLayers.Icon('http://www.openlayers.org/dev/img/marker.png',size, offset); 
					var icon2 = new OpenLayers.Icon('http://www.openlayers.org/dev/img/marker.png',size, offset); 				
					markers.addMarker(new OpenLayers.Marker(map
							.getLonLatFromPixel(event.xy), icon));
					markers2.addMarker(new OpenLayers.Marker(map2
							.getLonLatFromPixel(event.xy), icon2));
					
					//fill feature info panel below the map
					dojo.byId("featureInfo_frame").src = "featureInfo_compare.jsp?url="
							+ service_url 
							+ "&url2=" + service_url2 
							+ "&version2=" + service_version2
							+ "&query_layers2="
							+ layer_Array2[vis_layer_number2].params.LAYERS
							+ "&request=GetFeatureInfo&service=WMS"
							+ "&version=" + service_version
							+ "&query_layers=" + layer_Array[vis_layer_number].params.LAYERS
							+ "&crs=" + service_srs
							+ "&bbox=" + map.getExtent().toBBOX()
							+ "&width=450&height=300"
							+ "&I=" + event.xy.x
							+ "&J=" + event.xy.y
							+ "&time=" + cutDate(dijit.byId('time_slider').get('value'));
				},
				getfeatureinfo : function(event) {
					console.log("get feature info");
				}
			}
		})
		}; 	
	} else if (time_info == "time" && combo == true) { //with time -> COMBOBOX
		infoControls = {
			click : new OpenLayers.Control.WMSGetFeatureInfo({
				url : service_url, 
				infoFormat : 'text/xml',
				title : 'Identify features by clicking',
				layers : [ layer_Array[vis_layer_number].params.LAYERS ],
				queryVisible : true,
				vendorParams : { time : dijit.byId('stateSelect').get('value') }, 
				eventListeners : {
					beforegetfeatureinfo : function(event) {
						last_event = event;
						this.vendorParams = { time : dijit.byId('stateSelect').get('value')};
						if (markers != null) markers.destroy();
						markers = new OpenLayers.Layer.Markers("Markers");
						map.addLayer(markers);
						if (markers2 != null) markers2.destroy();
						markers2 = new OpenLayers.Layer.Markers("Markers");
						map2.addLayer(markers2); 
						var size = new OpenLayers.Size(21, 25);
						var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h); 
						var icon = new OpenLayers.Icon(
								'http://www.openlayers.org/dev/img/marker.png', size, offset);
						var icon2 = new OpenLayers.Icon(
								'http://www.openlayers.org/dev/img/marker.png', size, offset);
						markers.addMarker(new OpenLayers.Marker(map
								.getLonLatFromPixel(event.xy), icon));							
						markers2.addMarker(new OpenLayers.Marker(map2
								.getLonLatFromPixel(event.xy), icon2));
						dojo.byId("featureInfo_frame").src = "featureInfo_compare.jsp?url="
							+ service_url
							+ "&url2=" + service_url2 
							+ "&version2=" + service_version2
							+ "&query_layers2="
							+ layer_Array2[vis_layer_number2].params.LAYERS
							+ "&request=GetFeatureInfo&service=WMS"
							+ "&version=" + service_version
							+ "&query_layers=" + layer_Array[vis_layer_number].params.LAYERS
							+ "&crs=" + service_srs
							+ "&bbox=" + map.getExtent().toBBOX()
							+ "&width=450&height=300"
							+ "&I=" + event.xy.x
							+ "&J=" + event.xy.y
							+ "&time=" + dijit.byId('stateSelect').get('value'); 
					},
					getfeatureinfo : function(event) {
						console.log("get feature info");
					}
				}
			})
		};
	} else { //without time gui
		infoControls = {
			click : new OpenLayers.Control.WMSGetFeatureInfo({
				url : service_url,
				infoFormat : 'text/xml',
				title : 'Identify features by clicking',
				layers : [ layer_Array[vis_layer_number].params.LAYERS ],
				queryVisible : true,
				eventListeners : {
					beforegetfeatureinfo : function(event) {
						last_event = event;
						if (markers != null) markers.destroy();
						markers = new OpenLayers.Layer.Markers("Markers");
						map.addLayer(markers);
						if (markers2 != null) markers2.destroy();
						markers2 = new OpenLayers.Layer.Markers("Markers");
						map2.addLayer(markers2);
						var size = new OpenLayers.Size(21, 25);
						var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
						var icon = new OpenLayers.Icon('http://www.openlayers.org/dev/img/marker.png',
								size, offset);
						var icon2 = new OpenLayers.Icon('http://www.openlayers.org/dev/img/marker.png',
								size, offset);
						markers.addMarker(new OpenLayers.Marker(map.getLonLatFromPixel(event.xy), icon));
						markers2.addMarker(new OpenLayers.Marker(map2.getLonLatFromPixel(event.xy), icon2));
						dojo.byId("featureInfo_frame").src = "featureInfo_compare.jsp?url="
							+ service_url
							+ "&url2=" + service_url2 
							+ "&version2=" + service_version2
							+ "&query_layers2=" + layer_Array2[vis_layer_number2].params.LAYERS
							+ "&request=GetFeatureInfo&service=WMS"
							+ "&version=" + service_version
							+ "&query_layers=" + layer_Array[vis_layer_number].params.LAYERS
							+ "&crs=" + service_srs
							+ "&bbox=" + map.getExtent().toBBOX()
							+ "&width=450&height=300"
							+ "&I=" + event.xy.x
							+ "&J="+ event.xy.y
							+ "&info_format=text/xml" + "&time=x";
					},
					getfeatureinfo : function(event) {
						console.log("get feature info");
					}
				}
			})
		};
	}
	
	//adding the control to the map.
	for ( var i in infoControls) {
		map.addControl(infoControls[i]);
	}
	infoControls.click.activate();
	
//map2
	
	var infoControls2;
	if (time_info == "time" && combo == false) { //with time
		infoControls2 = { click : new OpenLayers.Control.WMSGetFeatureInfo({
			url : service_url2, 
			infoFormat : 'text/xml',
			title : 'Identify features by clicking',
			layers : [ layer_Array2[vis_layer_number2].params.LAYERS ],
			queryVisible : true,
			vendorParams : {
				time : cutDate(dijit.byId('time_slider').get('value'))
			},
			eventListeners : { beforegetfeatureinfo : function(event) {
				last_event = event;
				this.vendorParams = {
					time : cutDate(dijit.byId('time_slider').get('value'))
				};
				if (markers2 != null) markers2.destroy();
				markers2 = new OpenLayers.Layer.Markers("Markers");
				map2.addLayer(markers2);
				if (markers != null) markers.destroy();
				markers = new OpenLayers.Layer.Markers("Markers");
				map.addLayer(markers);
				var size = new OpenLayers.Size(21, 25);
				var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
				var icon = new OpenLayers.Icon(
					'http://www.openlayers.org/dev/img/marker.png',size, offset);
				var icon2 = new OpenLayers.Icon(
					'http://www.openlayers.org/dev/img/marker.png',size, offset);
				markers2.addMarker(new OpenLayers.Marker(map2.getLonLatFromPixel(event.xy), icon));	
				markers.addMarker(new OpenLayers.Marker(map.getLonLatFromPixel(event.xy), icon2));
				dojo.byId("featureInfo_frame").src = "featureInfo_compare.jsp?url="
					+ service_url2 + "&url2=" + service_url 
					+ "&version2=" + service_version
					+ "&query_layers2=" + layer_Array[vis_layer_number].params.LAYERS
					+ "&request=GetFeatureInfo&service=WMS"
					+ "&version=" + service_version2 + "&query_layers="
					+ layer_Array2[vis_layer_number2].params.LAYERS
					+ "&crs=" + service_srs2
					+ "&bbox=" + map2.getExtent().toBBOX()
					+ "&width=450&height=300"
					+ "&I=" + event.xy.x
					+ "&J=" + event.xy.y
					+ "&time=" + cutDate(dijit.byId('time_slider') .get('value'));
				},
				getfeatureinfo : function(event) {
					console.log("get feature info");
				}
			}
		})
	}; 	
	} else if (time_info == "time" && combo == true) { //with time
		infoControls2 = { click : new OpenLayers.Control.WMSGetFeatureInfo( {
			url : service_url2,
			infoFormat : 'text/xml',
			title : 'Identify features by clicking',
			layers : [ layer_Array2[vis_layer_number2].params.LAYERS ],
			queryVisible : true,
			vendorParams : {
				time : dijit.byId('stateSelect').get('value')
			},
			eventListeners : { beforegetfeatureinfo : function(event) {
				last_event = event;
				this.vendorParams = {
					time : dijit.byId('stateSelect').get('value')
				};
				if (markers2 != null) markers2.destroy();
				markers2 = new OpenLayers.Layer.Markers("Markers");
				map2.addLayer(markers2);
				if (markers != null) markers.destroy();
				markers = new OpenLayers.Layer.Markers("Markers");
				map.addLayer(markers);
				var size = new OpenLayers.Size(21, 25);
				var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
				var icon = new OpenLayers.Icon(
						'http://www.openlayers.org/dev/img/marker.png', size, offset);
				var icon2 = new OpenLayers.Icon(
						'http://www.openlayers.org/dev/img/marker.png', size, offset);
				markers2.addMarker(new OpenLayers.Marker(map2
						.getLonLatFromPixel(event.xy), icon2));
				markers.addMarker(new OpenLayers.Marker(map
						.getLonLatFromPixel(event.xy), icon));
				dojo.byId("featureInfo_frame").src = "featureInfo_compare.jsp?url="
					+ service_url2 + "&url2=" + service_url 
					+ "&version2=" + service_version
					+ "&query_layers2=" + layer_Array[vis_layer_number].params.LAYERS
					+ "&request=GetFeatureInfo&service=WMS"
					+ "&version=" + service_version2
					+ "&query_layers=" + layer_Array2[vis_layer_number2].params.LAYERS
					+ "&crs=" + service_srs2
					+ "&bbox=" + map2.getExtent().toBBOX()
					+ "&width=450&height=300"
					+ "&I=" + event.xy.x
					+ "&J=" + event.xy.y
					+ "&time=" + dijit.byId('stateSelect').get('value');
				},
				getfeatureinfo : function(event) {
					console.log("get feature info");
				}}})}; 
	} else { //without time
		infoControls2 = {click : new OpenLayers.Control.WMSGetFeatureInfo({
			url : service_url2, 
			infoFormat : 'text/xml',
			title : 'Identify features by clicking',
			layers : [ layer_Array2[vis_layer_number2].params.LAYERS ],
			queryVisible : true,
			eventListeners : {
				beforegetfeatureinfo : function(event) {
					last_event = event;
					if (markers2 != null) markers2.destroy(); 
					markers2 = new OpenLayers.Layer.Markers("Markers");
					map2.addLayer(markers2);
					if (markers != null) markers.destroy(); 
					markers = new OpenLayers.Layer.Markers("Markers");
					map.addLayer(markers);
					var size = new OpenLayers.Size(21, 25);
					var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
					var icon = new OpenLayers.Icon(
							'http://www.openlayers.org/dev/img/marker.png',size, offset);
					var icon2 = new OpenLayers.Icon(
							'http://www.openlayers.org/dev/img/marker.png',size, offset);
					markers2.addMarker(new OpenLayers.Marker(map2
							.getLonLatFromPixel(event.xy), icon2));
					markers.addMarker(new OpenLayers.Marker(map
							.getLonLatFromPixel(event.xy), icon));
					dojo.byId("featureInfo_frame").src = "featureInfo_compare.jsp?url="
						+ service_url2 + "&url2=" + service_url 
						+ "&version2=" + service_version
						+ "&query_layers2=" + layer_Array[vis_layer_number].params.LAYERS
						+ "&request=GetFeatureInfo&service=WMS"
						+ "&version=" + service_version2
						+ "&query_layers=" + layer_Array2[vis_layer_number2].params.LAYERS
						+ "&crs=" + service_srs2
						+ "&bbox=" + map2.getExtent().toBBOX()
						+ "&width=450&height=300"
						+ "&I=" + event.xy.x
						+ "&J=" + event.xy.y
						+ "&info_format=text/xml" + "&time=x";
				},
				getfeatureinfo : function(event) {
					console.log("get feature info");
				}}
	})};}
	for ( var i in infoControls2) {
		map2.addControl(infoControls2[i]);
	}
	infoControls2.click.activate();	
}
