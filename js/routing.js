/*
Routing.js
All route polyline and preview display.
 */

import { routeToRoom } from './databaselink.js';

const {L, map} = window;

let previewRouteLine = null;
let activeRouteLine = null;
let lastPreview = null;
let routeActive = false;

// route request as a PREVIEW. not active
export async function requestRoutePreview(fromLatLng, room, accessible = false) {
    clearPreviewRoute();

    const data = await routeToRoom({
        lat: fromLatLng[0],
        lon: fromLatLng[1],
        room,
        accessible
    });

    if (!data?.geometry || !Array.isArray(data.geometry)) {
        console.error("Invalid route response:", data);
        alert("Route could not be calculated.");
        return;
    }

    const geometry = data.geometry.map(p => [p.lat, p.lon]);

    //const geometry = data.geometry.map(p => [p.lat, p.lon]);

    previewRouteLine = L.polyline(geometry, {
        weight: 6,
        color: '#2563eb',
        opacity: 0.6,
        dashArray: '6,8'
    }).addTo(map);

    map.fitBounds(previewRouteLine.getBounds(), {padding: [40, 40]});

    lastPreview = {fromLatLng, room, accessible};
}

// activate route
export async function startRoute() {
    if(!lastPreview) return;

    clearPreviewRoute();
    clearActiveRoute();

    const {fromLatLng, room, accessible} = lastPreview;

    const data = await routeToRoom({
        lat: fromLatLng[0],
        lon: fromLatLng[1],
        room,
        accessible
    });

    if (!data?.geometry || !Array.isArray(data.geometry)) {
        console.error("Invalid route response:", data);
        alert("Route could not be calculated.");
        return;
    }

    const geometry = data.geometry.map(p => [p.lat, p.lon]);

    //const geometry = data.geometry.map(p => [p.lat, p.lon]);

    activeRouteLine = L.polyline(geometry, {
        weight: 6,
        color: '#2563eb'
    }).addTo(map);

    /*routeActive = true;

    if (window.isIndoorMode?.()) {
        hideBuildingMarkers();
    }*/
    map.fitBounds(activeRouteLine.getBounds(), {padding: [40,40]});
}

// clear preview route only
export function clearPreviewRoute() {
    if (previewRouteLine) {
        previewRouteLine.remove();
        previewRouteLine = null;
    }
}

// clear active route
export function clearActiveRoute() {
    if (activeRouteLine) {
        activeRouteLine.remove();
        activeRouteLine = null;
    }
    /*routeActive = false;
    showBuildingMarkers?.();*/
}