import os

import psycopg2
import psycopg2.extras
from flask import Flask, request, jsonify

app = Flask(__name__)

def get_db_conn():
    return psycopg2.connect(
        host = "127.0.0.1",
        port = 5432,
        dbname = "lostgrenadiers",
        user = "lg_app",
        password = "}7SMO0>b6Ih"
    )
    missing = [k for k, v in {
        "PGHOST": host, "PGDATABASE": dbname, "PGUSER": user, "PGPASSWORD": password
    }.items() if not v]
    if missing:
        raise RuntimeError(f"Missing environment variables: {', '.join(missing)}")
    return psycopg2.connect(
        host=host,
        port=port,
        dbname=dbname,
        user=user,
        password=password
    )
    
    
@app.get("/api/health")
def health():
    return jsonify(ok=True)

@app.get("/api/route-to-room")
def route_to_room():
    lat = request.args.get("lat", type=float)
    lon = request.args.get("lon", type=float)
    room = request.args.get("room", type=str)
    accessible = request.args.get("accessible", default="false")

    if lat is None or lon is None or not room:
        return jsonify({
            "error": "lat, lon, and room are required"
        }), 400

    accessible_only = str(accessible).lower() in ("1", "true", "yes", "on")

    conn = get_db_conn()
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(
                """
                SELECT *
                FROM app.route_to_room(%s, %s, %s, %s)
                """,
                (lat, lon, room, accessible_only),
            )
            rows = cur.fetchall()

        if not rows:
            return jsonify({
                "found": False,
                "path": []
            })

        return jsonify({
            "found": True,
            "path": rows
        })

    finally:
        conn.close()
        
        
@app.get("/api/get-full-route")
def get_full_route():
    lat = request.args.get("lat",type=float)
    lon = request.args.get("lon",type=float)
    room = request.args.get("room", type=str)
    accessible = request.args.get("accessible",default="false")
    
    if lat is None or lon is None or not room:
        return jsonify({"error": "lat, lon, and room are required"}), 400
    accessible_only = str(accessible).lower() in ("1", "true","yes","on")
    
    conn = get_db_conn()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT app.get_full_route(%s, %s, %s, %s) AS route
                """,
                    (lat, lon, room, accessible_only),
            )
            row = cur.fetchone()
                
        route = row[0] if row else None
        
        if route is None:
            return jsonify({"found": False, "route": [[],[],[]]})
        return jsonify({"found": True, "route": route})
    finally:
        conn.close()
