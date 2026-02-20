/*
Buildings.js
Handles building data, markers, and clicks.
*/

// Building markers
const buildings = [
    {id:'LF', name:'Life Sciences', coords:[38.34301, -85.81912]},
    {id:'PS', name:'Physical Sciences', coords:[38.3434606, -85.8181217]},
    {id:'LI', name:'Library', coords:[38.34377, -85.82090]},
    {id:'CV', name:'Crestview Hall', coords:[38.34358, -85.81991]},
    {id:'HH', name:'Hillside Hall', coords:[38.34440, -85.82050]},
    {id:'US', name:'University Center South', coords:[38.34514, -85.82013]},
    {id:'UC', name:'University Center North', coords:[38.34555, -85.82006]},
    {id:'KV', name:'Knobview Hall', coords:[38.34685, -85.81984]},
    {id:'OG', name:'Ogle Center', coords:[38.34716, -85.81919]}
];

const buildingMarkers = [];

buildings.forEach(b => {
    const m = L.marker(b.coords).addTo(outdoorLayer);
    buildingMarkers.push(m);
});

window.hideBuildingMarkers = () => {
    buildingMarkers.forEach(m => map.removeLayer(m));
};

window.showBuildingMarkers = () => {
    buildingMarkers.forEach(m => m.addTo(map));
};

window.buildings = buildings;