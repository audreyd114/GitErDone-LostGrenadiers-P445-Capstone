/*
Indoor.js
All indoor/floor overlay logic and indoor UI.
*/

// INDOOR MODE + FLOOR OVERLAYS
let indoorMode = false;
let currentFloor = 2;
let currentBuilding = null;
let currentOverlay = null;

window.isIndoorMode = () => indoorMode;

const unavailableFloors = {
    PS: [1],
    HH: [5],
    KV: [3],
    LI: [1, 2, 3, 4],
    OG: [1, 2, 3, 4],
    US: [1, 2, 3, 4, 5]
}

function isFloorUnavailable(buildingId, floorNum) {
    const entry = unavailableFloors[buildingId];
    if (!entry) return false;
    if (entry === 'ALL') return true;
    return entry.includes(floorNum);
}

const imageAnchors = {
    CV: {
        1: {
            topLeft: [38.34373394, -85.82022324],
            topRight: [38.34367453, -85.81954047],
            bottomLeft: [38.3434682, -85.8202606]
        },
        2: {
            topLeft: [38.34373394, -85.82022324],
            topRight: [38.34367453, -85.81954047],
            bottomLeft: [38.3434682, -85.8202606]
        },
        3: {
            topLeft: [38.34373394, -85.82022324],
            topRight: [38.34367453, -85.81954047],
            bottomLeft: [38.3434682, -85.8202606]
        }
    },
    LF: {
        1: {
            topLeft: [38.343341844, -85.819342992],
            topRight: [38.343268622, -85.818446187],
            bottomLeft: [38.342861052, -85.819406810]
        },
        2: {
            topLeft: [38.343341844, -85.819342992],
            topRight: [38.343268622, -85.818446187],
            bottomLeft: [38.342861052, -85.819406810]
        }
    },
    PS: {
        1: {
            topLeft: [38.34372324, -85.81825947],
            topRight: [38.34369617, -85.81790682],
            bottomLeft: [38.34313052, -85.81833337]
        },
        2: {
            topLeft: [38.34372324, -85.81825947],
            topRight: [38.34369617, -85.81790682],
            bottomLeft: [38.34313052, -85.81833337]
        },
        3: {
            topLeft: [38.343686101, -85.818226706],
            topRight: [38.343668700, -85.817963238],
            bottomLeft: [38.343163729, -85.818282812]
        }
    },
    HH: {
        1: {
            topLeft: [38.34457103, -85.82085055],
            topRight: [38.34453663, -85.82043964],
            bottomLeft: [38.34416606, -85.82090770]
        },
        2: {
            topLeft: [38.34460928, -85.82095303],
            topRight: [38.34455460, -85.82036722],
            bottomLeft: [38.34413920, -85.82102299]
        },
        3: {
            topLeft: [38.34460753, -85.82090301],
            topRight: [38.34453043, -85.82003587],
            bottomLeft: [38.34411728, -85.82097164]
        },
        4: {
            topLeft: [38.34461699, -85.82090023],
            topRight: [38.34455153, -85.82009430],
            bottomLeft: [38.34412528, -85.82096701]
        },
        5: {
            topLeft: [38.34461096, -85.82089446],
            topRight: [38.34452804, -85.82003091],
            bottomLeft: [38.34412244, -85.82097062]
        }
    },
    KV: {
        1: {
            topLeft: [38.3473737, -85.8201815],
            topRight: [38.3473024, -85.8193579],
            bottomLeft: [38.3465227, -85.8203020]
        },
        2: {
            topLeft: [38.3473824, -85.8202000],
            topRight: [38.3473082, -85.8193171],
            bottomLeft: [38.3465009, -85.8203224]
        },
        3: {
            topLeft: [38.34740615, -85.82019197],
            topRight: [38.34732396, -85.81930581],
            bottomLeft: [38.34650315, -85.82032923]
        }
    }
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

        const floors = Object.keys(imageAnchors[currentBuilding] || {})
            .map(Number)
            .sort((a, b) => a - b);

        if (floors.length === 0) return;

        if (isFloorUnavailable(currentBuilding, currentFloor)) {
            showUnavailableFloorModal(currentBuilding, currentFloor);
            return;
        }

        // Prefer floor 2, otherwise first available floor
        currentFloor = floors.includes(2) ? 2 : floors[0];

        loadFloorOverlay(currentBuilding, currentFloor);
    });
});


//floor buttons
document.querySelectorAll("#panelFloorSelector button").forEach(btn => {
    btn.addEventListener("click", () => {
        if (!currentBuilding) {
            alert("Select a building first.");
            return;
        }

        const selectedFloor = Number(btn.dataset.floor);

        if (isFloorUnavailable(currentBuilding, selectedFloor)) {
            showUnavailableFloorModal(currentBuilding, selectedFloor);
            return;
        }

        currentFloor = selectedFloor;
        loadFloorOverlay(currentBuilding, currentFloor);
    });
});

//Overlay loading
async function loadFloorOverlay(buildingId, floorNum) {
    console.log("loadFloorOverlay called:", buildingId, floorNum);
    clearIndoorOverlay();

    const floorData = imageAnchors?.[buildingId]?.[floorNum];
    if (!floorData) {
        console.warn("No image anchors for", buildingId, "floor", floorNum);
        return;
    }

    const { topLeft, topRight, bottomLeft } = floorData;

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

const floorModal = document.getElementById("floorUnavailableModal");
const closeFloorModalBtn = document.getElementById("closeFloorModal");

closeFloorModalBtn?.addEventListener("click", () => {
    floorModal.classList.add("hidden");
});

function showUnavailableFloorModal(buildingId, floorNum) {
    const buildingName =
        buildings.find(b => b.id === buildingId)?.name || buildingId;

    showInfoModal({
        title: "Floor Unavailable",
        message:
            `We're sorry. This floor is unavailable for indoor routing at the moment.
            ${buildingName} – Floor ${floorNum} will be available soon!`,
    });
}

//cleanup
function clearIndoorOverlay() {
    if (currentOverlay) {
        map.removeLayer(currentOverlay);
        currentOverlay = null;
    }
}
