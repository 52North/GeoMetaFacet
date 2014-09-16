/**
 * Copyright 2012 52°North Initiative for Geospatial Open Source Software GmbH
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
 * This class is used to initialize time gui.
 * Based on the given time steps or time stamps a combobox or calendar is initialized.
 * It is only used for the time4maps view.
 *
 * @author Hannes Tressel, Christin Henzen, Daniel Kadner. Professorship of Geoinformation Systems
 */
var combo = false;
var hasTimeData = false;

/**
 * This method initializes the time gui filling process.
 */
function initializeTimeGuiFilling() {
    if (!dijit.byId("fromDate_Input")) {
        dojo.declare("enDateTextBox", dijit.form.DateTextBox, {
            enFormat: {
                selector: 'date',
                datePattern: 'dd-MM-yyyy',
                locale: 'en-gb'
            },
            value: "",
            postMixInProperties: function() {
                this.inherited(arguments);
                this.value = dojo.date.locale.parse(this.value, this.enFormat);
            },
            serialize: function(dateObject, options) {
                return dojo.date.locale.format(dateObject, this.enFormat);
            }
        });
        var b2 = new enDateTextBox({
            value: "01-11-2006",
            name: "fromDate_Input",
            onChange: fromDateChanged
        }, "fromDate_Input");

        if (heatmap)
            addClickListener2(b2, "T4M");
    }
    setTimeValues();
}

/**
 * This method handles updates on time information.
 */
function updateTimeValues() {
    var time_JSON, period_JSON;

    wmsDescription_Store.fetchItemByIdentity({
        identity: "timeParam",
        onItem: function(item, request) {
            time_JSON = item;
        }
    });

    wmsDescription_Store.fetchItemByIdentity({
        identity: "periodParam",
        onItem: function(item, request) {
            period_JSON = item;
        }
    });

    if (time_JSON.start[vis_layer_number] != null && time_JSON.end[vis_layer_number] != null && time_JSON.def[vis_layer_number] != null) {
        if (period_JSON.day[vis_layer_number] != null && period_JSON.month[vis_layer_number] != null && period_JSON.year[vis_layer_number] != null) {
            if (hasTimeData === false) {
                showTimeGui();
                if (dijit.byId('time_slider') === undefined)
                    buildSlider();
            }

            hasTimeData = true;
            combo = false;
            setSliderValues();
            setSliderLabelValues();
            setDatePickerValues();
            bindFeatureControls("time");

            if (dojo.byId('stateSelect'))
                dojo.byId('stateSelect').parentNode.removeChild(dojo.byId('stateSelect'));
        } else {
            if (hasTimeData === false) {
                showTimeGui();
                if (dijit.byId('stateSelect') === undefined)
                    buildCombo();
            }
            hasTimeData = true;
            combo = true;
            hidePartTimeGui();
            setSliderLabelValues();
            bindFeatureControls("time");
        }
    } else {
        hasTimeData = false;
        hideTimeGui();
        bindFeatureControls("");
    }
}

/**
 * This method is used to initialize the time gui. It checks wether time information are available or not and calls the appropriate functions to initialize combobox or time slider.
 * A combobox will be displayed, if several single time steps are parsed from the wms capabilities.
 * A time slider will be displayed, if a start date, end date and time period is given.
 *
 * @param item - the time object of the wms store
 * @param request
 */
function setTimeValues() {
    var time_JSON, period_JSON;
    wmsDescription_Store.fetchItemByIdentity({
        identity: "timeParam",
        onItem: function(item, request) {
            time_JSON = item;
        }
    });

    wmsDescription_Store.fetchItemByIdentity({
        identity: "periodParam",
        onItem: function(item, request) {
            period_JSON = item;
        }
    });

    if (time_JSON.start[vis_layer_number] != null && time_JSON.end[vis_layer_number] != null && time_JSON.def[vis_layer_number] != null) {
        if (period_JSON.day[vis_layer_number] != null && period_JSON.month[vis_layer_number] != null && period_JSON.year[vis_layer_number] != null) {
            hasTimeData = true;
            combo = false;
            buildSlider();
            setSliderValues();
            setSliderLabelValues();
            setDatePickerValues();
            bindFeatureControls("time");

            showTimeGui();

            if (dojo.byId('stateSelect'))
                dojo.byId('stateSelect').parentNode.removeChild(dojo.byId('stateSelect')); // lÃ¶scht stateSelect
        } else {
            hasTimeData = true;
            combo = true;
            buildCombo();
            hidePartTimeGui();
            setSliderLabelValues();
            bindFeatureControls("time");
        }
    } else {
        hasTimeData = false;
        hideTimeGui();
        bindFeatureControls("");
    }
}

