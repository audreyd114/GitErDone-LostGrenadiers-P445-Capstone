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
No installation needed. Just visit our website at: (TODO)

### Current Status
The backend routing logic and full UI are still in development. The map loads correctly, and the project is progressing toward producing turn-by-turn navigation everywhere the route network supports it.

### Acknowledgments
This project uses open-source tools from the GIS and web-mapping community. Big thanks to the maintainers of Flask, Leaflet, PostgreSQL/PostGIS, pgRouting, and OpenStreetMap.
