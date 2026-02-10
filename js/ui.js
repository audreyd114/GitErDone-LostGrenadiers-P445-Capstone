/*
UI.js
User interface controls like locate, follow, search, keyboard shortcuts, welcome popup.
 */

console.log('ui.js loaded');

import {
    requestRoutePreview,
    startRoute,
    clearPreviewRoute,
    clearActiveRoute
} from './routing.js';

// Locate user
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

// Search handling
const searchInput = document.getElementById('search');
const searchBtn = document.getElementById(('searchBtn'));

searchBtn.addEventListener('click', async () => {
    const q = searchInput.value.trim();
    if (!q) return;

    if (!userMarker) {
        alert('Press Locate first so we know where to route you from.');
        return;
    }

    // Expect formats like: "LF 119", "KV-110", "PS204"
    const match = q.match(/^([A-Za-z]{2})[\s-]?(\d{2,4})$/);
    if (!match) {
        alert('Enter a room like: LF 119 or KV-110');
        return;
    }

    const buildingCode = match[1].toUpperCase();
    const roomNumber = match[2];
    const roomCode = `${buildingCode}-${roomNumber}`;

    const userLatLng = userMarker.getLatLng();

    await requestRoutePreview(
        [userLatLng.lat, userLatLng.lng],
        roomCode,
        document.getElementById('accessibleToggle').checked
    );

    showApproveRouteModal(roomCode);
});

//Modal
const appModal = document.getElementById('appModal');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const modalConfirmBtn = document.getElementById('modalConfirmBtn');
const modalCancelBtn = document.getElementById('modalCancelBtn');

let modalConfirmCallback = null;

function showModal({ title, message, confirmText, cancelText, onConfirm }) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;

    modalConfirmBtn.textContent = confirmText;
    modalCancelBtn.textContent = cancelText;

    modalConfirmCallback = onConfirm;
    appModal.classList.remove('hidden');
}

function closeModal() {
    appModal.classList.add('hidden');
    modalConfirmCallback = null;
}

modalConfirmBtn.addEventListener('click', () => {
    if (modalConfirmCallback) modalConfirmCallback();
    closeModal();
});

modalCancelBtn.addEventListener('click', () => {
    clearPreviewRoute();
    closeModal();
});

function showApproveRouteModal(roomCode) {
    showModal({
        title: 'Start Route?',
        message: `Navigate to ${roomCode}?`,
        confirmText: 'Start',
        cancelText: 'Cancel',
        onConfirm: () => {
            startRoute();
        }
    });
}

//clear route
document
    .getElementById('clearBtn')
    ?.addEventListener('click', clearActiveRoute);

// welcome popup
window.map.whenReady(() => {
    L.popup({ autoClose: true })
        .setLatLng(map.getCenter())
        .setContent(
            '<strong>Welcome!</strong><br>Search for buildings or press "Locate" to center on your device.'
        )
        .openOn(window.map);
});

/*document.getElementById('searchBtn').addEventListener('click', async () => {
    const q = searchInput.value.trim();
    if (!q) return;

    const parsedRoom = parseRoomSearch?.(q);

    if (parsedRoom) {
        if (!userMarker) {
            alert("Press Locate first so routing can take place.");
            return;
        }

        const { buildingCode, roomNumber } = parsedRoom;
        const roomCode = `${buildingCode}-${roomNumber}`;

        const userLatLng = userMarker.getLatLng();

        await requestRoutePreview(
            [userLatLng.lat, userLatLng.lng],
            roomCode,
            document.getElementById('accessibleToggle').checked
        );

        showApproveRouteModal({
            startLabel: "Your Location",
            endLabel: roomCode
        });

        return;
    }

    alert('No building or room found.');
});*/

/*document.getElementById('searchBtn').addEventListener('click', ()=>{
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
});*/
/*
function showApproveRouteModal({ startLabel, endLabel }) {
    showModal({
        title: "Start Route?",
        message:
            `You're about to start navigation.\n\nFrom: ${startLabel}\nTo: ${endLabel}`,
        confirmText: "Start",
        cancelText: "Cancel",
        onConfirm: () => {
            const userLatLng = userMarker.getLatLng();

            startRoute(
                [userLatLng.lat, userLatLng.lng],
                endLabel,
                document.getElementById('accessibleToggle').checked
            );
        },
        onCancel: () => {
            clearPreviewRoute();
        }
    });
}*/
/*
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
*/
// Floor buttons
/*document.querySelectorAll('#panelFloorSelector button')
    .forEach(btn => {
        btn.addEventListener('click', () => {
            const floor = btn.dataset.floor;
            setIndoorFloor?.(floor);
        });
    });

 */
/*
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

    modalCancelBtn.style.display = cancelText ? 'inline-block' : 'none';

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

document.getElementById('clearBtn')
    ?.addEventListener('click', clearActiveRoute);

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

window.showModal = showModal;
window.closeModal = closeModal;
*/