/*
Utils.js
Utility/helper functions like position watching, orientation, etc.
 */

function startWatchingPosition(){
    if('geolocation' in navigator){
        watchId = navigator.geolocation.watchPosition(pos=>{
            const latlng = L.latLng(pos.coords.latitude, pos.coords.longitude);
            onLocationFound({latlng});
        }, err=>console.warn('watchPosition error',err), {enableHighAccuracy:true, maximumAge:2000, timeout:5000});
    }
}

function stopWatchingPosition(){ if(watchId){ navigator.geolocation.clearWatch(watchId); watchId=null; }}

function onLocationFound(e){
    const latlng = e.latlng;
    if(!userMarker){
        userMarker = L.marker(latlng, {rotationAngle:0}).addTo(map).bindPopup('You are here');
    } else {
        userMarker.setLatLng(latlng);
    }
    if(follow){ map.setView(latlng); }
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
    const alpha = ev.alpha; // degrees
    if(userMarker && typeof alpha === 'number'){
        // This is a placeholder: replace with a rotated icon for production.
        userHeading = alpha;
    }
}