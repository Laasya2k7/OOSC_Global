# GEOSHIELD

### Geopolitical Risk Intelligence & Supply Chain Resilience Platform

> **Turn geopolitical complexity into actionable intelligence.**

GEOSHIELD is an AI-driven geopolitical risk intelligence platform designed to help organizations understand how geopolitical events propagate through global energy and supply-chain networks.

Instead of treating geopolitical news as isolated events, GEOSHIELD connects:

**Geopolitical Event → Risk → Routes → Suppliers → Ports → Refineries → Supply → Economic Impact → Recommended Response**

The platform combines an interactive global risk map, priority intelligence signals, scenario simulation, supply-chain impact analysis, AI-assisted reasoning, and adaptive response recommendations into a single command center.

---

# 1. LOCAL RUN INSTRUCTIONS

## Prerequisites

Make sure you have:

* Node.js 18+ or newer
* npm
* Python 3.11+
* Git

Check your installations:

```bash
node -v
npm -v
python --version
git --version
```

---

## Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <YOUR_PROJECT_FOLDER>
```

---

## Frontend Setup

Move into the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:3000
```

Open that address in your browser.

---

## Backend Setup

Open a **second terminal** and move into the backend directory:

```bash
cd backend
```

Create a Python virtual environment:

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### macOS / Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

Install the backend dependencies:

```bash
pip install -r requirements.txt
```

Start the backend:

```bash
uvicorn main:app --reload
```

The backend will normally run at:

```text
http://127.0.0.1:8000
```

If the project uses a different backend entry file or port, update the command accordingly.

---

## Environment Variables

Create a `.env.local` file inside the frontend if required:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

If AI/news APIs are configured, add the corresponding API keys to the backend environment file.

Example:

```env
AI_API_KEY=your_api_key_here
NEWS_API_KEY=your_api_key_here
```

**Do not commit API keys or `.env` files to GitHub.**

---

## Running the Complete Application

You need both services running:

### Terminal 1 — Backend

```bash
cd backend
venv\Scripts\activate
uvicorn main:app --reload
```

### Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

Then open:

```text
http://localhost:3000
```

---

# 2. WHAT IS GEOSHIELD?

GEOSHIELD is a geopolitical intelligence and supply-chain resilience platform.

The core idea is simple:

> **A geopolitical event in one location can create a chain reaction across thousands of businesses, routes, suppliers, and infrastructure nodes.**

Traditional dashboards often show geopolitical news separately from operational consequences.

GEOSHIELD connects the two.

For example:

```text
Geopolitical Event
        ↓
Strait of Hormuz Risk
        ↓
Shipping Route Disruption
        ↓
Supplier Exposure
        ↓
Indian Port / Refinery Exposure
        ↓
Crude Supply Shortage
        ↓
Reserve Depletion
        ↓
Procurement Cost Increase
        ↓
Alternative Route / Supplier
        ↓
Optimized Response
```

The result is a system that doesn't just answer:

> **"What happened?"**

It attempts to answer:

> **"What does this mean for the supply chain, and what should we do about it?"**

---

# 3. THE PROBLEM

Global supply chains are increasingly exposed to geopolitical instability.

Events such as:

* military conflicts
* sanctions
* diplomatic escalations
* attacks on shipping routes
* port disruptions
* chokepoint closures
* supplier disruptions
* political instability

can propagate rapidly through international trade networks.

For an import-dependent economy such as India, a disruption in one region can affect:

* crude availability
* transportation routes
* refinery operations
* procurement costs
* strategic reserves
* downstream industries

Existing tools often provide either:

* geopolitical intelligence, or
* supply-chain analytics

but do not provide a unified system for understanding the relationship between the two.

GEOSHIELD aims to provide that decision layer.

---

# 4. CORE PRODUCT VISION

GEOSHIELD is designed as:

**Google Maps + Bloomberg-style intelligence + AI geopolitical analysis + Supply Chain Digital Twin**

The map is not merely a visualization.

It is the primary interface into the intelligence system.

Users can explore:

* countries
* regions
* ports
* suppliers
* shipping routes
* energy infrastructure
* chokepoints
* geopolitical events

