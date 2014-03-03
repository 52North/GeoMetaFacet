/**
 * This javascript file contains different methods to diplay a print preview. 
 */

var doc; // document to access all DOM
var tiles; // saves tiles of an OpenLayers Layer

/**
 * This method is called from index/start.jsp to display a print preview 
 */
function openPrintPreview() {
    var preview = window.open("","","width="+window.screen.width/1.3+", height="+window.screen.height/1.3+", scrollbars=yes");
    doc = preview.document;
    
    var htmlBasic = "<!DOCTYPE html>\n\
                    <html>\n\
                        <head>\n\
                            <link type='text/css' rel='stylesheet' href='css/print_style.css'>\n\
                            <link type='text/css' rel='stylesheet' href='js/Dojo-1.9.0/dijit/themes/tundra/tundra.css'>\n\
                            <link type='text/css' rel='stylesheet' href='js/Dojo-1.9.0/dojox/grid/resources/tundraGrid.css'>\n\
                        </head>\n\
                        <body class='claro'>\n\
                            <img id='logo' src='././images/lama_logo.gif'></img>\n\
                            <br>\n\
                            <br>\n\
                            <h1 id='heading1'></h1>\n\
                            <h3 id='heading2'></h3>\n\
                            <br>\n\
                            <div id='map'></div>\n\
                            <br>\n\
                            <div id='time'></div>\n\
                            <br>\n\
                            <div id='featureInfo'></div>\n\
                            <br>\n\
                            <div id='buttons'>\n\
                                <div id='printBTN'></div>\n\
                                <div id='cancelBTN'></div>\n\
                            </div>\n\
                        </body>\n\
                    </html>";
    
    doc.write(htmlBasic);
    doc.close();
    
    getTiles(); //catch the visible tiles from visible layer
    
    require(["dojo/dom", "dijit/form/Button", "dojox/gfx", "dijit/registry", "dojo/dom-construct"], function(dom, Button, gfx, registry, domConstruct){
        var printBTN, cancelBTN ,service_JSON, canvasSize;
        var canvas = [];
        
        cancelBTN = new Button({
            label: "Cancel",
            onClick: function(){
                preview.close();
            }
        }, dom.byId('cancelBTN', doc));
        
        printBTN = new Button({
            label: "Print",
            onClick: function() {
                preview.print();
            }
        }, dom.byId('printBTN', doc));
        
        canvasSize = {
            width: 600,
            height: 400
        };
        
        if (dom.byId("map2") != null) {
            domConstruct.create("div", {
                id: "map1"
            }, dom.byId("map", doc));
            
            domConstruct.create("div", {
                id: "map2"
            }, dom.byId("map", doc));
            
            canvas[0] = gfx.createSurface(dom.byId("map1", doc), canvasSize.width, canvasSize.height);
            canvas[1] = gfx.createSurface(dom.byId("map2", doc), canvasSize.width, canvasSize.height);
            
            for (var i = 0; i < canvas.length; i++) {
                for (var e = 0; e < tiles[i].length; e++) {
                    canvas[i].createImage({
                        x:      tiles[i][e].x*(canvasSize.width/map.size.w),
                        y:      tiles[i][e].y*(canvasSize.height/map.size.h),
                        width:  (canvasSize.width/map.size.w)*tiles[i][e].width,
                        height: (canvasSize.height/map.size.h)*tiles[i][e].height,
                        src:    tiles[i][e].url
                    });
                }
                
                canvas[i].createLine({x1: 0,y1: 0,x2: canvasSize.width,y2: 0}).setStroke("#000001");
                canvas[i].createLine({x1: 0,y1: 0,x2: 0,y2: canvasSize.height}).setStroke("#000001");
                canvas[i].createLine({x1: canvasSize.width,y1: 0,x2: canvasSize.width,y2: canvasSize.height}).setStroke("#000001");
                canvas[i].createLine({x1: 0,y1: canvasSize.height,x2: canvasSize.width,y2: canvasSize.height}).setStroke("#000001");
                
                if (markers) {
                    if (markers.visibility != false || markers.visibility === undefined) { //markers.visibility is not set if new marker was placed -> undefined
                        canvas[i].createImage({
                            x: ((canvasSize.width / map.size.w) * map.getPixelFromLonLat(markers.markers[0].lonlat).x) - 21/2, //multiplicator * xPosition - offset
                            y: ((canvasSize.height / map.size.h) * map.getPixelFromLonLat(markers.markers[0].lonlat).y) - 25, // multiplicator * yPosition - offset
                            width: 21,
                            height: 25,
                            src: "js/OpenLayers-2.12/img/marker.png"
                        });
                        
                        canvas[i].createText({ //set marker coordinates to bottom left
                            x: 5,
                            y: canvasSize.height - 5,
                            text: (markers.markers[0].lonlat.lon) + ", " + (markers.markers[0].lonlat.lat),
                            align: "start"
                        }).setFont({size: "9pt"}).setFill("black");
                    }
                }   
            }
            
            domConstruct.create("iframe", {
                id: "legendImage",
                style: "position:absolute; left: 650px; border:none; width:280px; height:280px;",        
                src: dom.byId("legend_image").src
            }, dom.byId("map1", doc));
            
            domConstruct.create("iframe", {
                id: "legendImage",
                style: "position:absolute; left: 650px; border:none; width:280px; height:280px;",        
                src: dom.byId("legend_image2").src
            }, dom.byId("map2", doc));
            
        } else {           
            canvas = gfx.createSurface(dom.byId('map', doc), canvasSize.width,canvasSize.height);
            
            for (var i = 0; i < tiles.length; i++)  {
                canvas.createImage({
                    x:      tiles[i].x * (canvasSize.width / map.size.w),
                    y:      tiles[i].y * (canvasSize.height / map.size.h),
                    width:  (canvasSize.width/map.size.w) * tiles[i].width,
                    height: (canvasSize.height/map.size.h) * tiles[i].height,
                    src:    tiles[i].url
                });
            }
        
            //frame
            canvas.createLine({x1: 0, y1: 0, x2: canvasSize.width, y2: 0}).setStroke("#000001");
            canvas.createLine({x1: 0, y1: 0, x2: 0, y2: canvasSize.height}).setStroke("#000001");
            canvas.createLine({x1: canvasSize.width, y1: 0, x2: canvasSize.width, y2: canvasSize.height}).setStroke("#000001");
            canvas.createLine({x1: 0, y1: canvasSize.height, x2: canvasSize.width, y2: canvasSize.height}).setStroke("#000001");
            
            if (markers) {
                if (markers.visibility != false || markers.visibility === undefined) { //markers.visibility is not set if new marker was placed -> undefined
                    canvas.createImage({
                        x: ((canvasSize.width/map.size.w) * map.getPixelFromLonLat(markers.markers[0].lonlat).x) - 21/2, //multiplicator * xPosition - offset
                        y: ((canvasSize.height/map.size.h) * map.getPixelFromLonLat(markers.markers[0].lonlat).y) - 25, //multiplicator * yPosition - offset
                        width: 21,
                        height: 25,
                        src: "js/OpenLayers-2.12/img/marker.png"
                    });  
                    
                    canvas.createText({ //set marker coordinates to bottom left
                        x: 5,
                        y: canvasSize.height - 5,
                        text: (markers.markers[0].lonlat.lon) + ", " + (markers.markers[0].lonlat.lat),
                        align: "start"
                    }).setFont({size: "9pt"}).setFill("black");
                }  
            }
            
            //set Legend Image
            domConstruct.create("iframe", {
                id: "legendImage",
                style: "position:absolute; left: 650px; border:none; width:280px; height:280px;",        
                src: dom.byId("legend_frame").src
            }, dom.byId("map", doc));       
        }
        
        if (markers) { 
            //var table = dojo.byId("feature_label").contentDocument.getElementsByTagName("table")[0];
        	var table = dojo.byId("feature_label").childNodes[0];
            if (table) { 
                getFeatureInfo();
            } else {
                console.log("PROBLEM");
            }
        }

        wmsDescription_Store.fetchItemByIdentity({
            identity: "serviceDescriptionParam",
            onItem: function(item, request){ service_JSON = item; }        
        });
        
        dom.byId("heading1", doc).innerHTML = "Name of this service: " + service_JSON.title[0];
        dom.byId("heading2", doc).innerHTML = "Abstract of this service: " + service_JSON.abstractText[0];
              
        if (hasTimeData){ // if timedata is available...
            if (combo) {
                dom.byId("time", doc).innerHTML = "<h3>Time Information</h3><p>" + registry.byId("stateSelect").get('value') + "</p>";
            } else
                dom.byId("time", doc).innerHTML = "<h3>Time Information</h3><p>" + registry.byId("fromDate_Input").get('value') + "</p>";       
        }
    });
        
    preview.onbeforeunload = destroyWidget; // window close event  
}


