/*
Indoor.js
All indoor/floor overlay logic and indoor UI.
Only Crestview floor 1 right now 1/29.
*/

// INDOOR MODE + FLOOR OVERLAYS
let indoorMode = false;
let currentFloor = 1;
let currentBuilding = null;
let currentOverlay = null;

const buildingIdMap = {
    CV: 6
};

//Indoor mode toggle
const indoorToggle = document.getElementById("indoorToggle");
const floorPanel = document.getElementById("panelFloorSelector");

floorPanel.style.display = 'none'; // start hidden

indoorToggle.addEventListener("change", () => {
    indoorMode = indoorToggle.checked;

    floorPanel.style.display = indoorMode ? "block" : "none";

    if (!indoorMode) {
        clearIndoorOverlay();
        currentBuilding = null;
    }
});

//building markers
buildings.forEach(b => {
    L.marker(b.coords).addTo(map).on("click", () => {
        if (!indoorMode) return;

        currentBuilding = b.id;
        currentFloor = 1;
        loadFloorOverlay(currentBuilding, currentFloor);
    });
});

//floor buttons
document.querySelectorAll("#floorSelector button").forEach(btn => {
    btn.addEventListener("click", () => {
        if (!currentBuilding) {
            alert("Select a building first.");
            return;
        }

        currentFloor = Number(btn.dataset.floor);
        loadFloorOverlay(currentBuilding, currentFloor);
    });
});

const imageAnchors = {
    CV: {
        1: {
            topLeft: [38.34373394, -85.82022324],
            topRight: [38.34367453, -85.81954047],
            bottomRight: [38.34340879, -85.81957783]
        }
    }
}

function computeBottomLeft(topLeft, topRight, bottomRight) {
    const downLat = bottomRight[0] - topRight[0];
    const downLon = bottomRight[1] - topRight[1];

    return [
        topLeft[0] + downLat,
        topLeft[1] + downLon
    ];
}

const bottomLeft = computeBottomLeft(topLeft, topRight, bottomRight);

currentOverlay = L.imageOverlay.rotated(
    '/indoor/CV_floor1.png',
    topLeft,
    topRight,
    bottomLeft,
    { opacity: 0.95 }
).addTo(map);


//Overlay loading
async function loadFloorOverlay(buildingId, floorNum) {
    console.log("loadFloorOverlay called:", buildingId, floorNum);
    clearIndoorOverlay();

    const floorData = imageAnchors?.[buildingId]?.[floorNum];
    if (!floorData) {
        console.warn("No image anchors for", buildingId, "floor", floorNum);
        return;
    }

    const { topLeft, topRight, bottomRight } = floorData;
    const bottomLeft = computeBottomLeft(topLeft, topRight, bottomRight);

    const url = `/indoor/${buildingId}_floor${floorNum}.png`;

    currentOverlay = L.imageOverlay.rotated(
        url,
        topLeft,
        topRight,
        bottomLeft,
        {
            opacity: 0.95,
            interactive: false
        }
    ).addTo(map);
}

//cleanup
function clearIndoorOverlay() {
    if (currentOverlay) {
        map.removeLayer(currentOverlay);
        currentOverlay = null;
    }
}
