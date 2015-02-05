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
 * This javascript file contains source code for clustering boundingboxes on the map.
 * The boxes are clustered by neighborhood and box size.
 *
 * @author Hannes Tressel. Professorship of Geoinformation Systems
 */
var clusterStore = null;

function createCluster(feature, vectorLayer) {
    clusterStore.put({
        count: 1,
        centerLon: feature.centerLon,
        centerLat: feature.centerLat
    });

    var feature = new ol.Feature({
        geometry: new ol.geom.LineString(feature.coordinates),
        properties: {
            id: feature.id,
            extent: feature.extent,
            extent_: feature.extent_
        }
    });

    map2.getLayers().array_[vectorLayer].getSource().addFeature(feature);
}

function Cluster(featureStore, resolution, extent, vectorLayer, threshold, areaThreshold) {
    require(["dojo/store/Memory"], function(Memory) {

        if (clusterStore != null) {
            featureStore.query({
                isClustered: true
            }).forEach(function(obj) {
                obj.isClustered = false;
            });
            removeAllFeatures(vectorLayer);
        }



        clusterStore = new Memory();
        featureStore.query({
            isClustered: false
        }).forEach(function(obj) {
            if (ol.extent.containsExtent(extent, obj.extent_)) {
                if (obj.area >= areaThreshold.min && obj.area <= areaThreshold.max) {
                    clusterStore.query(function(cluster) {
                        var d = Math.sqrt(Math.pow(obj.centerLon - cluster.centerLon, 2) + Math.pow(obj.centerLat - cluster.centerLat, 2)) / resolution;
                        if (d <= threshold)
                            obj.isClustered = true;
                    });

                    if (!obj.isClustered) {
                        createCluster(obj, vectorLayer);
                        obj.isClustered = true;
                    }
                } else {
                    var feature = new ol.Feature({
                        geometry: new ol.geom.LineString(obj.coordinates),
                        properties: {
                            id: obj.id,
                            extent: obj.extent,
                            extent_: obj.extent_
                        }
                    });

                    map2.getLayers().array_[vectorLayer].getSource().addFeature(feature);
                }
            }
        });

    });
}

function removeAllFeatures(vectorLayer) {
    //Clear Cache + Remove Displayed Features
    map2.getLayers().array_[vectorLayer].getSource().rBush_.clear();
    map2.getLayers().array_[vectorLayer].getSource().rBush_ = new ol.structs.RBush();
    // Redraw Map
    map2.updateSize();
}