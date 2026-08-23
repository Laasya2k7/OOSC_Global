'use client';

import { useState } from 'react';
import {
  ArrowLeft,
  BrainCircuit,
  ChevronDown,
  ShieldCheck,
  Timer,
  TriangleAlert,
} from 'lucide-react';

import { postData } from '../../lib/api';

type Result = {
  supply_deficit_percent: number;
  cost_increase_percent: number;
  transit_time_increase_percent: number;
  reserve_days_remaining: number;
  affected_routes: number;
  affected_suppliers: number;
  mitigation: string;
  route_details: any[];
};

export default function ScenarioPage() {
  const [scenario, setScenario] = useState('hormuz_closure');
  const [duration, setDuration] = useState(14);
  const [severity, setSeverity] = useState(75);
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);

  const run = () => {
    setBusy(true);

    postData<Result>('/api/scenarios/simulate', {
      scenario,
      duration_days: duration,
      severity,
    })
      .then(setResult)
      .finally(() => setBusy(false));
  };

  return (
    <main className="min-h-screen">

      {/* Header */}
      <header className="flex items-center justify-between border-b border-[#26323d] bg-[#0c151c] px-5 py-4 lg:px-8">
        <a href="/" className="flex items-center gap-3">

          <div className="flex h-9 w-9 items-center justify-center rounded bg-[#42d3c5] text-[#071115]">
            <ShieldCheck size={21} />
          </div>

          <div>
            <div className="text-sm font-extrabold tracking-[.14em]">
              GEOSHIELD
            </div>

            <div className="mono text-[9px] text-[#8995a3]">
              SCENARIO LAB
            </div>
          </div>

        </a>

        <span className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#42d3c5]">
          <span className="h-2 w-2 rounded-full bg-[#42d3c5]" />
          Live Mode
        </span>
      </header>


      {/* Main Content */}
      <section className="mx-auto max-w-[1200px] p-5 lg:p-10">

        {/* Back button */}
        <a
          href="/"
          className="mb-7 flex items-center gap-2 text-xs text-[#8995a3] hover:text-white"
        >
          <ArrowLeft size={14} />
          Back to command center
        </a>


        <div className="grid gap-5 lg:grid-cols-[340px_1fr]">

          {/* ========================= */}
          {/* Scenario Controls */}
          {/* ========================= */}

          <section className="panel h-fit p-6">

            <div className="mb-6 flex items-center gap-2">
              <BrainCircuit size={18} color="#42d3c5" />

              <h1 className="text-lg font-bold">
                Scenario Lab
              </h1>
            </div>


            <p className="mb-6 text-xs leading-6 text-[#8995a3]">
              Stress test the supply network with deterministic demo
              calculations.
            </p>


            {/* Scenario Type */}
            <label className="mb-2 block text-[10px] uppercase tracking-widest text-[#8995a3]">
              Scenario type
            </label>

            <div className="relative mb-5">

              <select
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                className="w-full appearance-none border border-[#34444d] bg-[#0c151c] p-3 text-xs text-white"
              >

                <option value="hormuz_closure">
                  Strait of Hormuz closure
                </option>

                <option value="port_shutdown">
                  Major port shutdown
                </option>

                <option value="supplier_sanctions">
                  Supplier sanctions
                </option>

                <option value="route_disruption">
                  Shipping route disruption
                </option>

                <option value="risk_surge">
                  Geopolitical risk increase
                </option>

                <option value="red_sea_disruption">
                  Red Sea / Suez disruption
                </option>

                <option value="supplier_failure">
                  Major supplier failure
                </option>

                <option value="cyberattack">
                  Cyberattack on logistics network
                </option>

                <option value="extreme_weather">
                  Extreme weather disruption
                </option>

                <option value="demand_surge">
                  Global demand surge
                </option>

              </select>

              <ChevronDown
                className="pointer-events-none absolute right-3 top-3"
                size={15}
              />

            </div>


            {/* Duration */}
            <label className="mb-2 block text-[10px] uppercase tracking-widest text-[#8995a3]">
              Duration: {duration} days
            </label>

            <input
              className="mb-5 w-full accent-[#42d3c5]"
              type="range"
              min="1"
              max="90"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />


            {/* Severity */}
            <label className="mb-2 block text-[10px] uppercase tracking-widest text-[#8995a3]">
              Severity: {severity}%
            </label>

            <input
              className="mb-7 w-full accent-[#f3b45b]"
              type="range"
              min="1"
              max="100"
              value={severity}
              onChange={(e) => setSeverity(Number(e.target.value))}
            />


            {/* Run Simulation */}
            <button
              disabled={busy}
              onClick={run}
              className="flex w-full items-center justify-center gap-2 bg-[#42d3c5] px-4 py-3 text-xs font-bold text-[#071115] disabled:opacity-60"
            >
              {busy ? 'Running model...' : 'Run simulation'}

              <Timer size={14} />
            </button>

          </section>


          {/* ========================= */}
          {/* Results */}
          {/* ========================= */}

          <section className="panel p-6">

            {result ? (

              <>

                {/* Result Header */}
                <div className="mb-7 flex items-center justify-between">

                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-[#f3b45b]">
                      Model output
                    </div>

                    <h2 className="mt-2 text-xl font-bold">
                      Before / after impact
                    </h2>
                  </div>

                  <TriangleAlert
                    color="#f3b45b"
                    size={20}
                  />

                </div>


                {/* Metrics */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

                  {[
                    [
                      'Supply deficit',
                      `${result.supply_deficit_percent}%`,
                      '#f16b6b',
                    ],

                    [
                      'Transport cost',
                      `+${result.cost_increase_percent}%`,
                      '#f3b45b',
                    ],

                    [
                      'Transit time',
                      `+${result.transit_time_increase_percent}%`,
                      '#f3b45b',
                    ],

                    [
                      'Reserve remaining',
                      `${result.reserve_days_remaining} days`,
                      '#42d3c5',
                    ],

                    [
                      'Routes affected',
                      `${result.affected_routes}`,
                      '#f16b6b',
                    ],

                    [
                      'Suppliers affected',
                      `${result.affected_suppliers}`,
                      '#f16b6b',
                    ],

                  ].map(([label, value, color]) => (

                    <div
                      className="border border-[#26323d] bg-[#0c151c] p-4"
                      key={label}
                    >

                      <div className="text-[10px] uppercase tracking-widest text-[#8995a3]">
                        {label}
                      </div>

                      <div
                        className="mt-3 text-2xl font-extrabold"
                        style={{ color }}
                      >
                        {value}
                      </div>

                      <div className="mt-1 text-[10px] text-[#8995a3]">
                        vs current plan
                      </div>

                    </div>

                  ))}

                </div>


                {/* ========================= */}
                {/* Affected Routes */}
                {/* ========================= */}

                {result.route_details &&
                  result.route_details.length > 0 && (

                    <div className="mt-6 border border-[#26323d] bg-[#0c151c] p-5">

                      <div className="mb-4 text-[10px] uppercase tracking-widest text-[#8995a3]">
                        Affected routes
                      </div>


                      <div className="space-y-3">

                        {result.route_details.map((route: any) => (

                          <div
                            key={route.id}
                            className="flex items-center justify-between border-b border-[#26323d] pb-3 last:border-0"
                          >

                            <div>

                              <div className="text-sm font-semibold">
                                {route.name}
                              </div>

                              <div className="mt-1 text-[10px] text-[#8995a3]">
                                {route.from} → {route.to}
                              </div>

                            </div>


                            <div className="text-right">

                              <div
                                className="mono text-sm"
                                style={{
                                  color:
                                    route.risk > 60
                                      ? '#f16b6b'
                                      : '#f3b45b',
                                }}
                              >
                                Risk {route.risk}
                              </div>

                              <div className="text-[10px] text-[#8995a3]">
                                {route.capacity}kt
                              </div>

                            </div>

                          </div>

                        ))}

                      </div>

                    </div>

                  )}


                {/* ========================= */}
                {/* Recommended Mitigation */}
                {/* ========================= */}

                <div className="mt-6 border-l-2 border-[#42d3c5] pl-4 text-sm leading-7 text-[#c4d0d6]">

                  <strong className="text-white">
                    Recommended mitigation
                  </strong>

                  <br />

                  {result.mitigation}

                </div>

              </>

            ) : (

              /* Empty State */

              <div className="flex min-h-[400px] flex-col items-center justify-center text-center">

                <BrainCircuit
                  size={34}
                  color="#42d3c5"
                />

                <h2 className="mt-5 text-lg font-bold">
                  Ready to stress test the network
                </h2>

                <p className="mt-2 max-w-sm text-sm leading-6 text-[#8995a3]">
                  Choose an event profile, tune the severity,
                  and run the deterministic impact model.
                </p>

              </div>

            )}

          </section>

        </div>

      </section>

    </main>
  );
}