export async function routeToRoom({lat, lon, room, accessible = false, baseUrl = "" }){
    if (lat == null || lon == null || !room){
        throw new Error("routeToRoom requires lat, lon, and room");
    }
    const url = new URL("/api/route-to-room", baseUrl || window.location.origin);

    url.searchParams.set("lat", String(lat));
    url.searchParams.set("lon", String(lon));
    url.searchParams.set("room", String(room));
    url.searchParams.set("accessible", accessible ? "true" : "false");

    const res = await fetch(url.toString(),{
        method: "GET",
        headers: {Accept: "application/json"},
    });

    let data = null;

    try{
        data = await res.json();
    }catch{
        const raw = await res.text().catcH(() => "");
        data = {raw};
    }

    if (!res.ok){
        const msg =
            (data && (data.error || data.detail || data.message)) ||
            `Request failed (${res.status} ${res.statusText})`;
        throw new Error(msg);
    }
    return data;
}

//example usage!!
/*
import {routeToRoom} from "./databaselink.js";

const data = await routeToRoom({
    lat: 38.3456380,
    lon: -85.8191536,
    room: "KV-110",
    accessible: true,
    });

   console.log(data);
 */