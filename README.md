🚕 SwiftCab – AI Pickup Optimizer

An AI-based fare optimization and route planning system that reduces ride cost by intelligently selecting an optimal pickup point between the user and the driver, while keeping the destination fixed.

This project is implemented for VIT Chennai and nearby areas as a proof of concept.

⸻

📌 Problem Statement

In ride-hailing systems, drivers often take long detours to pick up users, which increases:
	•	Driver travel distance
	•	User waiting time
	•	Final fare

Goal:

Reduce the ride fare by minimizing unnecessary driver detours before pickup, without changing the destination.

⸻

💡 Core Idea

Instead of forcing the driver to come exactly to the user’s location:
	•	The system selects a nearby optimal pickup node
	•	The user walks a short distance
	•	The driver avoids long detours
	•	The destination route remains unchanged

This leads to lower fare and efficient routing.

⸻

🧠 AI Perspective

The system is modeled as a planning agent:
	•	Single-agent – one centralized planner
	•	Deterministic – same inputs → same output
	•	Known environment – full map knowledge
	•	Sequential – pickup choice affects future routes
	•	Static (during planning) – no environment change while computing
	•	Hierarchical planning – pickup optimization → route execution

⸻

🏗️ System Architecture

Frontend (Client)
	•	HTML + TailwindCSS
	•	Leaflet.js for interactive maps
	•	User selects:
	1.	User location
	2.	Driver location
	3.	Destination

Backend (Server)
	•	FastAPI (Python)
	•	OSRM public routing API
	•	Computes:
	•	Walking distance
	•	Driver distance
	•	Post-pickup route to destination

⸻

📁 Project Structure

ai_project/
│
├── backend/
│   ├── app.py           # FastAPI server & planning logic
│   ├── routing.py       # OSRM routing function
│   ├── nodes.py         # Predefined pickup nodes
│   └── requirements.txt
│
├── frontend/
│   └── index.html       # Interactive map UI
│
└── README.md


⸻

⚙️ Backend Logic (High Level)
	1.	Receive user, driver, and destination coordinates
	2.	For each pickup node:
	•	Compute walking distance (user → node)
	•	Compute driving distance (driver → node)
	•	Compute post-pickup distance (node → destination)
	3.	Discard nodes with excessive walking distance
	4.	Calculate cost score:

score = driver_to_pickup + pickup_to_destination + 0.3 × walking_distance

	5.	Select node with minimum score
	6.	Return routes and fare reduction info

⸻

🗺️ Visualization
	•	🔴 Red dots → Available pickup nodes
	•	🟢 Green dot → Selected optimal pickup
	•	🟢 Dashed green line → User walking path
	•	🔵 Blue line → Driver path to pickup
	•	🟣 Purple line → Final route to destination

⸻

💸 Fare Reduction Logic

Fare is reduced because:
	•	Driver avoids long detours
	•	Pickup is closer to driver’s natural route
	•	User walks a small distance instead

Savings are displayed in the UI for transparency.

⸻

🌍 Real-World Relevance

Similar concepts are used in:
	•	Uber Express Pool
	•	Ola Meet & Greet
	•	Public transport feeder systems
	•	Campus shuttle optimization

⸻

🚀 How to Run

Backend

cd backend
pip install -r requirements.txt
uvicorn app:app --reload

Frontend

cd frontend
python3 -m http.server 5500

Open browser:

http://localhost:5500


⸻

🎯 Future Enhancements
	•	Live traffic integration
	•	Multiple user batching
	•	Time-based cost modeling
	•	ML-based demand prediction

⸻

👩‍💻 Author

Soumya Gupta
B.Tech CSE (AI & ML)
VIT Chennai

⸻

🏁 Conclusion

SwiftCab demonstrates how AI planning and routing optimization can significantly reduce ride costs without sacrificing destination accuracy, making ride-hailing systems more efficient and user-friendly.
