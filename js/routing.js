/*
Routing.js
All route polyline and preview display.
 */

import { getFullRoute } from './databaselink.js';

const {L, map} = window;

let previewRouteLine = null;
let activeRouteLine = null;
let lastPreview = null;
let lastRouteMeta = null;

// route request as a PREVIEW. not active
export async function requestRoutePreview(fromLatLng, room, accessibleMode) {
    clearAllRoutes();

    const data = await getFullRoute({
        lat: fromLatLng[0],
        lon: fromLatLng[1],
        room,
        accessibleMode
    });

    /*
    if (!data.found || !Array.isArray(data.path)) {
        console.error("Invalid route response:", data);
        return;
    }*/
    if (!data?.found || !Array.isArray(data.route)) {
        console.error("Invalid route response:", data);
        return;
    }

    // Combine segments for preview
    const route = Array.isArray(data.route) ? data.route : [];

    // Destructure
    const [
        toBuilding = [],
        toRoom = [],
        entryFloor = null,
        minutes = null
    ] = route;

    // Combine only the coordinate arrays
    const fullGeometry = [...toBuilding, ...toRoom]
        .filter(p => p?.lat !== undefined && p?.lon !== undefined)
        .map(p => [p.lat, p.lon]);

    // Store metadata for UI
    lastRouteMeta = {
        entryFloor,
        minutes};

        console.log("Entry floor:", entryFloor);
    console.log("Route minutes:", minutes);

    previewRouteLine = L.polyline(fullGeometry, {
        weight: 6,
        color: '#2563eb',
        opacity: 0.6,
        dashArray: '6,8'
    }).addTo(map);

    map.fitBounds(previewRouteLine.getBounds(), {
        padding: [80, 80],
        maxZoom: 18
    });


    lastPreview = {fromLatLng, room, accessibleMode};
}

// activate route
export async function startRoute() {
    if(!lastPreview) return;

    clearPreviewRoute();
    clearActiveRoute();

    const {fromLatLng, room, accessibleMode} = lastPreview;

    const data = await getFullRoute({
        lat: fromLatLng[0],
        lon: fromLatLng[1],
        room,
        accessibleMode
    });

    /*if (!data?.found || !Array.isArray(data.path)) {
        console.error("Invalid route response:", data);
        return;
    }*/

    if (!data?.found || !Array.isArray(data.route)) {
        console.error("Invalid route response:", data);
        return;
    }

    const route = Array.isArray(data.route) ? data.route : [];

    // Destructure
    const [
        toBuilding = [],
        toRoom = [],
        entryFloor = null,
        minutes = null
    ] = route;

    // Combine only the coordinate arrays
    const fullGeometry = [...toBuilding, ...toRoom]
        .filter(p => p?.lat !== undefined && p?.lon !== undefined)
        .map(p => [p.lat, p.lon]);

    console.log("Entry floor:", entryFloor);
    console.log("Route minutes:", minutes);

    if (entryFloor !== null && window.setIndoorFloor) {
        window.setIndoorFloor(entryFloor);
    }

    activeRouteLine = L.polyline(fullGeometry, {
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

export function clearAllRoutes() {
    clearPreviewRoute();
    clearActiveRoute();
    lastPreview = null;
}

export function getLastRouteMeta() {
    return lastRouteMeta;
}