/**
 * This method destroys all dojo widgets and id's to prevent errors, 
 * caused by reopen the print preview window 
 */
function destroyWidget() {
    require(["dijit/registry","dojo/dom", "dojo/dom-construct"], function(registry, dom, domConstruct){
        registry.byId("printBTN", doc).destroyRecursive(); //print Button
        registry.byId("cancelBTN", doc).destroyRecursive(); // cancel Button
        
        //var table = dom.byId("featureInfo_frame").contentDocument.getElementsByTagName("table");
        var table = [ dojo.byId("feature_label").childNodes[0] ];
        
        if (table) {
            var lines;
            for (var count = 0; count < table.length; count++) {
                if (table[count].rows.length === 2) {
                    lines = table[count].rows[0].children.length - (table[count].rows[0].children.length % 9);
                    
                    if ((table[count].rows[0].children.length % 9) > 0) {
                        for (var i=0; i < lines + 1; i++) {
                            registry.byId("grid" + i + "_" + count, doc).destroyRecursive();
                            domConstruct.destroy("grid" + i + "_" + count, doc);
                        }
                    } else {
                        for (var i = 0; i < lines; i++) {
                            domConstruct.destroy("grid" + i + "_" + count, doc);
                            registry.byId("grid" + i + "_" + count, doc).destroyRecursive();
                        }
                    }        
                } else if (table[count].rows.length > 2) {
                    if (table[count].rows.length > 9) {
                        lines = (table[count].rows.length - (table[count].rows.length % 9))/9;
                    
                        for (var i = 0; i < lines + 1; i++) {
                            domConstruct.destroy("grid" + i + "_" + count, doc);
                            registry.byId("grid" + i + "_" + count, doc).destroyRecursive();
                        }
                    } else {
                        domConstruct.destroy("grid0_" + count, doc);
                        registry.byId("grid0_" + count, doc).destroyRecursive();                  
                    } 
                } else {
                    domConstruct.destroy("grid0_" + count, doc);
                    registry.byId("grid0_" + count, doc).destroyRecursive();
                }
            }
        }
    });
}


