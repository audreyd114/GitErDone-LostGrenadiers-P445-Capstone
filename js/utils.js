/*
Utils.js
Utility/helper functions like position watching, orientation, etc.
 */

function startWatchingPosition() {
    if (!navigator.geolocation) {
        console.warn('Geolocation not supported');
        return;
    }

    watchId = navigator.geolocation.watchPosition(
        pos => {
            const latlng = L.latLng(
                pos.coords.latitude,
                pos.coords.longitude
            );
            onLocationFound({
                latlng,
                accuracy: pos.coords.accuracy
            });
        },
        err => {
            console.warn('watchPosition error', err);

            if (err.code === err.PERMISSION_DENIED) {
                alert(
                    'Location access is disabled.\n\n' +
                    'Enable it in:\n' +
                    'Settings → Safari → Location → Allow'
                );
            }
        },
        {
            enableHighAccuracy: true,
            maximumAge: 100,
            timeout: 10000
        }
    );
}

/*
function startWatchingPosition() {
    if ('geolocation' in navigator) {
        watchId = navigator.geolocation.watchPosition(
            pos => {
                const latlng = L.latLng(pos.coords.latitude, pos.coords.longitude);
                onLocationFound({ latlng: latlng, accuracy: pos.coords.accuracy });
            },
            err => {
                console.warn('watchPosition error', err);
                // fallback for desktop / denied permissions
                const fallback = L.latLng(38.34505, -85.81951); // IUS campus
                onLocationFound({ latlng: fallback, accuracy: 5 });
            },
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 10000
            }
        );
    } else {
        // fallback for testing. Could manifest to bug
        const fallback = L.latLng(38.34505, -85.81951);
        onLocationFound({ latlng: fallback, accuracy: 5 });
    }
}*/

let accuracyCircle = null;

function stopWatchingPosition(){ if(watchId){ navigator.geolocation.clearWatch(watchId); watchId=null; }}

const compassIcon = L.divIcon({
    className: 'compass-marker',
    html: `
        <div class="arrow"></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});

function onLocationFound(e) {
    const latlng = e.latlng;
    if (!latlng) return;

    // Create marker if it doesn't exist
    if (!userMarker) {
        userMarker = L.marker(latlng, { icon: compassIcon }).addTo(map);
    } else {
        userMarker.setLatLng(latlng);
    }

    if (follow) {
        map.setView(latlng, map.getZoom(), { animate: true });
    }
}

function onLocationError(e){
    console.warn('Geolocation error', e.message);
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

// Device orientation: rotate heading indicator
if(window.DeviceOrientationEvent){
    window.addEventListener('deviceorientationabsolute', handleOrientation, true);
    window.addEventListener('deviceorientation', handleOrientation, true);
}
function handleOrientation(ev){
    let heading = null;

    // iOS Safari
    if ('webkitCompassHeading' in ev && typeof ev.webkitCompassHeading === 'number') {
        heading = ev.webkitCompassHeading;
    }
    // Android, Chrome, and others
    else if (typeof ev.alpha === 'number') {
        heading = 360 - ev.alpha;
    }

    if (heading === null || !userMarker) return;

    const arrow = userMarker.getElement()?.querySelector('.arrow');
    if (!arrow) return;

    arrow.style.transform = `rotate(${smoothHeading(heading)}deg)`;

    /*if(userMarker && heading !== null){
        const arrow = userMarker.getElement()?.querySelector('.arrow');
        if(arrow){
            arrow.style.transform = `rotate(${smoothHeading(heading)}deg)`;
        }
    }*/
}

let lastHeading = null;

function smoothHeading(newHeading){
    if(lastHeading === null){
        lastHeading = newHeading;
        return newHeading;
    }
    lastHeading = lastHeading * 0.8 + newHeading * 0.2;
    return lastHeading;
}