and understand how risk propagates through the network.

---

# 5. KEY FEATURES

## 5.1 Global Risk Command Center

The main dashboard provides an executive-level view of global risk.

It includes:

* Global Risk Score
* Supply Chain Health
* Critical Routes
* Active Alerts
* Interactive World Map
* Priority Signals
* AI-generated analysis
* Scenario execution

The current frontend exposes dashboard data through API-driven components including global risk, countries, routes, alerts, supply-chain health, and AI analysis.

---

# 6. INTERACTIVE GLOBAL RISK MAP

The map is the central interface of GEOSHIELD.

It provides a geographic representation of geopolitical and supply-chain risk.

Users can interact with:

* countries
* regions
* shipping routes
* ports
* suppliers
* chokepoints
* energy infrastructure

Risk levels are represented through a consistent visual scale:

| Risk | Level    |
| ---- | -------- |
| 🟢   | Low      |
| 🟡   | Moderate |
| 🟠   | High     |
| 🔴   | Critical |

The underlying product vision defines the map as the entry point to the complete intelligence system rather than a standalone visualization.

---

# 7. RISK LAYERS

GEOSHIELD can support multiple intelligence layers.

## Geopolitical Risk

Tracks:

* conflicts
* military escalation
* political instability
* diplomatic tensions
* territorial disputes
* sanctions
* instability

## Shipping Risk

Tracks:

* maritime chokepoints
* shipping lanes
* attacks
* piracy
* congestion
* closure risks
* transit disruptions

Important chokepoints include:

* Strait of Hormuz
* Bab el-Mandeb
* Suez Canal
* Malacca Strait

## Energy Supply

Tracks:

* oil-producing countries
* oil fields
* ports
* refineries
* storage
* pipelines
* shipping routes
* Indian import dependencies

## Sanctions

Tracks:

* sanctioned countries
* sanctioned suppliers
* restricted routes
* sanctions severity
* affected trade

## Economic Impact

Estimates:

* crude price impact
* transportation cost
* procurement cost
* supply deficit
* reserve depletion
* downstream impact

## India Exposure

The system specifically asks:

> **"What does this geopolitical event mean for India?"**

It can estimate:

* percentage of Indian crude supply exposed
* affected suppliers
* affected routes
* affected ports
* affected refineries
* reserve impact
* projected supply shortage
* additional procurement cost

---

# 8. PRIORITY SIGNALS

The **Priority Signals** panel surfaces the most important active geopolitical and supply-chain developments.

Instead of forcing the user to search through every event, GEOSHIELD prioritizes signals based on their potential operational importance.

Signals can contain:

* event title
* affected region
* severity
* risk score
* affected routes
* affected suppliers
* India exposure
* explanation of why the event matters

### News Drill-Down

A major extension of Priority Signals is connecting each signal directly to its underlying news source.

When the user selects a priority signal, the system can:

1. Identify the relevant geopolitical event.
2. Display the event summary.
3. Show the affected geography.
4. Explain the supply-chain implications.
5. **Direct the user to the main/original news article for deeper context.**

This keeps GEOSHIELD from becoming an isolated news summarizer.

The platform becomes the intelligence layer that connects:

**News → Event → Risk → Operational Impact**

while still allowing the user to verify the original reporting.

---

# 9. HIGH-RISK AREAS

GEOSHIELD ranks the most dangerous geopolitical and energy corridors.

Example:

```text
TOP GLOBAL ENERGY THREATS

1. Strait of Hormuz       89/100 🔴
2. Red Sea                 82/100 🔴
3. Iranian Export Routes  76/100 🟠
4. Region X                68/100 🟠
```

The purpose is to immediately answer:

> **Where should an analyst look first?**

---

# 10. SUPPLY CHAIN DIGITAL TWIN

The supply chain is modeled as a connected network.

Conceptually:

```text
SUPPLIER
   ↓
ORIGIN PORT
   ↓
SHIPPING ROUTE
   ↓
CHOKEPOINT
   ↓
INDIAN PORT
   ↓
REFINERY
   ↓
STORAGE
   ↓
CONSUMPTION
```

