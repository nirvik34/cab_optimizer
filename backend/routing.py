import requests

def get_route(origin, destination, mode="car"):
    profile = "foot" if mode == "foot" else "car"

    url = (
        f"http://router.project-osrm.org/route/v1/{profile}/"
        f"{origin['lng']},{origin['lat']};"
        f"{destination['lng']},{destination['lat']}"
        "?overview=full&geometries=geojson"
    )

    r = requests.get(url).json()
    route = r["routes"][0]

    coords = route["geometry"]["coordinates"]
    distance = route["distance"]

    path = [[lat, lng] for lng, lat in coords]
    return path, distance