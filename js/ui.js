/*
UI.js
User interface controls like locate, follow, search, keyboard shortcuts, welcome popup.
 */

// Simple UI controls
document.getElementById('locateBtn').addEventListener('click', ()=>{

    //iOS compass permission
    if (typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission().catch(console.warn);
    }

    if(!watchId) { startWatchingPosition(); document.getElementById('locateBtn').textContent = 'Locating...'; }

    // center map on last known position if available
    if (userMarker) {
        map.setView(userMarker.getLatLng(), 18);
    }
});

document.getElementById('followToggle').addEventListener('click', (e)=>{
    follow = !follow;
    e.currentTarget.textContent = follow ? 'Follow: On' : 'Follow: Off';
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

// On load: show a small welcome popup
setTimeout(()=>{
    L.popup({autoClose:true,closeOnClick:true}).setLatLng(map.getCenter())
        .setContent('<strong>Welcome!</strong><br/>Search for buildings or press "Locate" to center on your device.')
        .openOn(map);
},800);