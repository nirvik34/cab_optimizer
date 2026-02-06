from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from routing import get_route
from nodes import pickup_nodes

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class RideRequest(BaseModel):
    user: dict
    driver: dict
    destination: dict

@app.post("/book-ride")
def book_ride(req: RideRequest):
    user = req.user
    driver = req.driver
    destination = req.destination

    best_node = None
    best_score = float("inf")

    for node in pickup_nodes:
        _, walk_dist = get_route(user, node, "foot")
        _, drive_to_pickup = get_route(driver, node, "car")
        _, pickup_to_dest = get_route(node, destination, "car")

        if walk_dist > 600:
            continue

        score = drive_to_pickup + pickup_to_dest + 0.3 * walk_dist

        if score < best_score:
            best_score = score
            best_node = node
            best_walk = walk_dist

    driver_route, _ = get_route(driver, best_node, "car")
    user_route, _ = get_route(user, best_node, "foot")
    post_pickup_route, _ = get_route(best_node, destination, "car")

    return {
        "user": user,
        "driver": driver,
        "destination": destination,
        "chosen_pickup": best_node,
        "pickup_nodes": pickup_nodes,
        "driver_route": driver_route,
        "user_route": user_route,
        "post_pickup_route": post_pickup_route,
        "walk_distance_m": int(best_walk),
        "discount_rupees": int(best_score * 0.02)
    }