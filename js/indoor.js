/*
Indoor.js
All indoor/floor overlay logic and indoor UI.
This file needs cleaning right now (11/24)
 */

// INDOOR MODE + FLOOR OVERLAYS
let indoorMode = false;
let currentFloor = null;
let currentBuilding = null;
let currentOverlay = null;

// TEMP demo bounds (fix when we get PNGs)
const TEMP_BOUNDS = [
    [38.34300, -85.81720], // southwest
    [38.34330, -85.81650]  // northeast
];

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
/* buildings.forEach(b => {
     const m = L.marker(b.coords).addTo(map).on("click", () => {
         currentBuilding = b.id;

         if (indoorMode) {
             currentFloor = 1;
             loadFloorOverlay(currentBuilding, currentFloor);
         }
     });
 });*/

// Load floor PNG (placeholder)
/* function loadFloorOverlay(buildingId, floorNum) {
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
 }*/

/*
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