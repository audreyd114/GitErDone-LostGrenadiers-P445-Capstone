/*
MapInit.js
Responsible for creating the Leaflet map, tile layers, and basic map setup
 */

// Basic map + UI skeleton for Lost Grenadiers
// This file is intentionally dependency-light. When backend and routing libs are ready:
//  - Replace mockRoute() with a call to the backend /api/route
//  - Optionally add leaflet-routing-machine or pgrouting-based tile/layer

window.map = L.map('map', {zoomControl:true}).setView([38.34505, -85.81951], 17); // IUS

// OpenStreetMap baselayer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    maxZoom: 20,
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Layers for indoor/outdoor
const indoorLayer = L.layerGroup();
const outdoorLayer = L.layerGroup().addTo(map);

// User position marker and heading
let userMarker = null;
let userHeading = null;
let follow = false;

// Use browser geolocation watch
let watchId = null;