Each node and edge can contain attributes such as:

* supplier
* capacity
* route
* transit time
* cost
* risk
* dependency
* alternative route
* alternative supplier

This allows geopolitical risk to propagate through the supply network rather than remaining a standalone score.

---

# 11. SCENARIO SIMULATION

Scenario simulation is one of GEOSHIELD's core capabilities.

Users can simulate a disruption and observe its consequences on the supply chain.

For example:

> **What happens if the Strait of Hormuz becomes unavailable for 14 days?**

The scenario engine can consider:

* duration
* severity
* affected suppliers
* affected routes
* affected ports
* affected refineries
* supply shortage
* reserve depletion
* transportation delays
* procurement cost
* estimated economic impact

The current frontend already exposes a scenario simulation request using:

```text
scenario
duration_days
severity
```

and sends it to:

```text
/api/scenarios/simulate
```

The existing demo scenario uses a 14-day Hormuz closure with severity 75.

---

# 12. RUN SCENARIO

The **Run Scenario** functionality provides a fast path from intelligence to simulation.

The user can configure scenario parameters such as:

```text
Scenario:
[ Strait of Hormuz Closure ]

Duration:
[ 7 days ]
[ 14 days ]
[ 30 days ]

Severity:
[ Low ]
[ Medium ]
[ Severe ]
```

The system then runs the digital twin and returns the projected impact.

This functionality can be expanded so users are not restricted to one predefined scenario.

### Custom Scenario Settings

Future versions can allow users to define:

* affected location
* event type
* duration
* severity
* affected routes
* supplier disruption
* port closure
* sanctions intensity
* demand level
* reserve constraints

This turns **Run Scenario** into a configurable scenario engine rather than a fixed demo button.

---

# 13. SCENARIO OUTPUT

A scenario can produce results such as:

```text
SCENARIO
14-DAY HORMUZ CLOSURE

Supply Deficit       31%
Strategic Reserve    6.2 days
Procurement Cost     +27%
Affected Routes      4
Affected Suppliers   3
Affected Refineries  5
```

The map should also change visually.

For example:

* unavailable routes become red
* affected infrastructure becomes highlighted
* disrupted suppliers are marked
* alternative routes can be displayed

The scenario concept and expected outputs are defined around this digital-twin workflow.

---

# 14. ADAPTIVE PROCUREMENT OPTIMIZATION

After a disruption is simulated, GEOSHIELD can recommend alternative procurement strategies.

The user can select:

> **OPTIMIZE RESPONSE**

The optimizer considers:

1. Demand
2. Supplier capacity
3. Route capacity
4. Cost
5. Transit time
6. Risk
7. Sanctions
8. Strategic reserves
9. Required supply

It can recommend alternative:

* suppliers
* routes
* ports
* procurement combinations

Example:

```text
CURRENT

Saudi Arabia
      ↓
   Hormuz
      ↓
    India
```

After disruption:

```text
ALTERNATIVE

Nigeria ───────→ India
Brazil ────────→ India
UAE → Alternate Route → India
```

---

# 15. BEFORE vs AFTER OPTIMIZATION

One of the most important outputs is the difference between the unmitigated and optimized scenarios.

Example:

```text
BEFORE OPTIMIZATION

Supply Deficit
31%


AFTER OPTIMIZATION

Supply Deficit
7%
```

This allows the system to demonstrate not only that a disruption exists, but also how the recommended response reduces its impact.

The original product design specifically defines this before/after comparison as a prominent output.

---

# 16. AI INTELLIGENCE LAYER

GEOSHIELD includes an AI-assisted intelligence layer.

Users can ask questions such as:

```text
What are India's biggest crude supply risks right now?

What happens if Hormuz closes for 14 days?

Which suppliers can replace Saudi crude?

Which route has the lowest risk?

Why is the Red Sea currently high risk?

Which refinery is most exposed?

How can we reduce the projected supply shortage?
```

The AI should reason using structured application data such as:

* events
* risk scores
* routes
* suppliers
* simulation results
* affected infrastructure

rather than simply generating unsupported geopolitical claims.

