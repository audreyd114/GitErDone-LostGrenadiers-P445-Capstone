/*
Routing.js
All route calculation, polyline, and step display.
 */

// Simple mock route (replace with backend call)

import { getRoute } from './getMockRoute.js';

let previewRouteLine = null;
let activeRouteLine = null;
let routeActive = false;

// route request as a PREVIEW. not active
function requestRoutePreview(from, destinationRoom = '') {
    const rawPoints = getRoute(from[0], from[1], destinationRoom);

    const geometry = rawPoints.map(p => [p.lat, p.lon]);

    showPreviewRoute(geometry);

    // Ask user to approve route
    showApproveRouteModal({
        startLabel: 'Your Location',
        endLabel: destinationRoom || 'Destination'
    });
}

// preview route
function showPreviewRoute(latlngs) {
    clearPreviewRoute();

    previewRouteLine = L.polyline(latlngs, {
        weight: 6,
        color: '#2563eb',
        opacity: 0.6,
        dashArray: '6,8'
    }).addTo(map);

    map.fitBounds(previewRouteLine.getBounds(), { padding: [40, 40] });
}

function showApproveRouteModal({ startLabel, endLabel }) {
    showModal({
        title: "Start Route?",
        message:
            `You're about to start navigation.\n\nFrom: ${startLabel}\nTo: ${endLabel}`,
        confirmText: "Start",
        cancelText: "Cancel",
        onConfirm: () => {
            console.log("Route approved!");
            // Later:
            // routeActive = true;
            // startNavigation();
            startRoute();
        },
        onCancel: () => {
            clearPreviewRoute();
        }
    });
  /*  modalCancelBtn.onclick = () => {
        clearPreviewRoute();
        closeModal();
    }*/
}

function clearPreviewRoute() {
    if (previewRouteLine) {
        map.removeLayer(previewRouteLine);
        previewRouteLine = null;
    }
}

// activate route
function startRoute() {
    if (!previewRouteLine) return;

    routeActive = true;

    activeRouteLine = previewRouteLine;
    previewRouteLine = null;

    activeRouteLine.setStyle({
        opacity: 1,
        dashArray: null
    });

    if (window.isIndoorMode?.()) {
        hideBuildingMarkers();
    }

    console.log('Route started');
}

// clear route
function clearRoute() {
    clearPreviewRoute();

    if (activeRouteLine) {
        map.removeLayer(activeRouteLine);
        activeRouteLine = null;
    }

    routeActive = false;
    showBuildingMarkers();

    console.log('Route cleared');
}

// dev/test hooks
document.getElementById('mockRouteBtn').addEventListener('click', () => {
    const center = map.getCenter();

    requestRoutePreview(
        [center.lat, center.lng],
        'TEST_ROOM'
    );
});

document.getElementById('clearBtn')
    ?.addEventListener('click', clearRoute);

export {
    requestRoutePreview,
    startRoute,
    clearRoute
};

/*
let routeLayer = null;
let routeActive = false;

function requestRoute(from, to, destinationRoom = '') {
    routeActive = true;

    if (indoorMode) {
        hideBuildingMarkers();
    }
    // Call teammate mock function
    const rawPoints = getRoute(from[0], from[1], destinationRoom);

    // Convert to Leaflet-friendly format
    const geometry = rawPoints.map(p => [p.lat, p.lon]);

    // Temporary UI steps (static for now)
    const steps = geometry.map((pt, i) => ({
        text: `Continue to point ${i + 1}`
    }));

    drawRoute({
        geometry,
        steps
    });
}


function drawRoute(route){
    if(routeLayer) routeLayer.remove();
    routeLayer = L.polyline(route.geometry, {weight:6, color: '#2563eb', lineJoin: 'round'}).addTo(map);
    map.fitBounds(routeLayer.getBounds(), {padding:[40,40]});
}


function interpolateMidpoint(a,b,t=0.5){
    return [(1-t)*a[0]+t*b[0], (1-t)*a[1]+t*b[1]];
}

document.getElementById('clearBtn').addEventListener('click', ()=>{
    if(routeLayer) routeLayer.remove();
    document.getElementById('routeSummary').textContent = 'No route loaded. Search for a building to begin.';
    document.getElementById('steps').hidden = true;
    routeActive = false;
    showBuildingMarkers();
});

document.getElementById('mockRouteBtn').addEventListener('click', () => {
    const from = map.getCenter();
    requestRoute(
        [from.lat, from.lng],
        null,
        'TEST_ROOM'
    );
});
*/