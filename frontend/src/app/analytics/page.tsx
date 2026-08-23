'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, BarChart3, ShieldCheck } from 'lucide-react';
import { getData } from '../../lib/api';

export default function Analytics() {
  const [countries, setCountries] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      getData<any[]>('/api/countries'),
      getData<any[]>('/api/routes'),
    ]).then(([c, r]) => {
      setCountries(c);
      setRoutes(r);
    });
  }, []);

  return (
    <main className="min-h-screen">
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
              ANALYTICS WORKSPACE
            </div>
          </div>
        </a>

        <span className="text-[10px] uppercase tracking-widest text-[#42d3c5]">
          Live
        </span>
      </header>

      <section className="mx-auto max-w-[1200px] p-5 lg:p-10">
        <a
          href="/"
          className="mb-7 flex items-center gap-2 text-xs text-[#8995a3] hover:text-white"
        >
          <ArrowLeft size={14} />
          Back to command center
        </a>

        <div className="mb-7 flex items-end justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#42d3c5]">
              <BarChart3 size={13} />
              Network analytics
            </div>

            <h1 className="text-2xl font-extrabold">
              Exposure by node and corridor
            </h1>
          </div>

          <span className="mono text-[10px] text-[#8995a3]">
            LIVE DATASET / {countries.length} COUNTRIES
          </span>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <section className="panel p-6">
            <h2 className="mb-5 text-sm font-bold">
              Country risk ranking
            </h2>

            <div className="space-y-4">
              {countries
                .sort((a, b) => b.score - a.score)
                .slice(0, 8)
                .map((c) => (
                  <div key={c.id}>
                    <div className="mb-2 flex justify-between text-xs">
                      <span>{c.name}</span>

                      <span
                        className="mono"
                        style={{
                          color:
                            c.score > 60
                              ? '#f16b6b'
                              : '#f3b45b',
                        }}
                      >
                        {c.score}
                      </span>
                    </div>

                    <div className="h-2 bg-[#26323d]">
                      <div
                        className="h-2"
                        style={{
                          width: `${c.score}%`,
                          background:
                            c.score > 60
                              ? '#f16b6b'
                              : '#f3b45b',
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </section>

          <section className="panel p-6">
            <h2 className="mb-5 text-sm font-bold">
              Route risk and capacity
            </h2>

            <div className="space-y-4">
              {routes.map((r) => (
                <div
                  key={r.id}
                  className="border-b border-[#26323d] pb-3"
                >
                  <div className="flex justify-between text-xs">
                    <span>{r.name}</span>

                    <span className="mono text-[#8995a3]">
                      {r.capacity}kt
                    </span>
                  </div>

                  <div className="mt-2 h-2 bg-[#26323d]">
                    <div
                      className="h-2"
                      style={{
                        width: `${r.risk}%`,
                        background:
                          r.risk > 60
                            ? '#f16b6b'
                            : '#42d3c5',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}