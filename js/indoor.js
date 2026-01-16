/*
Indoor.js
All indoor/floor overlay logic and indoor UI.
*/

// INDOOR MODE + FLOOR OVERLAYS
let indoorMode = false;
let currentFloor = 1;
let currentBuilding = null;
let currentOverlay = null;

// Southwest corner and Northeast corner
const buildingFloorBounds = {
    LF: {
        1: [[38.342939, -85.819293], [38.343239,-85.818518]]
    },
    PS: {

    },
    LIB: {

    },
    CV: {

    },
    HH: {

    },
    US: {

    },
    UC: {

    },
    KV: {

    },
    OG: {

    }
};

//Indoor mode toggle
const indoorBtn = document.getElementById("toggleIndoor");
const floorSelector = document.getElementById("floorSelector");

indoorBtn.addEventListener("click", () => {
    indoorMode = !indoorMode;

    indoorBtn.textContent = indoorMode ? "Indoor: On" : "Indoor: Off";
    floorSelector.style.display = indoorMode ? "block" : "none";

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

//Overlay loading
function loadFloorOverlay(buildingId, floorNum) {
    clearIndoorOverlay();

    const bounds = buildingFloorBounds?.[buildingId]?.[floorNum];
    if (!bounds) {
        console.warn("No indoor bounds for", buildingId, "floor", floorNum);
        return;
    }

    const url = `/indoor/${buildingId}_floor${floorNum}.png`;

    currentOverlay = L.imageOverlay(url, bounds, {
        opacity: 0.9,
        interactive: false
    }).addTo(map);
}

//cleanup
function clearIndoorOverlay() {
    if (currentOverlay) {
        map.removeLayer(currentOverlay);
        currentOverlay = null;
    }
}
