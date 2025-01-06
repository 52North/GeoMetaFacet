# ARCHIVED

This project is no longer maintained and will not receive any further updates. If you plan to continue using it, please be aware that future security issues will not be addressed.

# GeoMetaFacet

GeoMetaFacet  is a web client to explore and visualize geodata. It focuses on a user-friendly and interactive navigation through the metadata and allows the user to quickly get an overview of available data.
 
Core features of GeoMetaFacet are an interactive data lineage graph and a hierarchy tree, which can be used to evaluate available data. Furthermore several map functionalities, e.g. time series data visualization, geographic search with gazetteer Geonames are integrated into the web client.

Further information can be found at: http://52north.org/communities/metadata-management/gmf

Live demo is available at: http://geoportal.glues.geo.tu-dresden.de:8080/GeoMetaFacet/index.html

## Structure

GeoMetaFacet is written in Javascript and Java. The modules and their functionality are briefly described here.

* ``/WebContent`` - Browser part of the application (Javascript) 
* ``/gmf`` - HSQL database (implemented as file, filled with inital data)
* ``/src`` - Server components of the application (Java)
  * ``/geometafacet`` - core scripts (filling database, evaluating metadata xml documents) + helper classes
  * ``/heatmap`` - test implementation of storing user interactions (mouse clicks) and visualize as heatmap (not needed for discovery of geodata). Implemented as servlet.
  * ``/metaviz`` - implementation of interactive lineage graph. Scripts for metadata xml evaluation, metadata requests (**needs further CSW or DB connection**). Implemented as servlet.
  * ``/time4maps`` - implementation of WMS request for time-variate data visualization. Scripts for requesting and evaluating WMS capabilities documents. Implemented as servlet.

Map client (Time4Maps) and lineage graph (MetaViz) can be used as standalone implementations via parameterized calls.

## Installation

The basic installation steps are
* Download code form GitHub: ``git clone https://github.com/52North/GeoMetaFacet.git``
* Configure CSW connection (see below)
* Deploy the web archives in a servlet container (e.g. Apache Tomcat)
* Start application in web browser - e.g. http://localhost:8080/GeoMetaFacet/index.html

## Configuration

For the generation of the internal used HSQL database you need a CSW, database or file connection to request metadata, such as lineage data. The configuration can be set in ``.../src/tud/geometafacet/helper/Constants.java``. 
The parameters for the database generation are only needed, if you want to use your own metadata. Otherwise, you do not have to set these params and use the given metadata examples (see folder ``gmf``).

* ``cswURL`` - used in tud.metaviz.cnnection.csw.CSWConnection (for lineage graph in csw mode) - should look like this: http://yourdomain/soapServices/CSWStartup
* ``dbEndpoint`` - used in tud.geometafacet.controlling.RequestControllingJDBC (for db generation) - should look like this: http://yourdomain/username
* ``jdbcURL`` - used in tud.metaviz.connection.db.JDBCConnection (for lineage graph in db mode) - should look like this: ``jdbc:postgresql://databaseurl/username``
* ``dbUser`` - used in tud.metaviz.connection.db.JDBCConnection (for lineage graph in db mode) - database user
* ``dbPasswd`` - used in tud.metaviz.connection.db.JDBCConnection (for lineage graph in db mode) - password of database user

## Javascript Libraries

The website module uses a collection of Javascript libraries:

* Simile Exhibit 3.0 (modified scripts by TUD-GIS), https://github.com/simile-widgets/exhibit/blob/master/LICENSE.txt - MIT License
* jQuery, https://jquery.org/license/ - MIT License
* LAB.js, http://labjs.com/ - MIT License
* Dojo 1.9, https://github.com/dojo/dojo/blob/master/LICENSE - BSD License or Academic Free License
* Openlayers 3, http://trac.osgeo.org/openlayers/wiki/Licensing - Modified BSD License
* JSON2.js, https://github.com/douglascrockford/JSON-js/blob/master/json2.js - Public domain
* heatmap.js, https://github.com/pa7/heatmap.js - MIT License
* pure-min.css, https://github.com/yui/pure/blob/master/LICENSE.md - BSD License

## Java Libraries

The server component uses a collection of Java libraries:

* commons-fileupload-1.2.2 - Apache License
* commons-io-2.4 - Apache License
* commons-logging-1.1.1 - Apache License
* ct-catalog-client-api-3.0.0 - Apache License
* hsqldb, http://hsqldb.org/web/hsqlLicense.html - Modified BSD License
* httpclient-4.1.1 - Apache License
* httpcore-4.1 - Apache License
* jackson-all.1.8.2, http://docs.codehaus.org/display/JACKSON/Home - Apache License
* jdom, https://github.com/hunterhacker/jdom/blob/master/LICENSE.txt
* joda-time-1.6.2, http://joda-time.sourceforge.net/license.html - Apache License
* postgresql-9.1-902.jdbc4, http://www.postgresql.org/download/products/2-drivers-and-interfaces/ - Open source
* servlet-api - Apache License

## License

The GeoMetaFacet project is licensed under The Apache Software License, Version 2.0

## Contact

Christin Henzen (christin.henzen@tu-dresden.de)

**Support:** Metadatada management community mailing list, see http://metadata.forum.52north.org/
