/*
Utils.js
Utility/helper functions like position watching, orientation, etc.
 */

let lastPanTime = 0;
const SNAP_INTERVAL = 1500; // milliseconds (1.5 seconds)
let lastPanLatLng = null;
const MIN_DISTANCE = 4; // meters


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

            showLocationHelp(err);
        },
        {
            enableHighAccuracy: true,
            maximumAge: 100,
            timeout: 10000
        }
    );
}

function detectOSAndBrowser() {
    const ua = navigator.userAgent;

    const isIOS = /iPad|iPhone|iPod/.test(ua);
    const isAndroid = /Android/.test(ua);
    const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
    const isChrome = /Chrome/.test(ua) && !/Edg/.test(ua);

    return {
        isIOS,
        isAndroid,
        // Maybe for later
        isSafari,
        isChrome
    };
}

function showLocationHelp(err) {
    if (err.code !== err.PERMISSION_DENIED) return;

    const { isIOS, isAndroid } = detectOSAndBrowser();

    let message = 'Location access is disabled.\n\n';

    if (isIOS) {
        message +=
            'On iPhone:\n' +
            'Enable it in:\n' +
            'Settings → Apps → Safari → Location → Ask\n' +
            'AND/OR:\n' +
            'Settings → Privacy & Security → Location Services → Safari Websites → Ask Next Time Or When I Share';
    } else if (isAndroid) {
        message +=
            'On Android:\n' +
            'Settings → Location → App Location Permissions → Browser → Allow\n' +
            'AND/OR\n' +
            'Chrome → Settings → Site Settings → Location → Allow while visiting the site';
    } else {
        message +=
            'On Desktop:\n' +
            'Check browser address bar → Location permissions → Allow';
    }

    alert(message);
}

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
    const now = Date.now();
    const latlng = e.latlng;
    if (!latlng) return;

    // Create marker if it doesn't exist
    if (!userMarker) {
        userMarker = L.marker(latlng, { icon: compassIcon }).addTo(map);
    } else {
        userMarker.setLatLng(latlng);
    }

    if (follow && now - lastPanTime > SNAP_INTERVAL) {

        if (!lastPanLatLng ||
            latlng.distanceTo(lastPanLatLng) > MIN_DISTANCE) {

            map.panTo(latlng, {
                animate: true,
                duration: 0.6
            });

            lastPanLatLng = latlng;
            lastPanTime = now;
        }
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


