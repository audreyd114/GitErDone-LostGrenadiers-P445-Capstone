/*
Indoor.js
All indoor/floor overlay logic and indoor UI.
*/

// INDOOR MODE + FLOOR OVERLAYS
let indoorMode = false;
let currentFloor = 1;
let currentBuilding = null;
let currentOverlay = null;

const buildingIdMap = {
    CV: 6
};

const dynamicFloorBounds = {};

async function fetchFloorBounds(dbBuildingId) {
    if (dynamicFloorBounds[dbBuildingId]) {
        return dynamicFloorBounds[dbBuildingId];
    }

    const res = await fetch(`/api/floor-corners/${dbBuildingId}`);
    if (!res.ok) {
        throw new Error("Failed to fetch floor corners");
    }

    const corners = await res.json();

    const lats = corners.map(c => c.lat);
    const lons = corners.map(c => c.lon);

    console.log("Fetching floor bounds for DB building:", dbBuildingId);

    const bounds = [
        [Math.min(...lats), Math.min(...lons)],
        [Math.max(...lats), Math.max(...lons)]
    ];

    dynamicFloorBounds[dbBuildingId][floorNum] = bounds;

    corners.forEach(c => {
        L.circleMarker([c.lat, c.lon], { radius: 4, color: 'red' }).addTo(map)
            .bindPopup(`Corner ${c.corner_order}`);
    });

    return dynamicFloorBounds[dbBuildingId];
}

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

//Overlay loading
async function loadFloorOverlay(buildingId, floorNum) {
    console.log("loadFloorOverlay called:", buildingId, floorNum);
    clearIndoorOverlay();

    try {
        const dbBuildingId = buildingIdMap[buildingId];
        console.log("Mapped DB building ID:", dbBuildingId);
        if (!dbBuildingId) {
            console.warn("No DB mapping for building:", buildingId);
            return;
        }

        const buildingBounds = await fetchFloorBounds(dbBuildingId);
        const bounds = buildingBounds?.[floorNum];

        if (!bounds) {
            console.warn("No indoor bounds for", buildingId, "floor", floorNum);
            return;
        }

        const url = `/indoor/${buildingId}_floor${floorNum}.png`;

        currentOverlay = L.imageOverlay(url, bounds, {
            opacity: 0.9,
            interactive: false
        }).addTo(map);

    } catch (err) {
        console.error("Indoor overlay failed:", err);
    }
}

//cleanup
function clearIndoorOverlay() {
    if (currentOverlay) {
        map.removeLayer(currentOverlay);
        currentOverlay = null;
    }
}
