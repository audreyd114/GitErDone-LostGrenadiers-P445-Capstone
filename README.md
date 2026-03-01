# GitErDone-LostGrenadiers-P445-Capstone
## Lost Grenadiers - IUS Campus Navigation App
Lost Grenadiers is a student-focused navigation platform designed to help anyone at Indiana University Southeast find their way around campus with ease. Built as a senior capstone project, the application combines OpenStreetMap data, campus-specific GIS layers, and intelligent routing services to provide walking direction, points of interest, accessibility options, and building information through a modern and intuitive web interface. \
The project is currently under development and uses a full geospatial backend powered by PostgeSQL, PostGIS, pgRouting, QGIS, and a Flask-based web server.

### Features
- Interactive web map built with Leaflet
- OpenStreetMap raster tiles for basemap display
- Backend server using Flask
- Spatial database using PostgreSQL + PostGIS
- Route generation using pgRouting
- Deployment environment using Proxmox VE
- SSL certificates managed with Let’s Encrypt
- GIS workflow and data processing handled through QGIS

### Installation
No installation needed. Just visit our website at: https://www.lostgrenadiers.org

### Current Status
You can route to any of the main 10 buildings on campus and you can route to the 5 dorms.
Indoor implementation is functional for Life Science, Physical Science, and Crestview Hall.

### Acknowledgments
This project uses open-source tools from the GIS and web-mapping community. Big thanks to the maintainers of Flask, Leaflet, PostgreSQL/PostGIS, pgRouting, and OpenStreetMap.