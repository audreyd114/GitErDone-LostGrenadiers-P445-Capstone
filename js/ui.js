/*
UI.js
User interface controls like locate, follow, search, keyboard shortcuts, welcome popup.
 */

async function handleLocate(buttonEl) {

    // iOS compass permission
    if (typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function') {
        try {
            const res = await DeviceOrientationEvent.requestPermission();
            if (res !== 'granted') return;
        } catch (e) {
            console.warn(e);
        }
    }

    follow = true;

    if (!watchId) {
        startWatchingPosition();
        buttonEl.textContent = 'Locating…';
    }

    if (userMarker) {
        map.setView(userMarker.getLatLng(), 18, { animate: true });
    }
}

document.getElementById('panelLocateBtn')
    .addEventListener('click', function () {
        handleLocate(this);
    });

// Search handling (very simple client-side demo)
const searchInput = document.getElementById('search');
document.getElementById('searchBtn').addEventListener('click', ()=>{
    const q = searchInput.value.trim();
    if(!q) return;
    // For now, try to match building code or name from sample dataset
    const found = buildings.find(b=> (b.id && b.id.toLowerCase()===q.toLowerCase()) || b.name.toLowerCase().includes(q.toLowerCase()));
    if(found){
        map.setView(found.coords, 19);
        L.popup().setLatLng(found.coords).setContent(`<strong>${found.name}</strong><br/>${found.id}`).openOn(map);
        // Request route from user's current position to building
        if(userMarker){
            const userLatLng = userMarker.getLatLng();
            requestRoute([userLatLng.lat, userLatLng.lng], found.coords);
        } else {
            // no user position yet - draw mock route from center
            requestRoute(map.getCenter(), found.coords);
        }
    } else {
        alert('No building found in the sample dataset.');
    }
});

// Accessibility: keyboard shortcut (f) to locate
window.addEventListener('keydown', (e)=>{
    if(e.key === 'f'){
        document.getElementById('locateBtn').click();
    }
});

// Panel Locate mirrors header Locate
document.getElementById('panelLocateBtn')
    .addEventListener('click', () => {
        document.getElementById('locateBtn').click();
    });

// Accessible toggle (UI only for now)
document.getElementById('accessibleToggle')
    .addEventListener('change', (e) => {
        console.log('Accessible route:', e.target.checked);
        // Later: pass flag into requestRoute()
    });

// Floor buttons
document.querySelectorAll('#panelFloorSelector button')
    .forEach(btn => {
        btn.addEventListener('click', () => {
            const floor = btn.dataset.floor;
            setIndoorFloor?.(floor);
        });
    });

const appModal = document.getElementById("appModal");
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");
const modalConfirmBtn = document.getElementById("modalConfirmBtn");
const modalCancelBtn = document.getElementById("modalCancelBtn");

let modalConfirmCallback = null;

function showModal({ title, message, confirmText = "OK", cancelText = "Cancel", onConfirm }) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;

    modalConfirmBtn.textContent = confirmText;
    modalCancelBtn.textContent = cancelText;

    modalConfirmCallback = onConfirm || null;

    appModal.classList.remove("hidden");
}

function closeModal() {
    appModal.classList.add("hidden");
    modalConfirmCallback = null;
}

modalConfirmBtn.addEventListener("click", () => {
    if (modalConfirmCallback) modalConfirmCallback();
    closeModal();
});

modalCancelBtn.addEventListener("click", closeModal);

// On load: show a small welcome popup
window.map.whenReady(() => {
    L.popup({
        autoClose: true,
        closeOnClick: true
    })
        .setLatLng(window.map.getCenter())
        .setContent('<strong>Welcome!</strong><br/>Search for buildings or press "Locate" to center on your device.')
        .openOn(window.map);
});