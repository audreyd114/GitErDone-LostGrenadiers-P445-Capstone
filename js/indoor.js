/*
Indoor.js
All indoor/floor overlay logic and indoor UI.
*/

// INDOOR MODE + FLOOR OVERLAYS
let indoorMode = false;
let currentFloor = 1;
//let currentFloor = null;
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

// Toggle indoor mode
/*document.getElementById('toggleIndoor').addEventListener('click', () => {
    indoorMode = !indoorMode;
    if (!indoorMode && currentOverlay) {
        map.removeLayer(currentOverlay);
        currentOverlay = null;
    }
});*/

// Select building
buildings.forEach(b => {
    L.marker(b.coords).addTo(map).on('click', () => {
        if (!indoorMode) return;
        currentBuilding = b.id;
        currentFloor = 1;
        loadFloorOverlay(currentBuilding, currentFloor);
    });
});

// Floor selector
document.getElementById('floorSelect').addEventListener('change', e => {
    currentFloor = Number(e.target.value);
    if (currentBuilding) loadFloorOverlay(currentBuilding, currentFloor);
});

function loadFloorOverlay(buildingId, floorNum) {
    if (currentOverlay) map.removeLayer(currentOverlay);

    const url = `/indoor/${buildingId}_floor${floorNum}.png`;
    const bounds = buildingFloorBounds[buildingId][floorNum];

    currentOverlay = L.imageOverlay(url, bounds, { opacity: 0.9 }).addTo(map);
}

// Activate indoor mode
document.getElementById("toggleIndoor").addEventListener("click", () => {
    indoorMode = !indoorMode;

    if (indoorMode) {
        document.getElementById("toggleIndoor").textContent = "Indoor: On";
        document.getElementById("floorSelector").style.display = "block";
    } else {
        document.getElementById("toggleIndoor").textContent = "Indoor: Off";
        document.getElementById("floorSelector").style.display = "none";
        removeFloorOverlay();
    }
});

// Handle floor buttons
document.querySelectorAll("#floorSelector button").forEach(btn => {
    btn.addEventListener("click", () => {
        if (!currentBuilding) {
            alert("Select a building first (just click a marker).");
            return;
        }
        currentFloor = parseInt(btn.dataset.floor);
        loadFloorOverlay(currentBuilding, currentFloor);
    });
});

document.getElementById('toggleIndoor').addEventListener('click', (e)=>{
    const btn = e.currentTarget;
    const on = btn.textContent.includes('Off');
    if(on){
        btn.textContent = 'Indoor: On';
        indoorLayer.addTo(map);
        // TODO: fetch and display indoor floor layers
    } else {
        btn.textContent = 'Indoor: Off';
        indoorLayer.remove();
    }
});

/*
// Replace this when we have real building floors
const buildingFloors = {
    "LF": 3,
    "PS": 2,
    "LIB": 3
};

// Activate indoor mode
document.getElementById("toggleIndoor").addEventListener("click", () => {
    indoorMode = !indoorMode;

    if (indoorMode) {
        document.getElementById("toggleIndoor").textContent = "Indoor: On";
        document.getElementById("floorSelector").style.display = "block";
    } else {
        document.getElementById("toggleIndoor").textContent = "Indoor: Off";
        document.getElementById("floorSelector").style.display = "none";
        removeFloorOverlay();
    }
});

// Handle floor buttons
document.querySelectorAll("#floorSelector button").forEach(btn => {
    btn.addEventListener("click", () => {
        if (!currentBuilding) {
            alert("Select a building first (just click a marker).");
            return;
        }
        currentFloor = parseInt(btn.dataset.floor);
        loadFloorOverlay(currentBuilding, currentFloor);
    });
});

function openIndoorView(building, floor) {
    document.getElementById("indoorTitle").textContent = building.name;

    // Build floor dropdown
    const select = document.getElementById("floorSelect");
    select.innerHTML = "";
    for (let f = 1; f <= building.floors; f++) {
        const opt = document.createElement("option");
        opt.value = f;
        opt.textContent = "Floor " + f;
        if (f === floor) opt.selected = true;
        select.appendChild(opt);
    }

    // Load image
    document.getElementById("indoorImage").src =
        `/indoor/${building.code}_floor${floor}.png`;

    document.getElementById("indoorOverlay").hidden = false;

    // Update image when floor changes
    select.onchange = () =>
        openIndoorView(building, Number(select.value));
}

document.getElementById("closeIndoor").onclick = () => {
    document.getElementById("indoorOverlay").hidden = true;
};

// When the user taps a building marker, set indoor context
buildings.forEach(b => {
     const m = L.marker(b.coords).addTo(map).on("click", () => {
         currentBuilding = b.id;

         if (indoorMode) {
             currentFloor = 1;
             loadFloorOverlay(currentBuilding, currentFloor);
         }
     });
 });

// Load floor PNG (placeholder)
function loadFloorOverlay(buildingId, floorNum) {
     removeFloorOverlay();
     const url = `indoor/${buildingId}_floor${floorNum}.png`;

     currentOverlay = L.imageOverlay(url, TEMP_BOUNDS).addTo(map);
 }

 // Remove overlay
 function removeFloorOverlay() {
     if (currentOverlay) {
         map.removeLayer(currentOverlay);
         currentOverlay = null;
     }
 }

document.getElementById('toggleIndoor').addEventListener('click', (e)=>{
        const btn = e.currentTarget;
        const on = btn.textContent.includes('Off');
        if(on){
            btn.textContent = 'Indoor: On';
            indoorLayer.addTo(map);
            // TODO: fetch and display indoor floor layers
        } else {
            btn.textContent = 'Indoor: Off';
            indoorLayer.remove();
        }
    });
*/