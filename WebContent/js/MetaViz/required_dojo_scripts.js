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

dojo.require("dojo.data.ItemFileReadStore");  //loading item file store scripts
dojo.require("dojox.fx");                     //animation of content (fading, ...)
dojo.require("dojox.gfx._base");              //lines
dojo.require("dojox.gfx3d.object");           //needed for line
dojo.require("dojox.gfx.shape");              //shape to put lines in
dojo.require("dijit.Tooltip");
dojo.require("dojox.grid.EnhancedGrid"); 
dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("dojox.grid.DataGrid"); 
  