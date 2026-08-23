'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

import {
  Activity,
  ArrowUpRight,
  BrainCircuit,
  ChevronRight,
  CircleAlert,
  Globe2,
  Menu,
  Route as RouteIcon,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from 'lucide-react';

import { getData, postData } from '../../lib/api';


// --------------------------------------------------
// MAP
// --------------------------------------------------

const WorldMap = dynamic(
  () => import('../../components/map/WorldMap'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[600px] animate-pulse rounded-lg border border-[#26323d] bg-[#10242c]" />
    ),
  }
);


// --------------------------------------------------
// 3D GLOBE
// --------------------------------------------------

const WorldGlobe = dynamic(
  () => import('../../components/map/WorldGlobe'),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen items-center justify-center bg-[#050b10] text-[#42d3c5]">
        Loading 3D globe...
      </div>
    ),
  }
);


// --------------------------------------------------
// TYPES
// --------------------------------------------------

type Country = {
  id: string;
  name: string;
  score: number;
  band: string;
  lat: number;
  lng: number;
};

type RouteData = {
  id: string;
  name: string;
  from: string;
  to: string;
  risk: number;
  capacity: number;
  cost: number;
  transit_days: number;
  chokepoint: string;
};

type Global = {
  score: number;
  band: string;
  change_24h: number;
};

type Simulation = {
  supply_deficit_percent: number;
  cost_increase_percent: number;
  reserve_days_remaining: number;
  affected_routes: number;
  mitigation: string;
};

type SupplyChain = {
  health: number;
  at_risk_capacity: number;
  live_events: number;
};

type AIAnalysis = {
  mode: string;
  summary: string;
  drivers: string[];
};


// --------------------------------------------------
// COLORS
// --------------------------------------------------

const colors: Record<string, string> = {
  Low: '#42d3c5',
  Moderate: '#8ccf9b',
  Elevated: '#f3b45b',
  High: '#f18b5b',
  Critical: '#f16b6b',
};


// --------------------------------------------------
// METRIC CARD
// --------------------------------------------------

function Metric({
  label,
  value,
  detail,
  accent = '#e8edf2',
}: {
  label: string;
  value: string;
  detail: string;
  accent?: string;
}) {
  return (
    <div className="panel min-w-0 p-4">

      <div className="flex items-center justify-between text-[10px] uppercase tracking-[.16em] text-[#8995a3]">
        <span>{label}</span>

        <Activity
          size={13}
          color={accent}
        />
      </div>

      <div
        className="mt-3 text-2xl font-extrabold"
        style={{ color: accent }}
      >
        {value}
      </div>

      <div className="mt-1 text-xs text-[#8995a3]">
        {detail}
      </div>

    </div>
  );
}


// --------------------------------------------------
// DASHBOARD
// --------------------------------------------------