/**
 * getTiles Method is looking for drawn OpenLayers Maps and 
 * catches every tile from a visible layer
 * and saves them in a searchable structure
 * 
 */
function getTiles() {   
    if (document.getElementById("map2")!= null) {
        
        var data = {
            maps : [map, map2],
            vis_layer: [vis_layer_number, vis_layer_number2]        
        };
        tiles = [];
        for (var i=0; i<data.maps.length; i++) {
            tiles.push(i);
            var size = data.maps[i].getSize();
            var offsetX = parseInt(data.maps[i].layerContainerDiv.style.left);
            var offsetY = parseInt(data.maps[i].layerContainerDiv.style.top);
            
            for (var tilerow in data.maps[i].layers[data.vis_layer[i]].grid) {
                for (var tilei in data.maps[i].layers[data.vis_layer[i]].grid[tilerow]) {
                    var tile     = data.maps[i].layers[data.vis_layer[i]].grid[tilerow][tilei];
                    var url      = data.maps[i].layers[data.vis_layer[i]].getURL(tile.bounds);
                    var position = tile.position;
                    var tilexpos = position.x + offsetX;
                    var tileypos = position.y + offsetY;
                    var opacity  = data.maps[i].layers[data.vis_layer[i]].opacity ? parseInt(100*data.maps[i].layers[data.vis_layer[i]].opacity) : 100;
                    tiles[i] = [];
                    tiles[i].push({url:url, x:tilexpos, y:tileypos, opacity:opacity, width: tile.size.w, height: tile.size.h});
                }
            }
        }   
    } else {
        var size  = map.getSize();
        tiles = [];
        var offsetX = parseInt(map.layerContainerDiv.style.left);
        var offsetY = parseInt(map.layerContainerDiv.style.top);
     
        //2013-05-01 for + if hinzu; vis_layer_number -> i
        for (var i = 0; i < map.layers.length; i++) {
        	if (map.layers[i].visibility == true) {  
        		for (var tilerow in map.layers[i].grid) {
        			for (var tilei in map.layers[i].grid[tilerow]) {
        				var tile     = map.layers[i].grid[tilerow][tilei];
        				var url      = map.layers[i].getURL(tile.bounds);
        				var position = tile.position;
        				var tilexpos = position.x + offsetX;
        				var tileypos = position.y + offsetY;
        				var opacity  = map.layers[i].opacity ? parseInt(100*map.layers[i].opacity) : 100;
        				tiles.push({url:url, x:tilexpos, y:tileypos, opacity:opacity, width: tile.size.w, height: tile.size.h});
        			}
        		} 
        	}
        }  
    }
    
}

