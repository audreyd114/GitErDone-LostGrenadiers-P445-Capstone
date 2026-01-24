import pool from './databaseconfig.js'

export function getRoute(userLat, userLong, destinationRoom) {
    return [
        { lat: 38.34162145, lon: -85.82047209 },
        { lat: 38.34170091, lon: -85.82048039 },
        { lat: 38.34175772, lon: -85.82048613 },
        { lat: 38.34181133, lon: -85.82049252 },
        { lat: 38.34188218, lon: -85.82050815 },
        { lat: 38.34198271, lon: -85.8205206 },
        { lat: 38.3420676,  lon: -85.82053337 },
        { lat: 38.3421678,  lon: -85.82053719 },
        { lat: 38.34224567, lon: -85.8205439 },
        { lat: 38.34232003, lon: -85.82055028 },
        { lat: 38.34240524, lon: -85.82054805 },
        { lat: 38.34248981, lon: -85.8205439 },
        { lat: 38.34257821, lon: -85.82053624 },
        { lat: 38.3426819,  lon: -85.8205321 },
        { lat: 38.3427585,  lon: -85.8205244 },
        { lat: 38.3428166,  lon: -85.82051932 },
        { lat: 38.34287851, lon: -85.82050783 },
        { lat: 38.34292064, lon: -85.82045103 },
        { lat: 38.34294617, lon: -85.82040635 },
        { lat: 38.3429634,  lon: -85.82036678 },
        { lat: 38.3430502,  lon: -85.8203821 },
        { lat: 38.34313701, lon: -85.8204038 },
        { lat: 38.34323147, lon: -85.82043571 },
        { lat: 38.34331636, lon: -85.82046124 },
        { lat: 38.34339487, lon: -85.82047209 },
        { lat: 38.34346188, lon: -85.82046762 },
        { lat: 38.34348869, lon: -85.82054996 }
    ];
}
// As of 1/23/2026, you can only pass buildingId = 6. This is Crestview Hall. But it will hopefully be enough for testing... I'll make another one asap.
export async function get_floor_corners(buildingId){
    const sql = `
    SELECT corner_order, lon, lat
    FROM app.get_floor_corners($1)
    ORDER BY corner_order;
    `;
    const { rows } = await pool.query(sql, [buildingId]);
    return rows;
}