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

package tud.time4maps.objects;
 
import org.joda.time.DateTime;
import org.joda.time.Period;

/**  
 * This class helps to store wms, layer and time information. The structure given here is used by the class JsonObjectBuilder to create a JSON object.
 * @see JsonObjectBuilder
 *   
 * @author Christin Henzen, Daniel Kadner. Professorship of Geoinformation Systems
 *  
 */  
public class JsonContainer {
	
public static class ServiceDescription {
		
		private String paramName;		
		private String name;
		private String title;
		private String abstractText;
		
		private String url;
		private String version;
		private String format;
		private String srs;
		
		public String getParamName() { return paramName; }
		public String getName() { return name; }
		public String getTitle() { return title; }
		public String getAbstractText() { return abstractText; }
		
		public String getUrl() { return url; }
		public String getVersion() { return version; }
		public String getFormat() { return format; }
		public String getSrs() { return srs; }
		
		public void setParamName(String paramName) { this.paramName = paramName; }
		public void setName(String name) { this.name = name; }
		public void setTitle(String title) { this.title = title; }
		public void setAbstractText(String abstractText) { this.abstractText = abstractText; }
		
		public void setUrl(String url) { this.url = url; }
		public void setVersion(String version) { this.version = version; }
		public void setFormat(String format) { this.format = format; }
		public void setSrs(String srs) { this.srs = srs; }		
	}
	
	public static class LayerDescription {
		
		private String paramName;		
		private String[] name;
		private String title;
		private String abstractText;
		
		public String getParamName() { return paramName; }
		public String[] getName() { return name; }
		public String getTitle() { return title; }
		public String getAbstractText() { return abstractText; }
		
		public void setParamName(String paramName) { this.paramName = paramName; }
		public void setName(String[] name) { this.name = name; }
		public void setTitle(String title) { this.title = title; }
		public void setAbstractText(String abstractText) { this.abstractText = abstractText; }		
	}
	
	public static class Legend {
		
		private String paramName;
		private String[] url;
		private String format; 
		private Integer height;
		private Integer width;
		
		public String getParamName() { return paramName; }
		public String[] getUrl() { return url; }
		public String getFormat() { return format; }
		public Integer getHeight() { return height; }
		public Integer getWidth() { return width; }
		
		public void setParamName(String paramName) { this.paramName = paramName; }
		public void setUrl(String[] url) { this.url = url; }
		public void setFormat(String format) { this.format = format; }
		public void setHeight(Integer height) { this.height = height; }
		public void setWidth(Integer width) { this.width = width; }		
	}
	
	public class Time {

		private String paramName;
		private DateTime start;
		private DateTime end;
		private DateTime def; //default
		private Period period; 
		
		public String getParamName() { return paramName; }
		public DateTime getStart() { return start; }
		public DateTime getEnd() { return end; }
		public DateTime getDef() { return def; }
		public Period getPeriod() { return period; }
		
		public void setParamName(String paramName) { this.paramName = paramName; }
		public void setStart(DateTime start) { this.start = start; }
		public void setEnd(DateTime end) { this.end = end; }
		public void setDef(DateTime def) { this.def = def; }
		public void setPeriod(Period period) { this.period = period; }	
	}
	
	public static class Layer {
		
		private String paramName;
		private LayerDescription description;
		private Legend legend;
		private Time time;
		
		public String getParamName() { return paramName; }
		public LayerDescription getDescription() { return description; }
		public Legend getLegend() { return legend; }
		public Time getTime() { return time; }
		 
		public void setParamName(String paramName) { this.paramName = paramName; }
		public void setDescription(LayerDescription description) { this.description = description; }
		public void setLegend(Legend legend) { this.legend = legend; }
		public void setTime(Time time) { this.time = time; }		
	}
	
	private LayerDescription layer;
	private ServiceDescription service; 
	
	/* getter */
	public LayerDescription getLayer() { return layer; }
	public ServiceDescription getService() { return service; } 
	
	/* setter */
	public void setLayer(LayerDescription layer) { this.layer = layer; }
	public void setService(ServiceDescription service) { this.service = service; } 
}