The intended architecture is:

```text
News / API
    ↓
Event Extraction
    ↓
LLM
    ↓
Structured Event
    ↓
Risk Engine
    ↓
Database
    ↓
Map / UI
```

The AI layer is intended to remain grounded in application data and simulation results.

---

# 17. ALERT SYSTEM

The alert system surfaces important changes.

Example:

```text
🔴 CRITICAL
Hormuz disruption probability increased.

🟠 HIGH
Red Sea shipping risk increased.

🟠 HIGH
Supplier sanctions risk increased.
```

Selecting an alert should:

1. Zoom to the relevant map location.
2. Open the event.
3. Explain the impact.
4. Show affected supply-chain components.
5. Provide relevant news/context.
6. Allow scenario simulation where applicable.

---

# 18. DATA STRATEGY

GEOSHIELD uses a hybrid data strategy.

## Curated / Static Data

Used for:

* suppliers
* ports
* refineries
* routes
* chokepoints
* capacities
* baseline dependencies

## Live / Semi-Live Data

Can be used for:

* geopolitical news
* events
* shipping information
* sanctions
* risk updates

The important design principle is:

> **The hackathon demo should never depend entirely on a live API.**

If a live news/API source becomes unavailable, predefined scenarios should still allow the entire demonstration to run.

Example seeded scenarios:

1. Strait of Hormuz closure
2. Red Sea shipping disruption
3. Sanctions escalation
4. Major supplier disruption

This hybrid approach keeps the demo reliable while leaving room for live intelligence.

---

# 19. CURRENT APPLICATION ARCHITECTURE

The frontend is built around a Next.js/React architecture with TypeScript and Tailwind-based UI components.

The current implementation includes:

* Next.js
* React
* TypeScript
* Tailwind CSS
* Lucide icons
* `react-globe.gl`
* API-driven dashboard components

## The globe component loads geographic boundaries and converts supply routes into visual arcs, including scenario-sensitive route visualization.

# 20. API ARCHITECTURE

The frontend communicates with backend services through API endpoints.

Current dashboard data includes:

```text
GET /api/risk/global
GET /api/countries
GET /api/routes
GET /api/alerts
GET /api/supply-chain
GET /api/ai/analyze
```

Scenario simulation:

```text
POST /api/scenarios/simulate
```

The frontend uses these APIs to populate:

* global risk
* country risk
* routes
* alerts
* supply-chain health
* AI analysis
* simulations

The current dashboard implementation loads these datasets in parallel during initialization.

---

# 21. PROJECT STRUCTURE

The intended modular architecture is:

```text
project/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── types/
│   └── public/
│
├── backend/
│   ├── main.py
│   ├── api/
│   ├── models/
│   ├── services/
│   ├── risk_engine/
│   ├── simulation/
│   ├── optimization/
│   ├── ai/
│   ├── data/
│   └── graph/
│
└── database/
    ├── schema/
    └── seed/
```

The architecture is intentionally modular so the risk engine, simulation engine, AI layer, and optimization engine can evolve independently.

---

# 22. TECHNOLOGY STACK

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Lucide Icons
* React Globe GL
* Data visualization libraries

## Backend

* Python
* FastAPI

## Data / Analytics

* NumPy
* Pandas
* NetworkX

## Optimization

* Google OR-Tools

## Database

* PostgreSQL
* PostGIS

## AI

* Gemini API / OpenAI API

The initial architecture was designed around a lightweight, understandable stack rather than introducing unnecessary infrastructure.

---

# 23. MAIN DEMO FLOW

The intended hackathon demonstration follows this sequence:

### Step 1 — Open GEOSHIELD

The user enters the command center.

The world map immediately shows global geopolitical and energy risk.

### Step 2 — Select Strait of Hormuz

The user clicks the chokepoint.

### Step 3 — Inspect Risk

The application displays:

* geopolitical risk
* shipping risk
* sanctions
* India exposure
* affected routes
* affected suppliers
* recent events

### Step 4 — Ask Why

The AI explains why the location is currently dangerous.

### Step 5 — Run Scenario

The user selects:

