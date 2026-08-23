'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  CircleMarker,
  MapContainer,
  Polyline,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
} from 'react-leaflet';

import { LatLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { getData } from '../../lib/api';

type Country = {
  id: string;
  name: string;
  score: number;
  band: string;
  lat: number;
  lng: number;
  stability?: number;
  conflict?: number;
  sanctions?: number;
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

type Port = {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  capacity: number;
};

type Supplier = {
  id: string;
  name: string;
  country: string;
  commodity: string;
  capacity: number;
  reliability: number;
};

type Selection = {
  kind: 'country' | 'route' | 'port' | 'supplier';
  item: Country | RouteData | Port | Supplier;
};

/* ----------------------------- */
/* Risk helpers */
/* ----------------------------- */

const riskColor = (score: number) => {
  if (score >= 80) return '#f16b6b';
  if (score >= 60) return '#f18b5b';
  if (score >= 40) return '#f3b45b';
  if (score >= 20) return '#8ccf9b';

  return '#42d3c5';
};

const riskLabel = (score: number) => {
  if (score >= 80) return 'CRITICAL';
  if (score >= 60) return 'HIGH';
  if (score >= 40) return 'ELEVATED';
  if (score >= 20) return 'MODERATE';

  return 'LOW';
};

/* ----------------------------- */
/* Coordinates */
/* ----------------------------- */

const coords = (
  id: string,
  ports: Port[],
  countries: Country[],
) => {
  const port = ports.find((item) => item.id === id);

  if (port) {
    return [port.lat, port.lng] as [number, number];
  }

  const country = countries.find((item) => item.id === id);

  if (country) {
    return [country.lat, country.lng] as [number, number];
  }

  return null;
};

/* ----------------------------- */
/* Map bounds */
/* ----------------------------- */

const WORLD_BOUNDS = new LatLngBounds(
  [-58, -180],
  [78, 180],
);

/* ----------------------------- */
/* Map viewport */
/* ----------------------------- */

function MapViewport() {
  const map = useMap();

  useEffect(() => {
    const fitWorld = () => {
      map.fitBounds(WORLD_BOUNDS, {
        padding: [28, 28],
        maxZoom: 2,
        animate: false,
      });
    };

    fitWorld();

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize({
        pan: false,
      });
    });

    resizeObserver.observe(map.getContainer());

    window.addEventListener('resize', fitWorld);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', fitWorld);
    };
  }, [map]);

  return null;
}

/* ----------------------------- */
/* Fit world button */
/* ----------------------------- */

