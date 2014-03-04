GeoMetaFacet
============

GeoMetaFacet is a web client to explore and visualize geodata and metadata.

Structure
------------------------

GeoMetaFacet is written in Javascript and Java. The modules and their functionality are briefly described here.

WebContent - Browser part of the application (Javascript) <br> 
gmf - HSQL database (implemented as file, filled with inital data)<br>
src - Server components of the application (Java)<br>
<ul>
<li>
geometafacet - core scripts (filling database, evaluating metadata xml documents) + helper classes
</li>
<li>
heatmap - test implementation of storing user interactions (mouse clicks) and visualize as heatmap (not needed for discovery of geodata). Implemented as servlet.
</li>
<li>
metaviz - implementation of interactive lineage graph. Scripts for metadata xml evaluation, metadata requests (<b>needs further CSW or DB connection</b>). Implemented as servlet.
</li>
<li>
time4maps - implementation of WMS request for time-variate data visualization. Scripts for requesting and evaluating WMS capabilities documents. Implemented as servlet.
</li>
</ul>

Map client (Time4Maps) and lineage graph (MetaViz) can be used as standalone implementations via parameterized calls.

Installation
------------------------

The basic installation steps are
<ul>
<li>Download code form GitHub https://github.com/52North/GeoMetaFacet.git</li>
<li>Deploy the web archives in a servlet container (e.g. Apache Tomcat)</li>
<li>Configure CSW connection (see below)</li>
<li>Start application in web browser - ../GeoMetaFacet/index.html</li>
</ul>

Configuration
------------------------

The lineage graph implementation and the generation of the internal used HSQL database need a CSW, database or file connection to request metadata, such as lineage data.
The configuration can be set in .../src/tud/geometafacet/helper/Constants.java. The following parameters has to be set:
If you do not set the metaviz parameter, the application will run normally, but you are not able to call the lineage graph (from metadata details section)
The parameter for the database generation are only needed, if you want to use your own metadata. Otherwise, you do not have to set these params and use the given metadata examples (see folder gmf).

<ul>
<li>cswURL - used in tud.metaviz.cnnection.csw.CSWConnection (for lineage graph in csw mode) - should look like this: http://yourdomain/soapServices/CSWStartup</li>
<li>dbEndpoint - used in tud.geometafacet.controlling.RequestControllingJDBC (for db generation) - should look like this: http://yourdomain/username</li>
<li>jdbcURL - used in tud.metaviz.connection.db.JDBCConnection (for lineage graph in db mode) - should look like this: jdbc:postgresql://databaseurl/username</li>
<li>dbUser - used in tud.metaviz.connection.db.JDBCConnection (for lineage graph in db mode) - database user</li>
<li>dbPasswd - used in tud.metaviz.connection.db.JDBCConnection (for lineage graph in db mode) - password of database user</li>
</ul

Javascript Libraries
------------------------
The website module uses a collection of Javascript libraries: <br>
 <br>
Simile Exhibit 3.0 (modified scripts by TUD-GIS), https://github.com/simile-widgets/exhibit/blob/master/LICENSE.txt - MIT License <br>
  jQuery, https://jquery.org/license/ - MIT License <br>
  LAB.js, http://labjs.com/ - MIT License <br>
Dojo 1.9, https://github.com/dojo/dojo/blob/master/LICENSE - BSD License or Academic Free License <br>
Openlayers 2, http://trac.osgeo.org/openlayers/wiki/Licensing - Modified BSD License <br>
JSON2.js - https://github.com/douglascrockford/JSON - js/blob/master/json2.js <br>
heatmap.js - https://github.com/pa7/heatmap.js - MIT License

Java Libraries
------------------------
The server component uses a collection of Java libraries: <br>
 <br>
commons-fileupload-1.2.2 - Apache License <br>
commons-io-2.4 - Apache License <br>
commons-logging-1.1.1 - Apache License <br>
ct-catalog-client-api-3.0.0 - Apache License <br>
hsqldb, http://hsqldb.org/web/hsqlLicense.html - Modified BSD License  <br>
httpclient-4.1.1 - Apache License <br>
httpcore-4.1 - Apache License <br>
jackson-all.1.8.2, http://docs.codehaus.org/display/JACKSON/Home - Apache License <br>
jdom, https://github.com/hunterhacker/jdom/blob/master/LICENSE.txt  <br>
joda-time-1.6.2, http://joda-time.sourceforge.net/license.html - Apache License <br>
jsf-api/jsf-impl/jstl 
postgresql-9.1-902.jdbc4, http://www.postgresql.org/download/products/2-drivers-and-interfaces/ - Open source
servlet-api - Apache License

License
------------------------
Will be updated soon

Contact
------------------------
Will be updated soon
