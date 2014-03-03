var last_event;
function buildSlider() {
	var time_slider = new dijit.form.HorizontalSlider({
		name : "time_slider",
		intermediateChanges : false,
		
		showButtons : true,
		onChange : function(value) {
			var start_JSDate = new Date(value);
			correctDate(start_JSDate, 0);
		}
	}, "time_slider");
}
function fromDateChanged(newFrom_DojoDate) {
	var newFrom_JSDate = new Date(newFrom_DojoDate);
	dijit.byId('time_slider').set("value",
			correctDate(newFrom_JSDate, 0).getTime());
	setMapTime(newFrom_JSDate);
	if (last_event != null) {
		dojo.byId("featureInfo_frame").src = "featureInfo_compare.jsp?url="
				+ service_url + "&url2=" + service_url2 + "&version2="
				+ service_version2 + "&query_layers2="
				+ layer_Array2[vis_layer_number2].name
				+ "&request=GetFeatureInfo&service=WMS" + "&version="
				+ service_version + "&query_layers="
				+ layer_Array[vis_layer_number].name + "&crs=" + service_srs
				+ "&bbox=" + map.getExtent().toBBOX() + "&width=450&height=300"
				+ "&I=" + last_event.xy.x + "&J=" + last_event.xy.y + "&time="
				+ cutDate(dijit.byId('time_slider').get('value'));
	}
}
function correctDate(incoming_JSDate, changedDate_Int) {
	var period_JSON;
	var time_JSON;
	wmsDescription_Store.fetchItemByIdentity({
		identity : "periodParam",
		onItem : function(item, request) {
			period_JSON = item;
		}
	});
	wmsDescription_Store.fetchItemByIdentity({
		identity : "timeParam",
		onItem : function(item, request) {
			time_JSON = item;
		}
	});
	if (period_JSON.day[0] == null && period_JSON.month[0] == null
			&& period_JSON.year[0] == null) {
		var corrected_DojoDate = dojo.date.locale.format(incoming_JSDate, {
			datePattern : "dd.MM.yyyy",
			selector : "date"
		});
		dijit.byId('fromDate_Input').set('value', incoming_JSDate);
	} else {
		if (dojo.date.difference(new Date(time_JSON.start[0]), incoming_JSDate,
				'day') < 0)
			incoming_JSDate = new Date(time_JSON.start[0]);
		if (dojo.date.difference(new Date(time_JSON.end[0]), incoming_JSDate,
				'day') > 0)
			incoming_JSDate = new Date(time_JSON.end[0]);
		if (period_JSON.year[0] == 0) {
			if (period_JSON.month[0] == 0) {
				if (period_JSON.day[0] == 0) {
					console
							.log("An error in correcting date occured. period not set.");
				} else {
					var moduloDiff_Int = dojo.date.difference(new Date(
							time_JSON.start[0]), incoming_JSDate, 'day')
							% period_JSON.day[0];
					if (moduloDiff_Int == 0) {
						console.log("nothing to correct");
					} else {
						if (moduloDiff_Int > period_JSON.day[0] / 2) {
							incoming_JSDate = dojo.date.add(incoming_JSDate,
									'day', period_JSON.day[0] - moduloDiff_Int);
						} else {
							incoming_JSDate = dojo.date.add(incoming_JSDate,
									'day', -moduloDiff_Int);
						}
						var corrected_DojoDate = dojo.date.locale.format(
								incoming_JSDate, {
									datePattern : "dd.MM.yyyy",
									selector : "date"
								});
						if (changedDate_Int == 0)
							dijit.byId('fromDate_Input').set('value',
									incoming_JSDate);
					}
				}
			} else { //month not null
				if (period_JSON.day[0] == 0) {
					//setting the day of the date to one
					if (incoming_JSDate.getDate() > 14) {
						incoming_JSDate.setDate(1);
						incoming_JSDate = dojo.date.add(incoming_JSDate,
								'month', 1);
					} else {
						incoming_JSDate.setDate(1);
					}
					//correcting the month value of the date
					var moduloDiff_Int = dojo.date.difference(new Date(
							time_JSON.start[0]), incoming_JSDate, 'month')
							% period_JSON.month[0];
					if (moduloDiff_Int == 0) {
						console.log("nothing to correct");
					} else {
						if (moduloDiff_Int > period_JSON.month[0] / 2) { //jump to next higher 
							incoming_JSDate = dojo.date.add(incoming_JSDate,
									'month', period_JSON.month[0]
											- moduloDiff_Int);
						} else { //jump to next lower 
							incoming_JSDate = dojo.date.add(incoming_JSDate,
									'month', -moduloDiff_Int);
						}
					}
					var corrected_DojoDate = dojo.date.locale.format(
							incoming_JSDate, {
								datePattern : "dd.MM.yyyy",
								selector : "date"
							});
					if (changedDate_Int == 0)
						dijit.byId('fromDate_Input').set('value',
								incoming_JSDate);
				} else {
					console.log("mixed period: month and date");
				}
			}
		} else { /*year not null */
			incoming_JSDate.setDate(1);
			if (incoming_JSDate.getMonth() > 6) {
				incoming_JSDate.setMonth(0);
				incoming_JSDate.setYear(incoming_JSDate.getYear() + 1);
			} else {
				incoming_JSDate.setMonth(0);
			}
			var corrected_DojoDate = dojo.date.locale.format(incoming_JSDate, {
				datePattern : "dd.MM.yyyy",
				selector : "date"
			});
			dijit.byId('fromDate_Input').set('value', incoming_JSDate);
		}
	} //else period given
	return incoming_JSDate;
}
function cutDate(date_String) {
	var period_JSON;
	wmsDescription_Store.fetchItemByIdentity({
		identity : "periodParam",
		onItem : function(item, request) {
			period_JSON = item;
		}
	});
	var date_JSDate = new Date(date_String);
	if (period_JSON.day[0] > 0) {
		return dojo.date.locale.format(date_JSDate, {
			datePattern : "yyyy-MM-dd",
			selector : "date"
		});
	} else {
		if (period_JSON.month[0] > 0) {
			return dojo.date.locale.format(date_JSDate, {
				datePattern : "yyyy-MM",
				selector : "date"
			});
		} else {
			return dojo.date.locale.format(date_JSDate, {
				datePattern : "yyyy",
				selector : "date"
			});
		}
	}
	return date_JSDate;
}
//calculate new dates (add period) in given time range and adapt gui
var activeTime;
function playSequence() {
	if (play_button.get('label') == "Animate map") {
		activeTime = window.setInterval("adaptPlayButton()", 2000);
	} else {
		window.clearInterval(activeTime);
		play_button.set('label', 'Animate map');
	}
}
function adaptPlayButton() {
	var period_JSON;
	wmsDescription_Store.fetchItemByIdentity({
		identity : "periodParam",
		onItem : function(item, request) {
			period_JSON = item;
		}
	});
	if (dijit.byId('time_slider').get('value') >= dijit.byId('time_slider')
			.get('maximum')) {
		window.clearInterval(activeTime);
		play_button.set('label', 'Animate map');
	} else {
		adaptSequenceGui(period_JSON);
	}
}
function adaptSequenceGui(period_JSON) {
	play_button.set('label', 'Stop');
	var from_JSDate = dijit.byId('fromDate_Input').get('value');
	var newDate_JSDate = new Date(from_JSDate);
	if (period_JSON.year[0] > 0)
		newDate_JSDate = dojo.date.add(newDate_JSDate, 'year',
				parseInt(period_JSON.year[0]));
	if (period_JSON.month[0] > 0)
		newDate_JSDate = dojo.date.add(newDate_JSDate, 'month',
				parseInt(period_JSON.month[0]));
	if (period_JSON.day[0] > 0)
		newDate_JSDate = dojo.date.add(newDate_JSDate, 'day',
				parseInt(period_JSON.day[0]));
	var newDate_DojoDate = dojo.date.locale.format(newDate_JSDate, {
		datePattern : "dd.MM.yyyy",
		selector : "date"
	});
	dijit.byId('fromDate_Input').set('value', newDate_JSDate);
}