function FitWorldControl() {
  const map = useMap();

  return (
    <button
      type="button"
      className="
        absolute
        right-4
        top-4
        z-[1000]
        rounded-md
        border
        border-[#40515b]
        bg-[#0b141b]/95
        px-4
        py-2
        text-[10px]
        font-bold
        uppercase
        tracking-[0.14em]
        text-[#e8edf2]
        shadow-lg
        backdrop-blur
        transition
        hover:border-[#42d3c5]
        hover:bg-[#122029]
      "
      onClick={() =>
        map.fitBounds(WORLD_BOUNDS, {
          padding: [28, 28],
          maxZoom: 2,
        })
      }
    >
      Fit world
    </button>
  );
}

/* ----------------------------- */
/* Main map */
/* ----------------------------- */

export default function WorldMap({
  countries,
  routes,
}: {
  countries: Country[];
  routes: RouteData[];
}) {
  const [ports, setPorts] = useState<Port[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selection, setSelection] =
    useState<Selection | null>(null);

  /* ----------------------------- */
  /* Load map data */
  /* ----------------------------- */

  useEffect(() => {
    Promise.all([
      getData<Port[]>('/api/ports'),
      getData<Supplier[]>('/api/suppliers'),
    ])
      .then(([nextPorts, nextSuppliers]) => {
        setPorts(nextPorts);
        setSuppliers(nextSuppliers);
      })
      .catch((error) => {
        console.error(
          'Failed to load map data:',
          error,
        );
      });
  }, []);

  const countriesById = useMemo(
    () =>
      new Map(
        countries.map((country) => [
          country.id,
          country,
        ]),
      ),
    [countries],
  );

  /* ----------------------------- */
  /* Scenario route state */
  /* ----------------------------- */

  /////

  const selectedCountry =
    selection?.kind === 'country'
      ? (selection.item as Country)
      : null;

  return (
    <div
      className="
        relative
        min-h-[420px]
        overflow-hidden
        rounded-xl
        border
        border-[#26323d]
        bg-[#0b141b]
        shadow-2xl
        md:min-h-[600px]
      "
    >
      {/* -------------------------------- */}
      {/* Map */}
      {/* -------------------------------- */}

      <MapContainer
        center={[20, 0]}
        zoom={1}
        minZoom={1}
        maxZoom={18}
        zoomSnap={0.25}
        zoomDelta={1}
        wheelPxPerZoomLevel={80}
        scrollWheelZoom
        doubleClickZoom
        dragging
        touchZoom
        className="
          h-[420px]
          w-full
          bg-[#10242c]
          md:h-[600px]
        "
        attributionControl
      >
        <MapViewport />

        <FitWorldControl />

        {/* Base map */}

        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          attribution="&copy; Esri, HERE, Garmin, &copy; OpenStreetMap contributors"
          opacity={0.94}
        />

        {/* Country labels */}

        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
          attribution="&copy; Esri"
          opacity={0.96}
        />

        {/* -------------------------------- */}
        {/* Routes */}
        {/* -------------------------------- */}

        {routes.map((route) => {
          const from = coords(
            route.from,
            ports,
            countries,
          );

          const to = coords(
            route.to,
            ports,
            countries,
          );

          if (!from || !to) return null;

          const highRisk = route.risk >= 60;

          return (
            <Polyline
              key={route.id}
              positions={[from, to]}
              pathOptions={{
                color: riskColor(route.risk),
                weight: highRisk ? 5 : 2.5,
                opacity: highRisk ? 0.95 : 0.7,
                dashArray: undefined,
                lineCap: 'round',
                lineJoin: 'round',
              }}
              eventHandlers={{
                click: () =>
                  setSelection({
                    kind: 'route',
                    item: route,
                  }),
              }}
            >
              <Tooltip
                sticky
                direction="top"
                className="custom-map-tooltip"
              >
                <div className="font-semibold">
                  {route.name}
                </div>

                <div className="mt-1 text-[11px]">
                  Risk {route.risk} · {riskLabel(route.risk)}
                </div>
              </Tooltip>
            </Polyline>
          );
        })}

        {/* -------------------------------- */}
        {/* Countries */}
        {/* -------------------------------- */}

        {countries.map((country) => {
          const color = riskColor(country.score);

          return (
            <CircleMarker
              key={country.id}
              center={[
                country.lat,
                country.lng,
              ]}
              radius={Math.max(
                7,
                Math.min(
                  17,
                  country.score / 5,
                ),
              )}
              pathOptions={{
                color,
                fillColor: color,
                fillOpacity: 0.8,
                weight: 2,
              }}
              eventHandlers={{
                click: () =>
                  setSelection({
                    kind: 'country',
                    item: country,
                  }),
              }}
            >
              <Tooltip>
                <div className="font-semibold">
                  {country.name}
                </div>

                <div className="mt-1">
                  Risk {country.score} ·{' '}
                  {country.band}
                </div>
              </Tooltip>

              <Popup>
                <div className="min-w-[150px]">
                  <strong>{country.name}</strong>

                  <div className="mt-2">
                    Risk: {country.score}
                  </div>

                  <div>
                    Band: {country.band}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}

        {/* -------------------------------- */}
        {/* Ports */}
        {/* -------------------------------- */}

        {ports.map((port) => (
          <CircleMarker
            key={port.id}
            center={[
              port.lat,
              port.lng,
            ]}
            radius={5}
            pathOptions={{
              color: '#e8edf2',
              fillColor: '#42d3c5',
              fillOpacity: 1,
              weight: 2,
            }}
            eventHandlers={{
              click: () =>
                setSelection({
                  kind: 'port',
                  item: port,
                }),
            }}
          >
            <Tooltip>
              {port.name} · Port
            </Tooltip>
          </CircleMarker>
        ))}

        {/* -------------------------------- */}
        {/* Suppliers */}
        {/* -------------------------------- */}

        {suppliers.map((supplier) => {
          const country =
            countriesById.get(
              supplier.country,
            );

          if (!country) return null;

          return (
            <CircleMarker
              key={supplier.id}
              center={[
                country.lat + 1.4,
                country.lng + 1.4,
              ]}
              radius={4}
              pathOptions={{
                color: '#071115',
                fillColor: '#f3b45b',
                fillOpacity: 1,
                weight: 2,
              }}
              eventHandlers={{
                click: () =>
                  setSelection({
                    kind: 'supplier',
                    item: supplier,
                  }),
              }}
            >
              <Tooltip>
                {supplier.name} · Supplier
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* -------------------------------- */}
      {/* Top status bar */}
      {/* -------------------------------- */}

      <div
        className="
          pointer-events-none
          absolute
          left-4
          top-4
          z-[1000]
          flex
          items-center
          gap-3
          rounded-md
          border
          border-[#40515b]
          bg-[#0b141b]/90
          px-4
          py-2.5
          text-[10px]
          uppercase
          tracking-[0.14em]
          text-[#e8edf2]
          shadow-lg
          backdrop-blur
        "
      >
        <span
          className="
            inline-block
            h-2
            w-2
            rounded-full
            bg-[#42d3c5]
            shadow-[0_0_10px_#42d3c5]
          "
        />

        <span>
          Global supply network
        </span>

        <span className="text-[#52636a]">
          /
        </span>

        <span className="text-[#8995a3]">
          Live dataset
        </span>
      </div>

      {/* -------------------------------- */}
      {/* Scenario warning */}
      {/* -------------------------------- */}


      {/* -------------------------------- */}
      {/* Risk legend */}
      {/* -------------------------------- */}

      <div
        className="
          absolute
          bottom-4
          left-4
          z-[1000]
          rounded-lg
          border
          border-[#40515b]
          bg-[#0b141b]/95
          p-4
          text-[10px]
          uppercase
          tracking-wider
          text-[#c4d0d6]
          shadow-xl
          backdrop-blur
        "
      >
        <div className="mb-3 text-[9px] font-bold tracking-[0.16em] text-[#8995a3]">
          RISK LEVEL
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {[
            ['Low', 10],
            ['Moderate', 30],
            ['Elevated', 50],
            ['High', 70],
            ['Critical', 90],
          ].map(([label, score]) => (
            <span
              key={label}
              className="flex items-center gap-1.5"
            >
              <i
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  background:
                    riskColor(Number(score)),
                  boxShadow: `0 0 6px ${riskColor(
                    Number(score),
                  )}`,
                }}
              />

              {label}
            </span>
          ))}
        </div>
      </div>

      {/* -------------------------------- */}
      {/* Dataset stats */}
      {/* -------------------------------- */}

      <div
        className="
          absolute
          bottom-4
          right-4
          z-[1000]
          hidden
          rounded-lg
          border
          border-[#40515b]
          bg-[#0b141b]/95
          px-4
          py-3
          text-[9px]
          uppercase
          tracking-[0.12em]
          text-[#8995a3]
          shadow-xl
          backdrop-blur
          sm:block
        "
      >
        <div className="flex gap-5">
          <div>
            <div className="text-[#42d3c5]">
              {countries.length}
            </div>
            Countries
          </div>

          <div>
            <div className="text-[#42d3c5]">
              {routes.length}
            </div>
            Routes
          </div>

          <div>
            <div className="text-[#42d3c5]">
              {ports.length}
            </div>
            Ports
          </div>
        </div>
      </div>

      {/* -------------------------------- */}
      {/* Selection panel */}
      {/* -------------------------------- */}

      {selection && (
        <div
          className="
            absolute
            right-4
            top-20
            z-[1000]
            w-[280px]
            rounded-xl
            border
            border-[#42d3c5]/50
            bg-[#0b141b]/95
            p-5
            shadow-2xl
            backdrop-blur-xl
          "
        >
          {/* Close */}

          <button
            className="
              float-right
              text-lg
              text-[#8995a3]
              transition
              hover:text-white
            "
            onClick={() =>
              setSelection(null)
            }
            aria-label="Close details"
          >
            ×
          </button>

          {/* Type */}

          <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#42d3c5]">
            Selected {selection.kind}
          </div>

          {/* Country */}

          {selection.kind ===
            'country' &&
            selectedCountry && (
              <>
                <h3 className="mt-2 text-base font-bold text-white">
                  {selectedCountry.name}
                </h3>

                <div
                  className="mt-1 text-xs font-bold"
                  style={{
                    color: riskColor(
                      selectedCountry.score,
                    ),
                  }}
                >
                  {riskLabel(
                    selectedCountry.score,
                  )}{' '}
                  · {selectedCountry.score}
                </div>

                <div className="mt-5 space-y-3">
                  {[
                    [
                      'Political stability',
                      selectedCountry.stability,
                    ],
                    [
                      'Conflict exposure',
                      selectedCountry.conflict,
                    ],
                    [
                      'Sanctions',
                      selectedCountry.sanctions,
                    ],
                  ].map(([label, value]) => (
                    <div
                      key={String(label)}
                      className="
                        flex
                        justify-between
                        border-b
                        border-[#26323d]
                        pb-2
                        text-xs
                      "
                    >
                      <span className="text-[#8995a3]">
                        {label}
                      </span>

                      <strong>
                        {value ?? 'n/a'}
                      </strong>
                    </div>
                  ))}
                </div>
              </>
            )}

          {/* Route */}

          {selection.kind ===
            'route' && (
              <>
                <h3 className="mt-2 text-base font-bold">
                  {(selection.item as RouteData)
                    .name}
                </h3>

                <div
                  className="mt-1 text-xs font-bold"
                  style={{
                    color: riskColor(
                      (selection.item as RouteData)
                        .risk,
                    ),
                  }}
                >
                  {riskLabel(
                    (selection.item as RouteData)
                      .risk,
                  )}{' '}
                  ·{' '}
                  {
                    (selection.item as RouteData)
                      .risk
                  }
                </div>

                <div className="mt-5 space-y-3">
                  {[
                    [
                      'Capacity',
                      `${
                        (
                          selection.item as RouteData
                        ).capacity
                      }kt`,
                    ],
                    [
                      'Transit',
                      `${
                        (
                          selection.item as RouteData
                        ).transit_days
                      } days`,
                    ],
                    [
                      'Cost',
                      `$${(
                        selection.item as RouteData
                      ).cost}/unit`,
                    ],
                    [
                      'Chokepoint',
                      (
                        selection.item as RouteData
                      ).chokepoint,
                    ],
                    [
                      'Availability',
                      'Available',
                    ],
                  ].map(([label, value]) => (
                    <div
                      key={String(label)}
                      className="
                        flex
                        justify-between
                        gap-4
                        border-b
                        border-[#26323d]
                        pb-2
                        text-xs
                      "
                    >
                      <span className="text-[#8995a3]">
                        {label}
                      </span>

                      <strong className="text-right">
                        {value}
                      </strong>
                    </div>
                  ))}
                </div>
              </>
            )}

          {/* Port */}

          {selection.kind ===
            'port' && (
              <>
                <h3 className="mt-2 text-base font-bold">
                  {(selection.item as Port).name}
                </h3>

                <div className="mt-5 border border-[#26323d] bg-[#101820] p-3">
                  <div className="text-[9px] uppercase tracking-widest text-[#8995a3]">
                    Port capacity
                  </div>

                  <div className="mt-2 text-xl font-bold text-[#42d3c5]">
                    {
                      (selection.item as Port)
                        .capacity
                    }
                    kt
                  </div>
                </div>
              </>
            )}

          {/* Supplier */}

          {selection.kind ===
            'supplier' && (
              <>
                <h3 className="mt-2 text-base font-bold">
                  {
                    (selection.item as Supplier)
                      .name
                  }
                </h3>

                <p className="mt-4 text-xs leading-6 text-[#c4d0d6]">
                  {
                    (
                      selection.item as Supplier
                    ).commodity
                  }
                </p>

                <div className="mt-4 space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#8995a3]">
                      Capacity
                    </span>

                    <strong>
                      {
                        (
                          selection.item as Supplier
                        ).capacity
                      }
                      kt
                    </strong>
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className="text-[#8995a3]">
                      Reliability
                    </span>

                    <strong className="text-[#42d3c5]">
                      {
                        (
                          selection.item as Supplier
                        ).reliability
                      }
                      %
                    </strong>
                  </div>
                </div>
              </>
            )}
        </div>
      )}
    </div>
  );
}