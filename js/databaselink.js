export async function routeToRoom({ lat, lon, room, accessible = false, baseUrl = ""}){
    if (lat == null || lon == null || !room){
        throw new Error("routeToRoom requires lat, lon, and room");
    }

    const url = new URL(`${baseUrl}/api/route-to-room`, window.location.origin);
    url.searchParams.set("lat", String(lat));
    url.searchParams.set("lon", String(lon));
    url.searchParams.set("room", String(room));
    url.searchParams.set("accessible", accessible ? "true" : "false");

    const res = await fetch(url.toString(), {
        method: "GET",
        headers: {Accept: "application/json" },
    });

    const text = await res.text();
    let data;
    try {
        data = text ? JSON.parse(text) : null;
    }catch{
        data = { raw: text };
    }

    if(!res.ok){
        const msg =
            (data && (data.error || data.detail)) ||
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