/**
 * This method intitializes the time slider. Values parsed from the wms capabilities document are used to set these slider params.
 *
 * @param item - the time object in the json store
 */
function setSliderValues() {
    var time_JSON, period_JSON;

    wmsDescription_Store.fetchItemByIdentity({
        identity: "timeParam",
        onItem: function(item, request) {
            time_JSON = item;
        }
    });

    wmsDescription_Store.fetchItemByIdentity({
        identity: "periodParam",
        onItem: function(item, request) {
            period_JSON = item;
        }
    });

    dijit.byId('time_slider').set("minimum", time_JSON.start[vis_layer_number]);
    dijit.byId('time_slider').set("maximum", time_JSON.end[vis_layer_number]);
    dijit.byId('time_slider').set("value", time_JSON.def[vis_layer_number]);

    if (period_JSON.day[vis_layer_number] > 0) {
        var diffDays_Int = dojo.date.difference(new Date(time_JSON.start[vis_layer_number]), new Date(time_JSON.end[vis_layer_number]), 'day');
        dijit.byId('time_slider').set("discreteValues", diffDays_Int);
    }

    if (period_JSON.month[vis_layer_number] > 0) {
        var diffMonths_Int = dojo.date.difference(new Date(time_JSON.start[vis_layer_number]), new Date(time_JSON.end[vis_layer_number]), 'month');
        dijit.byId('time_slider').set("discreteValues", diffMonths_Int);
    }

    if (period_JSON.year[vis_layer_number] > 0) {
        var diffYears_Int = dojo.date.difference(new Date(time_JSON.start[vis_layer_number]), new Date(time_JSON.end[vis_layer_number]), 'year');
        dijit.byId('time_slider').set("discreteValues", diffYears_Int);
    }
}

/**
 * This method sets the labels of the slider.
 *
 * @param item - the time object of the wms store
 */
function setSliderLabelValues() {
    var time_JSON;
    wmsDescription_Store.fetchItemByIdentity({
        identity: "timeParam",
        onItem: function(item, request) {
            time_JSON = item;
        }
    });

    var start_JSDate = new Date(time_JSON.start[vis_layer_number]);
    var start_DojoDate = dojo.date.locale.format(start_JSDate, {
        locale: "de-de",
        datePattern: "dd.MM.yyyy",
        selector: "date"
    });
    dojo.byId('time_start_label').innerHTML = start_DojoDate;

    var end_JSDate = new Date(time_JSON.end[vis_layer_number]);
    var end_DojoDate = dojo.date.locale.format(end_JSDate, {
        locale: "de-de",
        datePattern: "dd.MM.yyyy",
        selector: "date"
    });
    dojo.byId('time_end_label').innerHTML = end_DojoDate;
}

/**
 * This method sets the calendar value.
 *
 * @param item - the time object of the wms store
 */
function setDatePickerValues() {
    var time_JSON;
    wmsDescription_Store.fetchItemByIdentity({
        identity: "timeParam",
        onItem: function(item, request) {
            time_JSON = item;
        }
    });

    var default_JSDate = new Date(time_JSON.start[vis_layer_number]);
    dijit.byId('fromDate_Input').set("value", default_JSDate);
    var default_DojoDate = dojo.date.locale.format(default_JSDate, {
        datePattern: "dd.MM.yyyy",
        selector: "month"
    });
    setMapTime(default_DojoDate);
}

/**
 * The method hide time gui, if it is not used.
 */
function hideTimeGui() {
    if (dojo.byId('time') != null)
        dojo.byId('time').style.visibility = 'hidden';
    if (dojo.byId('time4mapsMap_Time'))
        dojo.byId('time4mapsMap_Time').style.display = "none";
    if (dijit.byId('border-left-top'))
        dojo.byId('border-left-top').style.height = "99%";
}
/**
 * The method shows time gui.
 */
function showTimeGui() {
    dojo.byId('time').style.visibility = 'visible';
    if (dijit.byId('border-left-top')) {
        dojo.byId('border-left-top').style.height = "80%";
    }
    resizeMap();
    if (dojo.byId('time4mapsMap_Time')) {
        dojo.byId('time4mapsMap_Time').style.display = "block";
        dojo.byId('time4mapsMap_Time').style.top = "84%";
        //dijit.byId('time4mapsMap_Time').resize();
    }
}
/**
 * This method set time slider and play button invisible. Only combobox will be displayed.
 */
function hidePartTimeGui() {
    if (dojo.byId('widget_fromDate_Input'))
        dojo.byId('widget_fromDate_Input').style.visibility = 'hidden';
    dojo.byId('play').style.visibility = 'hidden';
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