```text
SIMULATE 14-DAY CLOSURE
```

### Step 6 — Digital Twin

The simulation runs.

The map changes:

* affected routes turn red
* suppliers are highlighted
* infrastructure is highlighted

### Step 7 — Impact

The system shows:

```text
Supply Deficit
31%

Reserve
6.2 days

Cost
+27%
```

### Step 8 — Optimize Response

The user selects:

```text
OPTIMIZE RESPONSE
```

### Step 9 — Alternative Routes

The optimizer finds alternative suppliers and routes.

### Step 10 — Map Update

Alternative routes appear on the map.

### Step 11 — Compare

```text
BEFORE
31% Supply Deficit

AFTER
7% Supply Deficit
```

### Step 12 — AI Explanation

The AI explains why the recommended strategy is preferable.

This forms the primary hackathon demo loop.

---

# 24. WHY GEOSHIELD IS DIFFERENT

Most geopolitical platforms stop at:

> **"Here is a risk score."**

GEOSHIELD attempts to continue the chain:

```text
EVENT
 ↓
RISK
 ↓
EXPOSURE
 ↓
SUPPLY-CHAIN IMPACT
 ↓
SIMULATION
 ↓
MITIGATION
 ↓
OPTIMIZED RESPONSE
```

This changes the product from a monitoring dashboard into a **decision-support system**.

---

# 25. SCALABILITY & FUTURE DEVELOPMENT

GEOSHIELD is designed so the current hackathon features can evolve into a much larger intelligence platform.

## 25.1 Priority Signals → Intelligence Feed

The current Priority Signals panel can evolve into a continuously updated intelligence feed.

Future capabilities:

* live news ingestion
* event deduplication
* event clustering
* source credibility scoring
* event severity classification
* geographic extraction
* automatic risk recalculation
* direct links to original news articles
* historical event tracking

The existing feature would therefore evolve from a static alert list into an actual geopolitical intelligence stream.

---

## 25.2 Run Scenario → Scenario Engine

The current Run Scenario functionality can evolve from predefined demonstrations into a configurable scenario engine.

Users could define:

```text
EVENT
Location
Duration
Severity

SUPPLY
Affected Supplier
Capacity Loss
Demand

LOGISTICS
Route Closure
Port Capacity
Transit Delay

POLICY
Sanctions
Trade Restrictions
```

The engine could then automatically construct and simulate the corresponding disruption.

This means the existing scenario feature becomes a reusable framework for:

* energy disruptions
* port closures
* sanctions
* military escalation
* natural disasters
* supplier failures
* trade restrictions

---

## 25.3 Digital Twin Scaling

The current supply-chain graph can be expanded from a simplified energy network into a multi-layer global digital twin.

Potential nodes:

* suppliers
* ports
* refineries
* warehouses
* pipelines
* shipping lanes
* rail networks
* airports
* manufacturing facilities
* distribution centers

Potential edges:

* shipping
* pipeline
* road
* rail
* air freight
* procurement relationships

This would allow the same platform to model multiple industries.

---

## 25.4 Multi-Commodity Intelligence

The current focus is energy and crude supply.

The architecture can later support:

* crude oil
* natural gas
* LNG
* coal
* semiconductors
* critical minerals
* fertilizers
* food commodities
* pharmaceuticals
* electronics

A single geopolitical event could then be analyzed across multiple supply chains.

---

## 25.5 Predictive Risk

The current system primarily represents current risk and scenario outcomes.

Future versions can introduce predictive models for:

* escalation probability
* route disruption probability
* supplier failure probability
* port congestion
* commodity price movement
* sanctions escalation
* recovery time

The platform could evolve from:

> **"What is risky now?"**

to:

> **"What is likely to become risky next?"**

---

## 25.6 Real-Time Event Intelligence

A scalable ingestion architecture can process:

```text
News
 ↓
NLP / LLM Extraction
 ↓
Event Detection
 ↓
Entity Resolution
 ↓
Geolocation
 ↓
Risk Scoring
 ↓
Supply Chain Mapping
 ↓
Alert Generation
 ↓
Scenario Recommendation
```