/**
 *  This method is looking for tables in featureInfo_frame and calls catchFeatureInfo method
 */
function getFeatureInfo() {
    require(["dojo/dom", "dojo/store/Memory", "dojo/dom-construct", "dojox/grid/DataGrid", "dojo/data/ObjectStore"], function(dom, Memory, domConstruct, DataGrid, ObjectStore){
        var table;
        
        domConstruct.create("h3", {
            innerHTML: "Feature Information",
            style: "text-align: left;"
        }, dom.byId("featureInfo", doc));
 
        //table = dojo.byId("feature_label").contentDocument.getElementsByTagName("table");
        table = [ dojo.byId("feature_label").childNodes[0] ];
        
        if (table) {
            for (var i = 0; i < table.length; i++) {
                catchFeatureInfo(table[i], i);
            } 
        }
    });
}

/**
 * catchFeatureInfo method uses table cell information and generates dataGrids (dojox/grid/DataGrid)
 * to display the feature information.
 * One Table row contains 9 cells. 
 * 
 * @param table - the table all feature information are taken from 
 * @param {type} count - table identification number
 */

function catchFeatureInfo(table, count) { 
    var head = [];
    var body = {};
    var json = [];
    var layout = [];
    var lines;
    
    require(["dojo/dom", "dojo/store/Memory", "dojo/dom-construct", "dojox/grid/DataGrid", "dojo/data/ObjectStore"], function(dom, Memory, domConstruct, DataGrid, ObjectStore) {      
        if (table.rows.length === 2) {
                if (table.rows[0].children.length > 9) {
                    lines = (table.rows[0].children.length - (table.rows[0].children.length % 9)) / 9;
     
                    for (var i = 0; i < lines; i++) {   
                        layout[i] = new Array(9);
                    
                        for (var e = 0; e < 9; e++) {
                            head.push(table.rows[0].children[(i*9)+e].innerHTML);
                            layout[i][e] = ({ name: head[(i*9)+e], field: head[(i*9)+e],styles: "text-align: center;",width: '100px'});
                            body[head[(i*9)+e]] = table.rows[1].children[(i*9)+e].innerHTML;
                        }
                    }
                
                    layout[lines] = new Array(table.rows[0].children.length % 9);
                
                    for (var i = 0; i < table.rows[0].children.length % 9; i++) {
                        head.push(table.rows[0].children[i+(lines*9)].innerHTML);
                        layout[lines][i] = ({ name: head[i+(lines*9)], field: head[i+(lines*9)],styles: "text-align: center;",width: '100px'});
                        body[head[i+(lines*9)]] = table.rows[1].children[i+(lines*9)].innerHTML;
                    }                    
                } else {
                    lines = 1;
                    layout[0] = new Array(table.rows[0].children.length);
                    
                    for (var e = 0; e < table.rows[1].children.length; e++) {
                        head.push(table.rows[0].children[e].innerHTML);
                        layout[0][e] = ({ name: head[e], field: head[e],styles: "text-align: center;",width: '100px'});
                        body[head[e]] = table.rows[1].children[e].innerHTML;
                    }
                }
                
                json.push(body);
                var memory = new Memory({
                    data : json
                });
                
                for (var i = 0; i < layout.length; i++) {
                    domConstruct.create("div", {
                        id: "grid" + i + "_" + count
                    }, dom.byId("featureInfo", doc));
                    
                    domConstruct.create("br",{
                        id: "grid" + i + "_" + count
                    }, dom.byId("featureInfo", doc));
                        
                    new DataGrid({
                        id: "grid" + i + "_" + count,
                        store : new ObjectStore({ objectStore: memory }),
                        structure: layout[i],
                        autoWidth: true,
                        autoHeight: true,
                        style: "font-size: 11px;"
                    }, dom.byId("grid" + i + "_" + count, doc)).startup();
                }
            } else if (table.rows.length > 2) {               
                 if (table.rows.lengt > 9) {
                     lines = (table.rows.length - (table.rows.length % 9)) / 9;                    
                     for (var i = 0; i < lines; i++) {                      
                         layout[i] = new Array(9);                       
                         for (var e = 0; e < 9; e++) {
                             head.push(table.rows[i].children[0].innerHTML);
                             layout[i][e] = ({ name: head[(i*9)+e], field: head[(i*9)+e],styles: "text-align: center;", width: '100px'});
                             body[head[(i*9)+e]] = table.rows[i].children[1].innerHTML;
                         }
                     }
                     
                     layout[lines] = new Array(table.rows.length % 9);
                     for (var i = 0; i < (table.rows.length % 9); i++) {
                         head.push(table.rows[i+(lines*9)].children[0].innerHTML);
                         layout[lines][i] = ({ name: head[i+(lines*9)], field: head[i+(lines*9)],styles: "text-align: center;", width: '100px'});
                         body[head[i+(lines*9)]] = table.rows[i+(lines*9)].children[1].innerHTML;
                     }                   
                 } else {
                     lines = 1;
                     layout[0] = new Array(table.rows.length);
                     
                     for (var i = 0; i < table.rows.length; i++) {
                         for (var e = 0; e < table.rows[i].children.length; e++) {
                             head.push(table.rows[i].children[0].innerHTML);
                             layout[0][i] = ({ name: head[(i*2)+e], field: head[(i*2)+e],styles: "text-align: center;", width: '100px'});
                             body[head[(i*2)+e]] = table.rows[i].children[1].innerHTML;
                         }
                     }
                 }
                 json.push(body);
                
                 var memory = new Memory({
                     data : json
                 });
                
                 for (var i = 0; i < layout.length; i++) {
                     domConstruct.create("div", {
                        id: "grid" + i + "_" + count
                     }, dom.byId("featureInfo", doc));
                     
                     domConstruct.create("br",{
                        id: "grid" + i + "_" + count
                     }, dom.byId("featureInfo", doc));
                     
                     new DataGrid({
                         id: "grid" + i + "_" + count,
                         store: new ObjectStore({ objectStore: memory}),
                         structure: layout[i],
                         autoWidth: true,
                         autoHeight: true,
                         style: "font-size: 11px;"
                     }, dom.byId("grid" + i + "_" + count, doc)).startup();
                 } 
             } else {
            	 lines = 1;
                 layout[0] = new Array(table.rows[0].children.length);
                 
                 for (var e = 0; e < table.rows[0].children.length; e++) {
                     //head.push(table.rows[0].children[e].innerHTML);
                	 head.push("Feature");
                     layout[0][e] = ({ name: head[e], field: head[e],styles: "text-align: center;",width: '600px'});
                     body[head[e]] = (table.rows[0].children[e].innerHTML.replace(/<br>/g, " ")).replace(/-/g, "");
                 }
                 
                 json.push(body);
                 var memory = new Memory({
                     data : json
                 });
                 
                 if (layout[0].length > 0) {
                     for (var i = 0; i < layout.length; i++) {
                         domConstruct.create("div", {
                             id: "grid" + i + "_"+count
                         }, dom.byId("featureInfo", doc));
                      
                         domConstruct.create("br", {
                             id: "grid" + i + "_"+count
                         }, dom.byId("featureInfo", doc));  
                      
                         new DataGrid({
                             id: "grid" + i + "_"+count,
                             store : new ObjectStore({ objectStore: memory }),
                             structure: layout[i],
                             autoWidth: true,
                             autoHeight: true,
                             style: "font-size: 11px;"
                         }, dom.byId("grid"+i+"_"+count, doc)).startup();
                     }
                 }
             }     
    });
}