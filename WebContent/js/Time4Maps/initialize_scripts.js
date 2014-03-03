/**
 * This method adds tooltips to the buttons in the application.
 */
function buildToolTips(){    
var serviceData; 
wmsDescription_Store.fetchItemByIdentity({ identity: "serviceDescriptionParam", onItem: function(item, request) { serviceData = item; }});
new dijit.Tooltip({
connectId: ["description_wms_title"],
label: '<div class="tooltip">Abstract of this service: '+serviceData.abstractText+'</div>'
});  
//openlayers
new dijit.Tooltip({
connectId: ["OpenLayers.Control.PanZoom_5_zoomworld_innerImage"],
label: '<div class="tooltip">Click to zoom to full extent.</div>'
});
new dijit.Tooltip({
connectId: ["OpenLayers.Control.PanZoom_5_zoomin_innerImage"],
label: '<div class="tooltip">Click to zoom in.</div>'
});
new dijit.Tooltip({
connectId: ["OpenLayers.Control.PanZoom_5_zoomout_innerImage"],
label: '<div class="tooltip">Click to zoom out.</div>'
});
new dijit.Tooltip({
connectId: ["OpenLayers.Control.PanZoom_5_panup_innerImage"],
label: '<div class="tooltip">Click to pan north.</div>'
});
new dijit.Tooltip({
connectId: ["OpenLayers.Control.PanZoom_5_pandown_innerImage"],
label: '<div class="tooltip">Click to pan south.</div>'
});
new dijit.Tooltip({
connectId: ["OpenLayers.Control.PanZoom_5_panleft_innerImage"],
label: '<div class="tooltip">Click to pan west.</div>'
});
new dijit.Tooltip({
connectId: ["OpenLayers.Control.PanZoom_5_panright_innerImage"],
label: '<div class="tooltip">Click to pan east.</div>'
});
//time
new dijit.Tooltip({
connectId: ["time_start_label"],
position:['above'],
label: '<div class="tooltip2">Begin of time period.</div>'
});
new dijit.Tooltip({
connectId: ["time_end_label"],
position:['above'],
label: '<div class="tooltip2">End of time period.</div>'
});
if (dojo.byId('play_button') != null) new dijit.Tooltip({connectId: ["play_button"],
position:['above'],label: '<div class="tooltip2">Click to start or stop animating the map.</div>'
});
if (dojo.byId('stateSelect') != null) new dijit.Tooltip({connectId: ["stateSelect"],position:['above'],
label: '<div class="tooltip" style="width:250px;">Choose the time step which should be visualized.</div>'
});
//feature info
new dijit.Tooltip({ 
connectId: ["cp_finfo"],position:['above'],
label: '<div class="tooltip style="width:250px;">This dialog shows (if provided by the visualized service) the feature information. Click on the map to choose a point of interest. <br><br>Feature information is only shown for the first visible layer.</div>'
});

//legend
if (dojo.byId('legend_frame') != null)
new dijit.Tooltip({
connectId: ["legend_frame"],position:['above'],
label: '<div class="tooltip" style="width:250px;">This dialog shows (if provided by the visualized service) the legend of the visualized data.</div>'
});

//layer switcher
if (dojo.byId('layerSwitcherCustom') != null)
new dijit.Tooltip({
connectId: ["layerSwitcherCustom"],position:['above'],
label: '<div class="tooltip" style="width:250px;">This dialog shows the available/choosen layer of the service. You can change the layer order (arrows), transparency (slider) and visiblity (checkboxes).</div>'
});

//search box
if (dojo.byId('SearchBoxText') != null)
new dijit.Tooltip({
connectId: ["SearchBoxText"],position:['above'],
label: '<div class="tooltip" style="width:250px;">Please enter a search term. <br><br>You can search for metadata (full-text search) or geographical names (will be focussed on the map).</div>'
});
}