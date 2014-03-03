/**
 * This class is used to initialize a combobox with all available time stamps given in the WMS capabilities document.
 * It is only used for the compare2maps view.
 * 
 * @author Christin Henzen, Daniel Kadner. Professorship of Geoinformation Systems
 */

var dataStore;
var timeData;  

/**
 * This method initializes a combobox that is display in case of single defined time steps.
 */
function buildCombo() { 
	wmsDescription_Store.fetchItemByIdentity({ identity: "timeParam", onItem: function(item, request) { timeData = item; }});
	if (timeData.steps != null) {
	var data_list = [];
	for ( var i = 0; i < timeData.steps.length; i++) {
		data_list.push({
			name : timeData.steps[i],tstep : i 
		});	
	}
	/* set up data store */
	var data = { identifier:'name', items:[]};
	for ( var i = 0, l = data_list.length; i < data_list.length; i++) {
		data.items.push(dojo.mixin({
			id : i + 1
		}, data_list[i % l]));
	}
	dataStore = new dojo.data.ItemFileWriteStore({data : data});
	var comboBox = new dijit.form.ComboBox({
        id: "stateSelect",
        name: "state", 
        store: dataStore,
        value: timeData.steps[0],
        searchAttr: "name",
        onChange: function(value) { 
	        for (var i = 0; i < layer_Array.length; i++) {   
	            layer_Array[i].mergeNewParams({'time':value}); 
	        } 
	    }
    }, "stateSelect");	
	for (var i = 0; i < layer_Array.length; i++) {   
        layer_Array[i].mergeNewParams({'time':timeData.steps[0]}); 
    }
	}
}

/**
 * The method returns the next available time stamp,
 * 
 * @param value - current time value
 * @returns next time value
 */
function nextStep(value){
	var pos;
	for (var i = 0; i < timeData.steps.length; i++) { 
		if (timeData.steps[i] === value && i < timeData.steps.length-1) pos = i;
	}
	return timeData.steps[pos+1];
}