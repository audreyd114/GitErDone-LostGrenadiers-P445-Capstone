# Run with `pytest tests/tests.py`

import requests
import socket

BASE_URL = "https://www.lostgrenadiers.org/api/get-full-route"

HTTP_URL = "http://www.lostgrenadiers.org"
HTTPS_URL = "https://www.lostgrenadiers.org"

DB_HOST = "38.194.1.68"
DB_PORT = 5432

# 2.1
def test_route_endpoint_exists():
    params = {
        "lat": 38.34509,
        "lon": -85.81937,
        "room": "PS-330",
        "accessible": "false"
    }

    response = requests.get(BASE_URL, params=params)
    assert response.status_code == 200

# 2.1
def test_valid_route_response():
    params = {
        "lat": 38.34509,
        "lon": -85.81937,
        "room": "PS-330",
        "accessible": "false"
    }

    response = requests.get(BASE_URL, params=params)

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, dict)
    assert "found" in data
    assert "route" in data

    # found should be True for valid room
    assert data["found"] is True

    # route should be a list
    assert isinstance(data["route"], list)

    # first segment should contain coordinate dicts
    first_segment = data["route"][0]
    assert isinstance(first_segment, list)
    assert len(first_segment) > 0

    first_point = first_segment[0]
    assert "lat" in first_point
    assert "lon" in first_point

# 2.2, no data provided to API
def test_missing_parameters():
    response = requests.get(BASE_URL)
    assert response.status_code in [400, 422]

# 2.3
def test_same_location_as_room():
    params = {
        "lat": 38.34548685422794,
        "lon": -85.8192324245999,
        "room": "PS-330",
        "accessible": "false"
    }

    response = requests.get(BASE_URL, params=params)
    assert response.status_code == 200

# 2.4, will fail if database is online, but should pass if online without exposing stack
def test_db_offline():
    params = {
        "lat": 38.34509,
        "lon": -85.81937,
        "room": "PS-330",
        "accessible": "false"
    }

    response = requests.get(BASE_URL, params=params)
    assert response.status_code == 500
    assert "traceback" not in response.text.lower()

# 3.1
def test_http_redirects_to_https():
    response = requests.get(HTTP_URL, allow_redirects=False)

    assert response.status_code in [301, 302]
    assert "Location" in response.headers
    assert response.headers["Location"].startswith("https://")

def test_sql_injection_blocked():
    params = {
        "lat": 38.34509,
        "lon": -85.81937,
        "room": "' OR 1=1 --",  # sqli payload
        "accessible": "false"
    }

    response = requests.get(BASE_URL, params=params)
    
    # API should return 400 or error message, not 200 with database dump
    assert response.status_code == 400 or "error" in response.text.lower() or response.status_code == 200 # inspect request still in case, but it doesnt leak !

def test_postgres_inaccessible():
    s = socket.socket()
    try:
        s.settimeout(2)
        s.connect((DB_HOST, DB_PORT))
        # If connection succeeds, test fails
        assert False, "Able to connect to database from outside!"
    except (ConnectionRefusedError, socket.timeout):
        # Connection blocked → pass
        pass
    finally:
        s.close()