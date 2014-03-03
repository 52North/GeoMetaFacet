/**
 * This class is used to initialize time gui. 
 * Based on the given time steps or time stamps a combobox or calendar is initialized.
 * It is only used for the compare2maps view.
 * 
 * @author Christin Henzen, Daniel Kadner. Professorship of Geoinformation Systems
 */
var combo = false;
var hasTimeData = false;

/**
 * This method initializes the time gui filling process.
 */
function initializeTimeGuiFilling() {
  wmsDescription_Store.fetchItemByIdentity({
    identity: "timeParam",
    onItem: setTimeValues 
  });  
}

/**
 * This method is used to initialize the time gui. It checks wether time information are available or not and calls the appropriate functions to initialize combobox or time slider.
 * A combobox will be displayed, if several single time steps are parsed from the wms capabilities.
 * A time slider will be displayed, if a start date, end date and time period is given.
 * 
 * @param item - the time object of the wms store
 * @param request
 */
function setTimeValues(item, request) { 
  if (item != null) { 
	 
	  if (wmsDescription_Store.getValue(item, "start") == null 
		  || wmsDescription_Store.getValue(item, "start") === "null"
		  || wmsDescription_Store.getValue(item, "start") === 0   
		  || wmsDescription_Store.getValue(item, "end") === null
		  || wmsDescription_Store.getValue(item, "end") === "null"
		  || wmsDescription_Store.getValue(item, "end") === 0) {
		  	hideTimeGui(); 
		  	bindFeatureControls("");  
	  } else {
		  var period_JSON;   
		  wmsDescription_Store.fetchItemByIdentity({ identity: "periodParam", onItem: function(item, request) { period_JSON = item; }});
		  if (period_JSON.day == null && period_JSON.month == null && period_JSON.year == null) {  
			  var timeData;
			  wmsDescription_Store.fetchItemByIdentity({ identity: "timeParam", onItem: function(item, request) { timeData = item; }});
 
			  //prepare a combobox with the given time steps
			  if (timeData.steps != null) {
				  combo = true;
				  buildCombo();
				  hidePartTimeGui();
				  setSliderLabelValues(item);  
				  bindFeatureControls("time"); 
                  hasTimeData = true;
			  //hide time gui
			  } else  {
				  hideTimeGui();  
				  bindFeatureControls(""); 
				  combo = false;
                  hasTimeData = false;
			  }
			  
		  //prepare a slider with the given time values and period	  
		  } else { 
			  buildSlider(); 
			  setSliderValues(item); 
			  setSliderLabelValues(item); 
			  setDatePickerValues(item);
			  bindFeatureControls("time"); 
			  dojo.byId('stateSelect').parentNode.removeChild(dojo.byId('stateSelect')); 
              hasTimeData = true;
		  }
	  } 
  } else { 
	  hideTimeGui();  
	  bindFeatureControls(""); 
      hasTimeData = false;
  }
}

/**
 * This method intitializes the time slider. Values parsed from the wms capabilities document are used to set these slider params.
 * 
 * @param item - the time object in the json store
 */
function setSliderValues(item) {  
  dijit.byId('time_slider').set("minimum", wmsDescription_Store.getValue(item, "start")); //setting slider min value 
  dijit.byId('time_slider').set("maximum", wmsDescription_Store.getValue(item, "end"));   //setting slider max value        
  dijit.byId('time_slider').set("value", wmsDescription_Store.getValue(item, "def")); //setting the 2 slider elements
  var period_JSON;  
  wmsDescription_Store.fetchItemByIdentity({ identity: "periodParam", onItem: function(item, request) { period_JSON = item; }}); 
  
  if(period_JSON.year > 0) {
     var diffYears_Int = dojo.date.difference(new Date(wmsDescription_Store.getValue(item, "start")), new Date(wmsDescription_Store.getValue(item, "end")), 'year');
     dijit.byId('time_slider').set("discreteValues", diffYears_Int); 
  } 
  if(period_JSON.month > 0) {
     var diffMonths_Int = dojo.date.difference(new Date(wmsDescription_Store.getValue(item, "start")), new Date(wmsDescription_Store.getValue(item, "end")), 'month');
     dijit.byId('time_slider').set("discreteValues", diffMonths_Int); 
  }      
  if(period_JSON.day > 0) {
     var diffDays_Int = dojo.date.difference(new Date(wmsDescription_Store.getValue(item, "start")), new Date(wmsDescription_Store.getValue(item, "end")), 'day');
     dijit.byId('time_slider').set("discreteValues", diffDays_Int); 
  } 
}

/**
 * This method sets the labels of the slider.
 * 
 * @param item - the time object of the wms store
 */
function setSliderLabelValues(item) {
  var start_JSDate = new Date(wmsDescription_Store.getValue(item, "start"));
  var start_DojoDate = dojo.date.locale.format(start_JSDate, {datePattern: "dd.MM.yyyy", selector: "date"});
  dojo.byId('time_start_label').innerHTML = start_DojoDate; 
  var end_JSDate = new Date(wmsDescription_Store.getValue(item, "end"));
  var end_DojoDate = dojo.date.locale.format(end_JSDate, {datePattern: "dd.MM.yyyy", selector: "date"});
  dojo.byId('time_end_label').innerHTML = end_DojoDate; 
}

/**
 * This method sets the calendar value.
 * 
 * @param item - the time object of the wms store
 */
function setDatePickerValues(item) {
//setting date picker values
var default_JSDate = new Date(wmsDescription_Store.getValue(item, "start"));                   
var default_DojoDate = dojo.date.locale.format(default_JSDate, {datePattern: "dd.MM.yyyy", selector: "month"});  
dijit.byId('fromDate_Input').set('value', default_JSDate);              
setMapTime(default_DojoDate); 
}

/**
 * The method hide time gui, if it is not used.
 */
function hideTimeGui() {
dojo.byId('time').parentNode.removeChild(dojo.byId('time')); 
}  

/**
 * This method set time slider and play button invisible. Only combobox will be displayed.
 */
function hidePartTimeGui() {
dojo.byId('widget_fromDate_Input').parentNode.removeChild(dojo.byId('widget_fromDate_Input')); 
dojo.byId('play').style.visibility = "visible";
dojo.byId('play').parentNode.removeChild(dojo.byId('play')); 
dojo.byId('stateSelect').style.visibility = "visible";
}  

/**
 * 
 */
function switchTimeView() { 
if (dojo.byId('description_time_table').style.visibility == "collapse") {
  dojo.byId('description_time_table').style.visibility = "visible";
} else {
  dojo.byId('description_time_table').style.visibility = "collapse";
}
}