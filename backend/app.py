import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from nodes import PICKUP_NODES
from routing import get_route

app = FastAPI(title="SwiftCab API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class Coord(BaseModel):
    lat: float
    lng: float


class RideRequest(BaseModel):
    user: Coord
    driver: Coord
    destination: Coord


@app.get("/nodes")
def get_nodes():
    return PICKUP_NODES


async def _evaluate_node(node, req):
    """Score a single pickup node. Returns (node, score, routes) or None."""
    try:
        walk_path, walk_dist = await get_route(
            req.user.lat, req.user.lng,
            node["lat"], node["lng"],
            profile="foot",
        )
        # Reject if user has to walk > 600 meters
        if walk_dist > 600:
            return None

        drive_path, drive_dist = await get_route(
            req.driver.lat, req.driver.lng,
            node["lat"], node["lng"],
            profile="car",
        )
        post_path, post_dist = await get_route(
            node["lat"], node["lng"],
            req.destination.lat, req.destination.lng,
            profile="car",
        )

        score = drive_dist + post_dist + 0.3 * walk_dist

        return {
            "node": node,
            "score": score,
            "walk": (walk_path, walk_dist),
            "drive": (drive_path, drive_dist),
            "post": (post_path, post_dist),
        }
    except Exception:
        return None


@app.post("/book-ride")
async def book_ride(req: RideRequest):
    # Evaluate all 9 nodes concurrently (cuts ~4s → ~1s)
    results = await asyncio.gather(
        *[_evaluate_node(node, req) for node in PICKUP_NODES]
    )

    # Filter out failed / rejected nodes
    valid = [r for r in results if r is not None]

    if not valid:
        raise HTTPException(
            status_code=400,
            detail="No valid pickup node found within 600m walking distance. "
                   "Try placing User closer to VIT campus.",
        )

    # Pick the lowest-scoring node
    best = min(valid, key=lambda r: r["score"])

    return {
        "chosen_pickup": best["node"],
        "user_route": best["walk"][0],
        "user_walk_meters": round(best["walk"][1]),
        "driver_route": best["drive"][0],
        "driver_dist_meters": round(best["drive"][1]),
        "post_pickup_route": best["post"][0],
        "post_pickup_meters": round(best["post"][1]),
        "distance_meters": round(best["drive"][1] + best["post"][1]),
    }