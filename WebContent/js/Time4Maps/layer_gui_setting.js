/**
 * This method sets the layer name as title of the application
 */
function initializeLayerGuiFilling() {   
  wmsDescription_Store.fetchItemByIdentity({
    identity: "serviceDescriptionParam", 
    onItem: setWMSValues               
  });  
}     
function setWMSValues(item, request) {
  if (dojo.byId('description_wms_title') != null) dojo.byId('description_wms_title').innerHTML = wmsDescription_Store.getValue(item, "title");
} 