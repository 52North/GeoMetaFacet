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

var hidePreloader = function() {
	if (dojo.byId("preloader") != null) {
		// This really hides the preloader
		var hide = function(){
			dojo.fadeOut({
				node: "preloader",
				duration: 200,
				onEnd: function(){								
					dojo.style("preloader", "display", "none");	
				}
			}).play();
		};
	
		// Set a timeout to ensure the preloader is visible. 
		setTimeout(hide, 100);
	}
};
 
function showPreloader() {
	if (dojo.byId("preloader") != null) {
		// Show the preloader centered in the viewport		
		var ps = dojo.position('preloaderContent');
		var ws = dojo.window.getBox(); 
		dojo.style("preloaderContent", "top" , (ws.h/2-ps.h/2) + "px");
		dojo.style("preloaderContent", "left", (ws.w/2-ps.w/2) + "px");
		dojo.style("preloaderContent", "visibility" , "visible");
		dojo.style("preloader", "opacity", "1");
		dojo.style("preloader", "display", "block");
	}
}