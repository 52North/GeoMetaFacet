require([ "dojo/_base/window", "dojo/data/ItemFileReadStore", "dijit/tree/ForestStoreModel", "dijit/Tree", "dojo/Deferred", "dojo/domReady!"], 
	
		/**
		 * Method to generate hierarchy tree.
		 */
		function (win, Ifrs, ForestStoreModel, Tree, Deferred) {
		dojo.extend(Tree, {
			getRootId: function() {
				if (this.model.store._arrayOfAllItems[0] != undefined) {
					var root = this.model.store._arrayOfAllItems[0].id;
					return root;
				}  
			}, 
			resetPath: function(path) {
				if (path != null) {  
					path.unshift("root");
					this.set('path', path ); 
					this.scroll(path); 
				}
			},
			scroll: function(path) {
			var deferred = new Deferred();
				if (path != null) { 
					setTimeout(function(){ deferred.resolve({ called:true }); }, 100);
					deferred.then(function() {
						var itemnode = this._itemNodesMap[path[path.length-1]];
						this.focusNode(itemnode[0]);
					});				 
				}			
			}, 
			
			reload: function (data) {
				// Destructs the references to any selected nodes so that 
				// the refreshed tree will not attempt to unselect destructed nodes
				// when a new selection is made.
				// These references are contained in Tree.selectedItem,
				// Tree.selectedItems, Tree.selectedNode, and Tree.selectedNodes.
				this.dndController.selectNone();
				this.model.store.clearOnClose = true;
				this.model.store.close();

				// Completely delete every node from the dijit.Tree     
				this._itemNodesMap = {};
				this.rootNode.state = "UNCHECKED";
				this.model.root.children = null;

				// Destroy the widget
				this.rootNode.destroyRecursive();

				var _data  = { identifier: "id", label: "label", items: data };
				var _store = new Ifrs({ data: _data });
				var _treeModel = new ForestStoreModel({
					store: _store,
					rootId:"root",
					rootLabel:"Things",
					childrenAttrs:["treeChildren"]
				});
				// Recreate the model, (with the model again)
				this.model.constructor(_treeModel);

				// Rebuild the tree
				this.postMixInProperties();
				this._load();					 
			}
		});	
	
		var myItems = [];
		var data  = { identifier: "id", label: "label", items: myItems };
		var store = new Ifrs({data:data});	
		var treeModel = new ForestStoreModel ({
	        store: store,
	        rootId:"root",
	        rootLabel:"Things",
	        childrenAttrs:["treeChildren"]
	    });
		
		var tree_obj = new Tree ({
			model: treeModel,
			showRoot:false,
		}, "myTree");
 
		//when item is clicked reload tree with new item
		//reset details view, scroll to dataset in result list and 
		//reset map function
		dojo.connect(tree_obj, 'onClick', function(item, node, evt) { 
			if (heatmap)
				addFacetClick(evt);
			
			time4Maps.hideTime4Maps();
			metaViz.hideMetaViz();
			guiFunctions.showMap();
			guiFunctions.scrollToSpecificPoint(item.id);
			guiFunctions.setTabularView(item.id);
			guiFunctions.setGeneralMetaData(item.id); 
		});
}); 		    