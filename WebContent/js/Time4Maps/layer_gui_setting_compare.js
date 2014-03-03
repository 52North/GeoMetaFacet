/**
 * This method sets the layer names as title of the application
 */
function initializeLayerGuiFilling() { 
  var layer;    
  wmsDescription_Store.fetchItemByIdentity({ identity: "layerDescriptionParam", onItem: function(item, request) { layer = item; }});                                
  var layer2;   
  wmsDescription_Store2.fetchItemByIdentity({ identity: "layerDescriptionParam", onItem: function(item, request) { layer2 = item; }});                                
  dojo.byId('description_wms_title').innerHTML = layer.title[0];
  dojo.byId('description_wms_title2').innerHTML = layer2.title[0];
  var serviceData;
  wmsDescription_Store2.fetchItemByIdentity({ identity: "serviceDescriptionParam", onItem: function(item, request) { serviceData = item; }});
  new dijit.Tooltip({
	    connectId: ["description_wms_title2"],
	    label: '<div class="tooltip">Abstract of this service: '+serviceData.abstractText+'</div>'
  }); 
}