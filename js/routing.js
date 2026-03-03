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

let segmentToBuilding = null;
let segmentToStairs = null;
let segmentFinal = null;

let currentRouteSegments = null;
let activeIndoorPolyline = null;

function parseRouteArray(routeArray) {
    if (!Array.isArray(routeArray) || routeArray.length < 5) {
        console.error("Unexpected route array format:", routeArray);
        return null;
    }

    const [
        routeToBuilding = [],
        routeToStairs = [],
        finalRouteSegment = [],
        entryFloor = null,
        minutes = null
    ] = routeArray;

    return {
        routeToBuilding: Array.isArray(routeToBuilding) ? routeToBuilding : [],
        routeToStairs: Array.isArray(routeToStairs) ? routeToStairs : [],
        finalRouteSegment: Array.isArray(finalRouteSegment) ? finalRouteSegment : [],
        entryFloor: typeof entryFloor === "number" ? entryFloor : null,
        minutes: typeof minutes === "number" ? minutes : null
    };
}

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

    const parsed = parseRouteArray(data.route);
    if (!parsed) return;

    const {
        routeToBuilding,
        routeToStairs,
        finalRouteSegment,
        entryFloor,
        minutes
    } = parsed;

    const fullGeometry = [
        ...routeToBuilding,
        ...routeToStairs,
        ...finalRouteSegment
    ]
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

    const parsed = parseRouteArray(data.route);
    if (!parsed) return;

    const {
        routeToBuilding,
        routeToStairs,
        finalRouteSegment,
        entryFloor,
        minutes
    } = parsed;

    currentRouteSegments = {
        routeToBuilding,
        routeToStairs,
        finalRouteSegment,
        entryFloor,
        minutes
    };

    // Draw only outdoor segment first
    if (routeToBuilding.length > 0) {
        segmentToBuilding = L.polyline(
            routeToBuilding.map(p => [p.lat, p.lon]),
            { weight: 6, color: '#2563eb' }
        ).addTo(map);

        map.fitBounds(segmentToBuilding.getBounds(), { padding: [40, 40] });
    }

    console.log("Entry floor:", entryFloor);
    console.log("Route minutes:", minutes);

    /*
    if (entryFloor !== null && window.setIndoorFloor) {
        window.setIndoorFloor(entryFloor);
    }*/

    /*activeRouteLine = L.polyline(fullGeometry, {
        weight: 6,
        color: '#2563eb'
    }).addTo(map);

    map.fitBounds(activeRouteLine.getBounds(), {padding: [40,40]});*/
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
    if (segmentToBuilding) {
        segmentToBuilding.remove();
        segmentToBuilding = null;
    }
    if (activeIndoorPolyline) {
        map.removeLayer(activeIndoorPolyline);
        activeIndoorPolyline = null;
    }

    currentRouteSegments = null;
}
/*
export function handleIndoorModeActivated() {
    if (!currentRouteSegments) return;

    const { routeToStairs, finalRouteSegment, entryFloor } = currentRouteSegments;

    drawIndoorSegment(entryFloor);
}*/

export function handleFloorSelected(selectedFloor) {
    if (!currentRouteSegments) return;

    drawIndoorSegment(selectedFloor);
}

function drawIndoorSegment(selectedFloor) {
    if (!currentRouteSegments) return;

    const {
        routeToStairs,
        finalRouteSegment,
        entryFloor
    } = currentRouteSegments;

    // Always clear previous indoor line
    if (activeIndoorPolyline) {
        map.removeLayer(activeIndoorPolyline);
        activeIndoorPolyline = null;
    }

    let segmentToDraw = [];

    const hasStairs = routeToStairs.length > 0;

    if (!hasStairs) {
        // SAME FLOOR ROUTE
        if (selectedFloor === entryFloor) {
            segmentToDraw = finalRouteSegment;
        }
    } else {
        // MULTI FLOOR ROUTE
        if (selectedFloor === entryFloor) {
            segmentToDraw = routeToStairs;
        } else {
            segmentToDraw = finalRouteSegment;
        }
    }

    if (!segmentToDraw.length) return;

    activeIndoorPolyline = L.polyline(
        segmentToDraw.map(p => [p.lat, p.lon]),
        { weight: 6, color: '#2563eb' }
    ).addTo(map);
}

export function clearAllRoutes() {
    clearPreviewRoute();
    clearActiveRoute();
    lastPreview = null;
}

export function getLastRouteMeta() {
    return lastRouteMeta;
}

export function getActiveRouteEntryFloor() {
    return currentRouteSegments?.entryFloor ?? null;
}