export default function Dashboard() {

  const [global, setGlobal] =
    useState<Global | null>(null);

  const [countries, setCountries] =
    useState<Country[]>([]);

  const [routes, setRoutes] =
    useState<RouteData[]>([]);

  const [alerts, setAlerts] =
    useState<any[]>([]);

  const [supplyChain, setSupplyChain] =
    useState<SupplyChain | null>(null);

  const [aiAnalysis, setAiAnalysis] =
    useState<AIAnalysis | null>(null);

  const [simulation, setSimulation] =
    useState<Simulation | null>(null);

  const [loading, setLoading] =
    useState(true);

  // NEW
  const [globeOpen, setGlobeOpen] =
    useState(false);


  // --------------------------------------------------
  // LOAD DASHBOARD DATA
  // --------------------------------------------------

  useEffect(() => {

    const loadDashboard = async () => {

      try {

        const [
          globalData,
          countriesData,
          routesData,
          alertsData,
          supplyChainData,
        ] = await Promise.all([

          getData<Global>(
            '/api/risk/global'
          ),

          getData<Country[]>(
            '/api/countries'
          ),

          getData<RouteData[]>(
            '/api/routes'
          ),

          getData<any[]>(
            '/api/alerts'
          ),

          getData<SupplyChain>(
            '/api/supply-chain'
          ),
        ]);


        setGlobal(globalData);

        setCountries(countriesData);

        setRoutes(routesData);

        setAlerts(alertsData);

        setSupplyChain(
          supplyChainData
        );


      } catch (error) {

        console.error(
          'Failed to load dashboard data:',
          error
        );

      } finally {

        setLoading(false);

      }

    };


    loadDashboard();

  }, []);


  // --------------------------------------------------
  // RUN DEMO SCENARIO
  // --------------------------------------------------

  const runDemo = () => {

    postData<Simulation>(
      '/api/scenarios/simulate',
      {
        scenario: 'hormuz_closure',
        duration_days: 14,
        severity: 75,
      }
    ).then(setSimulation);

  };


  // --------------------------------------------------
  // CRITICAL ROUTES
  // --------------------------------------------------

  const criticalRoutes =
    routes.filter(
      (route) => route.risk >= 60
    );


  // --------------------------------------------------
  // DASHBOARD
  // --------------------------------------------------

  return (

    <main className="min-h-screen">

      {/* ============================================= */}
      {/* HEADER */}
      {/* ============================================= */}

      <header className="flex items-center justify-between border-b border-[#26323d] bg-[#0c151c] px-5 py-4 lg:px-8">

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 items-center justify-center rounded bg-[#42d3c5] text-[#071115]">

            <ShieldCheck size={21} />

          </div>


          <div>

            <div className="text-sm font-extrabold tracking-[.14em]">
              GEOSHIELD
            </div>

            <div className="mono text-[9px] text-[#8995a3]">
              RISK INTELLIGENCE / LIVE
            </div>

          </div>

        </div>


        <nav className="hidden gap-8 text-xs text-[#8995a3] md:flex">

          <a
            className="border-b-2 border-[#42d3c5] pb-4 text-white"
            href="/"
          >
            COMMAND CENTER
          </a>

          <a
            className="hover:text-white"
            href="/scenario"
          >
            SCENARIO LAB
          </a>

          <a
            className="hover:text-white"
            href="/analytics"
          >
            ANALYTICS
          </a>

        </nav>


        <div className="flex items-center gap-4">

          <span className="hidden items-center gap-2 text-[10px] uppercase tracking-widest text-[#42d3c5] sm:flex">

            <span className="h-2 w-2 animate-pulse rounded-full bg-[#42d3c5]" />

            Live Intelligence

          </span>

          <Menu
            className="md:hidden"
            size={18}
          />

        </div>

      </header>


      {/* ============================================= */}
      {/* MAIN CONTENT */}
      {/* ============================================= */}

      <section className="mx-auto max-w-[1600px] p-5 lg:p-8">


        {/* PAGE TITLE */}

        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">

          <div>

            <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[.2em] text-[#42d3c5]">

              <span className="h-px w-8 bg-[#42d3c5]" />

              Executive view

            </div>


            <h1 className="text-3xl font-extrabold tracking-tight">
              Global Risk Command Center
            </h1>


            <p className="mt-2 text-sm text-[#8995a3]">
              A decision layer for supply chain exposure,
              disruption, and response.
            </p>

          </div>


          <div className="flex gap-2">

            <button
              className="flex items-center gap-2 border border-[#34444d] px-3 py-2 text-xs text-[#c4d0d6] transition hover:border-[#42d3c5]"
            >

              <SlidersHorizontal size={14} />

              Configure view

            </button>


            <button
              onClick={runDemo}
              className="flex items-center gap-2 bg-[#42d3c5] px-3 py-2 text-xs font-bold text-[#071115] transition hover:bg-[#70e0d5]"
            >

              <BrainCircuit size={14} />

              Run scenario

            </button>

          </div>

        </div>


        {/* ============================================= */}
        {/* METRICS */}
        {/* ============================================= */}

        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">

          {loading ? (

            <div className="col-span-4 py-10 text-center text-sm text-[#8995a3]">
              Connecting to intelligence service...
            </div>

          ) : (

            <>

              <Metric
                label="Global risk score"
                value={`${global?.score ?? '--'}`}
                detail={`▲ ${global?.change_24h ?? 0}% vs 24h ago`}
                accent={
                  colors[
                    global?.band || 'Elevated'
                  ]
                }
              />


              <Metric
                label="Supply chain health"
                value={`${supplyChain?.health ?? '--'}%`}
                detail={`${supplyChain?.at_risk_capacity ?? 0}% capacity at risk`}
                accent="#42d3c5"
              />


              <Metric
                label="Critical routes"
                value={`${criticalRoutes.length}`}
                detail={
                  criticalRoutes.length === 1
                    ? '1 requires attention'
                    : `${criticalRoutes.length} require attention`
                }
                accent="#f16b6b"
              />


              <Metric
                label="Active alerts"
                value={`${alerts.length}`}
                detail={`Across ${
                  new Set(
                    alerts.flatMap(
                      (alert) =>
                        alert.countries || []
                    )
                  ).size
                } regions`}
                accent="#f3b45b"
              />

            </>

          )}

        </div>


        {/* ============================================= */}
        {/* MAP + ALERTS */}
        {/* ============================================= */}

        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,.75fr)]">


          {/* MAP */}

          <div className="relative">

            <WorldMap
              countries={countries}
              routes={routes}
              scenarioActive={
                Boolean(simulation)
              }
            />


            {/* 3D GLOBE BUTTON */}

            <button
              type="button"
              onClick={() =>
                setGlobeOpen(true)
              }
              className="absolute right-4 top-4 z-[1100] flex items-center gap-2 rounded border border-[#42d3c5] bg-[#071115]/95 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-[#42d3c5] shadow-xl backdrop-blur transition hover:bg-[#42d3c5] hover:text-[#071115]"
            >

              <Globe2 size={15} />

              3D Globe

            </button>

          </div>


          {/* PRIORITY SIGNALS */}

          <aside className="panel p-5">

            <div className="mb-5 flex items-center justify-between">

              <h2 className="text-sm font-bold">
                Priority signals
              </h2>

              <span className="mono text-[10px] text-[#8995a3]">
                LIVE
              </span>

            </div>


            {alerts.length === 0 ? (

              <div className="py-6 text-xs text-[#8995a3]">
                No active priority alerts.
              </div>

            ) : (

              alerts
                .slice(0, 4)
                .map((alert) => (

                  <div
                    key={alert.id}
                    className="mb-4 flex gap-3 border-b border-[#26323d] pb-4 last:border-0"
                  >

                    <CircleAlert
                      size={16}
                      color={
                        alert.severity ===
                        'Critical'
                          ? '#f16b6b'
                          : '#f3b45b'
                      }
                    />


                    <div>

                      <div className="text-xs font-bold">
                        {alert.title}
                      </div>


                      <div className="mt-1 text-[11px] leading-relaxed text-[#8995a3]">

                        {alert.type} signal across{' '}

                        {(
                          alert.countries ||
                          []
                        ).join(', ')}

                      </div>

                    </div>

                  </div>

                ))

            )}


            <div className="mt-3 flex items-center gap-2 text-xs text-[#42d3c5]">

              View all intelligence

              <ChevronRight size={13} />

            </div>

          </aside>

        </div>


        {/* ============================================= */}
        {/* LOWER PANELS */}
        {/* ============================================= */}

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">


          {/* CRITICAL ROUTES */}

          <section className="panel p-5">

            <div className="mb-4 flex items-center justify-between">

              <div>

                <h2 className="text-sm font-bold">
                  Critical supply routes
                </h2>

                <p className="mt-1 text-xs text-[#8995a3]">
                  Corridors ranked by live exposure and concentration
                </p>

              </div>


              <RouteIcon
                size={18}
                color="#8995a3"
              />

            </div>


            <div className="space-y-3">

              {routes
                .slice()
                .sort(
                  (a, b) =>
                    b.risk - a.risk
                )
                .slice(0, 4)
                .map((route) => (

                  <div
                    key={route.id}
                    className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-t border-[#26323d] pt-3"
                  >

                    <div>

                      <div className="text-xs font-bold">
                        {route.name}
                      </div>

                      <div className="mono mt-1 text-[10px] text-[#8995a3]">

                        {route.chokepoint}

                        {' · '}

                        {route.transit_days}
                        {' days transit'}

                      </div>

                    </div>


                    <div className="w-24">

                      <div className="mb-1 flex justify-between text-[10px] text-[#8995a3]">

                        <span>RISK</span>

                        <span>
                          {route.risk}
                        </span>

                      </div>


                      <div className="h-1 bg-[#26323d]">

                        <div
                          className="h-1"
                          style={{
                            width: `${route.risk}%`,
                            background:
                              route.risk > 60
                                ? '#f16b6b'
                                : '#f3b45b',
                          }}
                        />

                      </div>

                    </div>


                    <span className="mono text-xs text-[#f3b45b]">
                      {route.capacity}kt
                    </span>

                  </div>

                ))}

            </div>

          </section>


          {/* AI BRIEF */}

          <section className="panel p-5">

            <div className="mb-4 flex items-center gap-2">

              <BrainCircuit
                size={17}
                color="#42d3c5"
              />

              <h2 className="text-sm font-bold">
                AI intelligence brief
              </h2>

            </div>


            <p className="text-sm leading-7 text-[#c4d0d6]">

              {aiAnalysis?.summary ||
                'Loading live intelligence analysis...'}

            </p>


            {aiAnalysis?.drivers &&
              aiAnalysis.drivers.length >
                0 && (

                <div className="mt-5 border-l-2 border-[#42d3c5] pl-3 text-xs leading-6 text-[#8995a3]">

                  <div className="mb-1 font-bold text-[#c4d0d6]">
                    Key drivers
                  </div>


                  {aiAnalysis.drivers.map(
                    (driver, index) => (

                      <div key={index}>
                        • {driver}
                      </div>

                    )
                  )}

                </div>

              )}


            <button className="mt-5 flex items-center gap-2 text-xs font-bold text-[#42d3c5] hover:text-white">

              Open analysis

              <ArrowUpRight size={14} />

            </button>

          </section>

        </div>


        {}
        {}
        {}

        {simulation && (

          <div className="panel mt-5 border-[#f3b45b] p-5">

            <div className="flex items-start justify-between">

              <div>

                <div className="text-[10px] uppercase tracking-widest text-[#f3b45b]">
                  Simulation complete
                </div>

                <h2 className="mt-2 text-lg font-bold">
                  Strait of Hormuz closure · 14 days
                </h2>

              </div>


              <button
                onClick={() =>
                  setSimulation(null)
                }
                aria-label="Close simulation"
              >
                <X size={16} />
              </button>

            </div>


            <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">

              <Metric
                label="Supply deficit"
                value={`${simulation.supply_deficit_percent}%`}
                detail="of modeled capacity"
                accent="#f16b6b"
              />


              <Metric
                label="Cost increase"
                value={`${simulation.cost_increase_percent}%`}
                detail="transport estimate"
                accent="#f3b45b"
              />


              <Metric
                label="Reserve remaining"
                value={`${simulation.reserve_days_remaining}d`}
                detail="before stockout"
                accent="#42d3c5"
              />


              <Metric
                label="Routes affected"
                value={`${simulation.affected_routes}`}
                detail="network corridors"
                accent="#f16b6b"
              />

            </div>


            <div className="mt-4 text-xs text-[#c4d0d6]">
              {simulation.mitigation}
            </div>

          </div>

        )}

      </section>


      {}
      {}
      {}

      {globeOpen && (

        <div className="fixed inset-0 z-[9999] bg-[#050b10]">

          {/* TOP BAR */}

          <div className="absolute left-0 right-0 top-0 z-[10000] flex items-center justify-between border-b border-[#26323d] bg-[#071115]/95 px-5 py-4 backdrop-blur lg:px-8">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded bg-[#42d3c5] text-[#071115]">

                <Globe2 size={19} />

              </div>


              <div>

                <div className="text-sm font-extrabold tracking-[.14em]">
                  GEOSHIELD
                </div>

                <div className="mono text-[9px] text-[#8995a3]">
                  GLOBAL 3D NETWORK VIEW
                </div>

              </div>

            </div>


            <button
              type="button"
              onClick={() =>
                setGlobeOpen(false)
              }
              className="flex items-center gap-2 border border-[#34444d] px-4 py-2 text-xs font-bold text-[#c4d0d6] transition hover:border-[#f16b6b] hover:text-white"
            >

              <X size={16} />

              Close globe

            </button>

          </div>


          {/* GLOBE */}

          <div className="h-full w-full pt-[65px]">

            <WorldGlobe
              countries={countries}
              routes={routes}
              scenarioActive={
                Boolean(simulation)
              }
              onClose={() => setGlobeOpen(false)}
            />

          </div>


          {/* STATUS BADGE */}

          <div className="pointer-events-none absolute bottom-6 left-6 z-[10000] rounded border border-[#34444d] bg-[#071115]/90 px-4 py-3 backdrop-blur">

            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[.16em] text-[#42d3c5]">

              <span className="h-2 w-2 animate-pulse rounded-full bg-[#42d3c5]" />

              Live network

            </div>


            <div className="mt-1 text-[10px] text-[#8995a3]">

              {countries.length} countries
              {' · '}
              {routes.length} corridors

            </div>

          </div>

        </div>

      )}

    </main>

  );
}