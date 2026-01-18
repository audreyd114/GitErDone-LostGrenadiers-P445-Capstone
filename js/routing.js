/*
Routing.js
All route calculation, polyline, and step display.
 */

// Simple mock route (replace with backend call)

import { getRoute } from './databaselink.js';

let routeLayer = null;

function requestRoute(from, to, destinationRoom = '') {
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

/*function requestRoute(from, to){
    // Replace this fetch with the backend route API when ready:
    // fetch(`/api/route?from=${from[0]},${from[1]}&to=${to[0]},${to[1]}`)
    //   .then(r=>r.json()).then(drawRoute)

    // For now use mock route: straight polyline
    const mock = [from, interpolateMidpoint(from,to,0.4), to];
    drawRoute({geometry: mock, steps:[
            {text:'Head north for 50m'},
            {text:'Turn right at the fountain'},
            {text:`Arrive at ${to[0].toFixed(5)}, ${to[1].toFixed(5)}`}
        ]});
}*/

function drawRoute(route){
    if(routeLayer) routeLayer.remove();
    routeLayer = L.polyline(route.geometry, {weight:6, color: '#2563eb', lineJoin: 'round'}).addTo(map);
    map.fitBounds(routeLayer.getBounds(), {padding:[40,40]});
}

/*function drawRoute(route){
    if(routeLayer) routeLayer.remove();
    routeLayer = L.polyline(route.geometry, {weight:6}).addTo(map);
    document.getElementById('routeSummary').textContent = 'Route loaded — follow the steps below.';
    const steps = document.getElementById('steps');
    steps.hidden = false; steps.innerHTML = '';
    route.steps.forEach((s,i)=>{
        const el = document.createElement('div'); el.className='step';
        el.innerHTML = `<div style="font-weight:600;min-width:22px">${i+1}</div><div>${s.text}</div>`;
        steps.appendChild(el);
    });
    // zoom to fit
    map.fitBounds(routeLayer.getBounds(), {padding:[40,40]});
}*/

function interpolateMidpoint(a,b,t=0.5){
    return [(1-t)*a[0]+t*b[0], (1-t)*a[1]+t*b[1]];
}

document.getElementById('clearBtn').addEventListener('click', ()=>{
    if(routeLayer) routeLayer.remove();
    document.getElementById('routeSummary').textContent = 'No route loaded. Search for a building to begin.';
    document.getElementById('steps').hidden = true;
});

document.getElementById('mockRouteBtn').addEventListener('click', () => {
    const from = map.getCenter();
    requestRoute(
        [from.lat, from.lng],
        null,
        'TEST_ROOM'
    );
});

/*document.getElementById('mockRouteBtn').addEventListener('click', ()=>{
    const from = map.getCenter();
    const to = [from.lat + 0.0025, from.lng + 0.0025];
    requestRoute([from.lat, from.lng], to);
});*/
