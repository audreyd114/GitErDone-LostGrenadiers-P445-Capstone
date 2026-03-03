/*
Indoor.js
All indoor/floor overlay logic and indoor UI.
*/

import {
    handleFloorSelected,
    getActiveRouteEntryFloor
} from "./routing.js";

// INDOOR MODE + FLOOR OVERLAYS
let indoorMode = false;
let currentFloor = 2;
let currentBuilding = null;
let currentOverlays = [];

window.isIndoorMode = () => indoorMode;

const unavailableFloors = {
    PS: [1],
    LI: [1, 2, 3, 4],
    US: [1, 2, 3, 4, 5],
    UC: [1, 2, 3, 4, 5]
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
            topLeft: [38.34457682, -85.82087089],
            topRight: [38.34454481, -85.82048972],
            bottomLeft: [38.34416585, -85.82092561]
        },
        2: {
            topLeft: [38.34460519, -85.82088481],
            topRight: [38.34456445, -85.82043408],
            bottomLeft: [38.34412948, -85.82095807]
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
            topLeft: [38.34460955, -85.82090683],
            topRight: [38.34455573, -85.82024094],
            bottomLeft: [38.34439934, -85.82093558]
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
    },
    OG: {
        1: {
            topLeft: [38.3475706, -85.8201612],
            topRight: [38.3474368, -85.8184436],
            bottomLeft: [38.3468156, -85.8202558]
        },
        2: {
            topLeft: [38.3475008, -85.8200684],
            topRight: [38.3473772, -85.8184547],
            bottomLeft: [38.3467851, -85.8201686]
        },
        3: {
            topLeft: [38.3475081, -85.8201000],
            topRight: [38.3473713, -85.8184529],
            bottomLeft: [38.3467895, -85.8201964]
        },
        4: {
            topLeft: [38.3475459, -85.8201148],
            topRight: [38.3473961, -85.8184083],
            bottomLeft: [38.3467807, -85.8202168]
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

    if (indoorMode) {
        clearIndoorOverlay();
        currentBuilding = null;
    }

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

        const routeEntryFloor = getActiveRouteEntryFloor();

        if (routeEntryFloor !==null && floors.includes(routeEntryFloor)) {
            currentFloor = routeEntryFloor;
        } else {
            // Default behavior
            currentFloor = floors.includes(2) ? 2 : floors[0];
        }

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

        handleFloorSelected(selectedFloor);
    });
});

//Overlay loading
async function loadFloorOverlay(buildingId, floorNum) {
    clearIndoorOverlay();

    // Determine which overlays to load
    let buildingsToLoad = [buildingId];

    if (buildingId === "KV" || buildingId === "OG") {
        buildingsToLoad = ["KV", "OG"];
    }

    buildingsToLoad.forEach(id => {

        const floorData = imageAnchors?.[id]?.[floorNum];
        if (!floorData) return;

        const { topLeft, topRight, bottomLeft } = floorData;

        const url = `/indoor/${id}_floor${floorNum}.png`;

        const overlay = L.imageOverlay.rotated(
            url,
            topLeft,
            topRight,
            bottomLeft,
            {
                opacity: 0.95,
                interactive: false
            }
        ).addTo(map);

        if (id === "OG") {
            overlay.setZIndex(100);
        }

        if (id === "KV") {
            overlay.setZIndex(200); // KV always on top
        }

        currentOverlays.push(overlay);
    });
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
    currentOverlays.forEach(overlay => {
        map.removeLayer(overlay);
    });
    currentOverlays = [];
}
