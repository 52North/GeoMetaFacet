
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