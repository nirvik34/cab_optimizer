import httpx

OSRM_BASE = "http://router.project-osrm.org/route/v1"


async def get_route(lat1, lng1, lat2, lng2, profile="car"):
    """Fetch a route from OSRM. Returns (path, distance_meters)."""
    url = f"{OSRM_BASE}/{profile}/{lng1},{lat1};{lng2},{lat2}"
    params = {"overview": "full", "geometries": "geojson"}

    async with httpx.AsyncClient(timeout=15.0) as client:
        try:
            resp = await client.get(url, params=params)
            resp.raise_for_status()
            data = resp.json()
        except httpx.TimeoutException:
            raise RuntimeError("OSRM request timed out — try again")
        except httpx.HTTPStatusError as e:
            raise RuntimeError(f"OSRM returned HTTP {e.response.status_code}")
        except httpx.RequestError as e:
            raise RuntimeError(f"OSRM connection failed: {e}")

    if data.get("code") != "Ok":
        raise RuntimeError(f"OSRM error: {data.get('code', 'unknown')}")

    route = data["routes"][0]
    coords = route["geometry"]["coordinates"]
    path = [[c[1], c[0]] for c in coords]       # [lng,lat] → [lat,lng]
    distance = route["legs"][0]["distance"]       # meters
    return path, distance