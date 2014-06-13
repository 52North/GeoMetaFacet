function initLayerControlWidget() {
    require(["dojo/dom-construct", "dijit/form/HorizontalSlider", "dojo/dom-attr", "dojo/dom", "dijit/registry"], function(domConstruct, HzSlider, domAttr, dom, registry) {
        map.getLayers().forEach(function(layer, index) {

            if (layer instanceof ol.layer.Image) {
                domConstruct.destroy(layer.getProperties().title + "_checkbox");
                domConstruct.place(domConstruct.create("div", {
                    id: layer.getProperties().title + "_area",
                    style: {
                        display: "block",
                        position: "relative",
                        width: "100%",
                        marginBottom: "10px"
                    }
                }), "layerSwitcherCustom", "first");

                domConstruct.create("div", {
                    id: layer.getProperties().title,
                    innerHTML: layer.getProperties().title,
                    style: {
                        display: "block",
                        width: "90%",
                        marginTop: "0px",
                        font: "bold 11px sans-serif",
                        color: "#333"
                    }
                }, layer.getProperties().title + "_area");

                domConstruct.create("input", {
                    id: layer.getProperties().title + "_checkbox",
                    type: "checkbox",
                    name: "visibility",
                    checked: layer.getVisible(),
                    index_: index,
                    style: {
                        position: "relative",
                        top: "5px",
                        marginTop: "1px",
                        marginLeft: "0px"
                    },
                    onclick: function() {
                        if (this.checked) {
                            layer.setVisible(true);
                        } else {
                            layer.setVisible(false);
                        }
                        updateLegend();
                        //change LAyerLegend

                    }
                }, layer.getProperties().title + "_area");

                domConstruct.create("img", {
                    src: "images/icons/layerswitcher/moveup.png",
                    style: {
                        position: "relative",
                        top: "5px",
                        left: "4px"
                    },
                    onclick: function() {
                        map.getLayers().removeAt(index);
                        map.getLayers().insertAt(index + 1, layer);
                        updateLayerControlWidget();
                    }
                }, layer.getProperties().title + "_area");

                domConstruct.create("img", {
                    src: "images/icons/layerswitcher/movedown.png",
                    style: {
                        position: "relative",
                        top: "5px",
                        left: "15px"
                    },
                    onclick: function() {
                        map.getLayers().removeAt(index);
                        map.getLayers().insertAt(index - 1, layer);
                        updateLayerControlWidget();
                    }
                }, layer.getProperties().title + "_area");

                /*
                domConstruct.create("input", {
                    type: "range",
                    value: "10",
                    min: "0",
                    max: "10",
                    step: ".05",
                    onchange: function() {
                        layer.setOpacity(this.value / 10);
                    },
                    style: {
                        position: "relative",
                        top: "10px",
                        left: "20px",
                        width: "110px"
                    }
                }, layer.getProperties().title + "_area");
                */
                domConstruct.create("div", {
                    id: layer.getProperties().title + "_slider"
                }, layer.getProperties().title + "_area");

                if (registry.byId(layer.getProperties().title + "_slider") != undefined) {
                    registry.byId(layer.getProperties().title + "_slider").destroyRecursive();
                }

                new HzSlider({
                    minimum: 0,
                    maximum: 10,
                    value: 10,
                    intermediateChanges: true,
                    style: {
                        "position": "relative",
                        "top": "-11px",
                        "left": "50px",
                        "width": "110px"
                    },
                    onChange: function(value) {
                        layer.setOpacity(value / 10);
                    }

                }, layer.getProperties().title + "_slider");
            }

        });
    });
}

function updateLayerControlWidget() {
    require(["dojo/dom-construct", "dojo/query"], function(domConstruct, query) {
        query("#layerSwitcherCustom *").forEach(function(node) {
            domConstruct.destroy(node);
        });
        initLayerControlWidget();
        updateLegend();
        updateTimeValues();

    });
}

function updateLegend() {
    require(["dojo/dom", "dojo/query"], function(dom, query) {
        for (var i = map.getLayers().array_.length - 1; i > 0; i--) {
            if (dom.byId(map.getLayers().array_[i].getProperties().title + "_checkbox").checked) {
                setLegendValues(i - 1);
                break;
            }
        }
    });
}