This would allow new geopolitical events to automatically propagate through the risk network.

---

## 25.7 Continuous Scenario Monitoring

Instead of running a scenario only once, future versions could continuously monitor it.

For example:

```text
14-DAY HORMUZ CLOSURE

Day 0
↓
Day 3
↓
Day 7
↓
Day 10
↓
Day 14
```

The system could update:

* supply deficit
* reserve levels
* affected routes
* procurement costs
* alternative supplier availability

as new information arrives.

---

## 25.8 Automated Response Planning

The current Optimize Response feature can evolve into a complete decision engine.

Instead of simply recommending an alternative supplier, the system could generate:

* procurement quantities
* supplier allocation
* route allocation
* port allocation
* reserve drawdown
* estimated cost
* expected delivery timeline
* risk trade-offs

This turns the platform from an analytical system into an operational planning assistant.

---

## 25.9 Enterprise Integration

Future versions can expose GEOSHIELD through APIs for integration with:

* ERP systems
* procurement systems
* logistics platforms
* refinery planning systems
* government intelligence systems
* enterprise risk-management systems

Organizations could receive automated alerts when geopolitical events materially affect their supply chains.

---

## 25.10 Multi-Region Expansion

Although the initial implementation emphasizes India's energy exposure, the architecture can be generalized to:

* India
* Europe
* Southeast Asia
* Middle East
* Africa
* North America
* global multinational supply chains

Each organization could configure its own:

* suppliers
* routes
* facilities
* demand
* risk tolerance
* reserve levels

---

# 26. RELIABILITY PRINCIPLE

A critical design principle is:

> **Live intelligence should enhance the platform, not determine whether the demo works.**

The system should always maintain seeded scenarios and fallback data.

This ensures that the core demonstration remains functional even when:

* APIs fail
* news sources are unavailable
* rate limits are reached
* network connectivity is unstable

---

# 27. SECURITY CONSIDERATIONS

For production deployment:

* API keys must be stored server-side.
* Secrets must never be committed to Git.
* Authentication should be added to enterprise endpoints.
* Role-based access can control sensitive intelligence.
* API requests should be rate-limited.
* External news sources should be validated.
* AI outputs should be grounded in structured application data.
* User-specific supply-chain data should be isolated.

---

# 28. CURRENT STATUS

GEOSHIELD currently demonstrates the core intelligence workflow through:

* Global Risk Command Center
* Interactive world visualization
* Country risk data
* Supply-chain route data
* Priority Signals
* Risk metrics
* Alerts
* AI analysis
* Scenario Lab
* Hormuz disruption simulation
* Scenario-dependent route visualization

The current dashboard also calculates critical routes from route risk and exposes supply-chain health and active alerts as live application data.

---

# 29. HACKATHON VALUE PROPOSITION

GEOSHIELD answers three questions:

### 1. WHAT IS HAPPENING?

Geopolitical intelligence and priority signals.

### 2. WHAT DOES IT AFFECT?

Supply-chain digital twin and India exposure analysis.

### 3. WHAT SHOULD WE DO?

Scenario simulation and optimized procurement/rerouting recommendations.

That creates the complete loop:

```text
MONITOR
   ↓
UNDERSTAND
   ↓
SIMULATE
   ↓
OPTIMIZE
   ↓
ACT
```

---

# 30. VISION

GEOSHIELD aims to become a **global geopolitical-to-operational intelligence layer**.

The long-term vision is a platform where an organization can ask:

> **"What geopolitical developments could affect us?"**

and immediately receive:

```text
EVENT
 ↓
AFFECTED ASSETS
 ↓
SUPPLY-CHAIN EXPOSURE
 ↓
PROJECTED IMPACT
 ↓
SCENARIO OUTCOMES
 ↓
ALTERNATIVE OPTIONS
 ↓
RECOMMENDED ACTION
```

Instead of simply watching geopolitical risk, organizations can use GEOSHIELD to understand it, simulate it, and prepare for it.

---

## GEOSHIELD

**From geopolitical signals to operational decisions.**

**Monitor. Simulate. Optimize. Respond.**
