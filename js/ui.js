/*
UI.js
User interface controls like locate, search, modal popups, ect.
 */

console.log('ui.js loaded');

import {
    requestRoutePreview,
    startRoute,
    clearPreviewRoute,
    clearActiveRoute,
    clearAllRoutes
} from './routing.js';

//Collapse nav pane toggle
const controlPanel = document.getElementById("controlPanel");
const collapseBtn = document.getElementById("collapsePanelBtn");

collapseBtn.addEventListener("click", () => {
    controlPanel.classList.toggle("collapsed");
});

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

function resolveBuildingCode(input) {
    const normalized = input.trim().toLowerCase();

    const match = window.buildings.find(b =>
        b.id.toLowerCase() === normalized ||
        b.name.toLowerCase().includes(normalized)
    );

    return match ? match.id : null;
}

searchBtn.addEventListener('click', async() => {
    const q = searchInput.value.trim();
    if (!q) return;

    if (!userMarker) {
        alert('Press Locate Me first so we know where to route you from.');
        return;
    }

    const userLatLng = userMarker.getLatLng();

    // Check if it's building + room input
    const roomMatch = q.match(/^([A-Za-z]{2})[\s-]?(\d{2,4})$/);

    if (roomMatch) {
        const buildingCode = roomMatch[1].toUpperCase();
        const roomNumber = roomMatch[2];
        const roomCode = `${buildingCode}-${roomNumber}`;

        await requestRoutePreview(
            [userLatLng.lat, userLatLng.lng],
            roomCode,
            document.getElementById('accessibleToggle').checked
        );

        showApproveRouteModal(roomCode);
        return;
    }

    // Check if it's building input only
    const buildingCode = resolveBuildingCode(q);

    if (buildingCode) {
        await requestRoutePreview(
            [userLatLng.lat, userLatLng.lng],
            buildingCode,
            document.getElementById('accessibleToggle').checked
        );

        showApproveRouteModal(buildingCode);
        return;
    }

    alert("Building or room not recognized.");
    });

    searchInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
});

/*
searchBtn.addEventListener('click', async () => {
    const q = searchInput.value.trim();
    if (!q) return;

    if (!userMarker) {
        alert('Press Locate Me first so we know where to route you from.');
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
});*/

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

const infoModal = document.getElementById("infoModal");
const infoModalTitle = document.getElementById("infoModalTitle");
const infoModalMessage = document.getElementById("infoModalMessage");
const infoModalOkBtn = document.getElementById("infoModalOkBtn");

function showInfoModal({ title, message }) {
    infoModalTitle.textContent = title;
    infoModalMessage.textContent = message;
    infoModal.classList.remove("hidden");
}

infoModalOkBtn.addEventListener("click", () => {
    infoModal.classList.add("hidden");
});

window.showInfoModal = showInfoModal;

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
function clearEverything() {

    // Clear preview and active route
    clearAllRoutes();

    // Stop follow snapping
    follow = false;

    // Hide modal if open
    appModal.classList.add("hidden");

    console.log("Route fully cleared.");
}

document.getElementById('clearBtn')
    ?.addEventListener('click', clearEverything);

//Accessible route toggle
const accessibleToggle = document.getElementById("accessibleToggle");
accessibleToggle.addEventListener("change", () => {
    console.log("Accessible mode:", accessibleToggle.checked);

    // If a preview is currently shown, regenerate it
    if (window.lastPreviewData) {
        requestRoutePreview(
            window.lastPreviewData.fromLatLng,
            window.lastPreviewData.room,
            accessibleToggle.checked
        );
    }
});

// welcome popup
window.map.whenReady(() => {
    L.popup({ autoClose: true })
        .setLatLng(map.getCenter())
        .setContent(
            '<strong>Welcome!</strong><br>Search for buildings or press "Locate Me" to center on your device.'
        )
        .openOn(window.map);
});