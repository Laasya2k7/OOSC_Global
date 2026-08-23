'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { X, Globe2 } from 'lucide-react';

const Globe = dynamic(() => import('react-globe.gl'), {
  ssr: false,
});

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

type Props = {
  countries: Country[];
  routes: RouteData[];
  onClose: () => void;
};

type ArcData = {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string;
  route: RouteData;
};

type PolygonData = {
  country?: Country;
  geometry: unknown;
  properties?: {
    name?: string;
  };
};

function riskColor(score: number) {
  if (score >= 80) return '#f16b6b';
  if (score >= 60) return '#f18b5b';
  if (score >= 40) return '#f3b45b';
  if (score >= 20) return '#8ccf9b';
  return '#42d3c5';
}

export default function WorldGlobe({
  countries,
  routes,
  onClose,
}: Props) {
  const [polygons, setPolygons] = useState<PolygonData[]>([]);
  const [selectedCountry, setSelectedCountry] =
    useState<Country | null>(null);

  /*
   * Load world country boundaries.
   *
   * The actual risk information still comes from
   * your backend `countries` data.
   */
  useEffect(() => {
    fetch(
      'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson'
    )
      .then((response) => response.json())
      .then((geojson) => {
        const features = geojson.features || [];

        const nextPolygons: PolygonData[] = features.map(
          (feature: any) => {
            const countryName =
              feature.properties?.name || '';

            /*
             * Match GeoJSON country name with your
             * backend country name.
             */
            const country = countries.find(
              (item) =>
                item.name.toLowerCase() ===
                countryName.toLowerCase()
            );

            return {
              ...feature,
              geometry: feature.geometry,
              properties: feature.properties,
              country,
            };
          }
        );

        setPolygons(nextPolygons);
      })
      .catch((error) => {
        console.error(
          'Failed to load country boundaries:',
          error
        );
      });
  }, [countries]);

  /*
   * Country lookup for routes.
   */
  const countriesById = useMemo(() => {
    return new Map(
      countries.map((country) => [
        country.id,
        country,
      ])
    );
  }, [countries]);

  /*
   * Convert your existing routes into globe arcs.
   */
  const arcs = useMemo<ArcData[]>(() => {
    return routes
      .map((route) => {
        const from = countriesById.get(route.from);
        const to = countriesById.get(route.to);

        if (!from || !to) {
          return null;
        }

        

        return {
          startLat: from.lat,
          startLng: from.lng,
          endLat: to.lat,
          endLng: to.lng,
          color: riskColor(route.risk),
          route,
        };
      })
      .filter(
        (item): item is ArcData =>
          item !== null
      );
  }, [
    routes,
    countriesById
  ]);

  /*
   * Country points.
   */
  const points = useMemo(() => {
    return countries.map((country) => ({
      lat: country.lat,
      lng: country.lng,
      name: country.name,
      score: country.score,
      band: country.band,
      color: riskColor(country.score),
      country,
    }));
  }, [countries]);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#050b10]">

      {/* ================= HEADER ================= */}

      <div className="absolute left-0 right-0 top-0 z-[10000] flex items-center justify-between border-b border-[#26323d] bg-[#071115]/95 px-5 py-4 backdrop-blur-md lg:px-8">

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 items-center justify-center rounded bg-[#42d3c5] text-[#071115]">
            <Globe2 size={20} />
          </div>

          <div>
            <div className="text-sm font-extrabold tracking-[.14em]">
              GEOSHIELD
            </div>

            <div className="mono text-[9px] tracking-widest text-[#8995a3]">
              GLOBAL 3D RISK VIEW
            </div>
          </div>

          <div className="ml-4 hidden items-center gap-2 border-l border-[#26323d] pl-4 text-[10px] uppercase tracking-widest text-[#42d3c5] md:flex">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#42d3c5]" />

            Live Network
          </div>

        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2 rounded border border-[#52636a] bg-[#101820]/90 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#e8edf2] transition hover:border-[#42d3c5] hover:text-[#42d3c5]"
        >
          <X size={15} />
          Close
        </button>

      </div>

      {/* ================= GLOBE ================= */}

      <div className="absolute inset-0 pt-[65px]">

        <Globe

          width={
            typeof window !== 'undefined'
              ? window.innerWidth
              : 1200
          }

          height={
            typeof window !== 'undefined'
              ? window.innerHeight - 65
              : 700
          }

          backgroundColor="#050b10"

          globeImageUrl="https://unpkg.com/three-globe/example/img/earth-night.jpg"

          bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"

          showAtmosphere={true}

          atmosphereColor="#42d3c5"

          atmosphereAltitude={0.18}

          enablePointerInteraction={true}

          animateIn={true}

          polygonsData={polygons}

          polygonGeoJsonGeometry="geometry"

          polygonAltitude={0.012}

          polygonCapCurvatureResolution={5}

          polygonCapColor={(d: object) => {
            const polygon =
              d as PolygonData;

            if (!polygon.country) {
              return 'rgba(16,35,44,0.25)';
            }

            const color =
              riskColor(
                polygon.country.score
              );

            return `${color}99`;
          }}

          /*
           * Slightly darker sides give the
           * countries a 3D/extruded appearance.
           */
          polygonSideColor={(d: object) => {
            const polygon =
              d as PolygonData;

            if (!polygon.country) {
              return 'rgba(16,35,44,0.20)';
            }

            const color =
              riskColor(
                polygon.country.score
              );

            return `${color}55`;
          }}

          /*
           * Colored country borders.
           */
          polygonStrokeColor={(d: object) => {
            const polygon =
              d as PolygonData;

            if (!polygon.country) {
              return '#26323d';
            }

            return riskColor(
              polygon.country.score
            );
          }}

          /*
           * Clicking a country.
           */
          onPolygonClick={(polygon: object) => {
            const data =
              polygon as PolygonData;

            if (data.country) {
              setSelectedCountry(
                data.country
              );
            }
          }}

          /*
           * Slight hover effect.
           */
          polygonLabel={(d: object) => {
            const polygon =
              d as PolygonData;

            if (!polygon.country) {
              return '';
            }

            return `
              <div style="
                padding:8px 10px;
                background:#101820;
                border:1px solid #42d3c5;
                border-radius:6px;
                color:white;
                font-family:Arial;
              ">
                <strong>
                  ${polygon.country.name}
                </strong>
                <br/>
                <span style="color:${riskColor(
                  polygon.country.score
                )}">
                  Risk: ${polygon.country.score}
                </span>
              </div>
            `;
          }}


          arcsData={arcs}

          arcStartLat={(d: object) =>
            (d as ArcData).startLat
          }

          arcStartLng={(d: object) =>
            (d as ArcData).startLng
          }

          arcEndLat={(d: object) =>
            (d as ArcData).endLat
          }

          arcEndLng={(d: object) =>
            (d as ArcData).endLng
          }

          arcColor={(d: object) =>
            (d as ArcData).color
          }

          arcAltitudeAutoScale={0.45}

          arcStroke={0.7}

          arcDashLength={0.35}

          arcDashGap={0.15}

          arcDashAnimateTime={1800
          }

          arcsTransitionDuration={800}

          /*
           * Clicking a route.
           */
          onArcClick={(arc: object) => {
            const route =
              (arc as ArcData).route;

            console.log(
              'Selected route:',
              route.name
            );
          }}


          labelsData={points}

          labelLat={(d: object) =>
            (d as typeof points[number]).lat
          }

          labelLng={(d: object) =>
            (d as typeof points[number]).lng
          }

          labelText={(d: object) =>
            (d as typeof points[number]).name
          }

          labelColor={() => '#050b10'}
          labelSize={0.65}
          labelDotRadius={0.18}
          labelResolution={2}
          labelAltitude={0.04}

        />

      </div>


      {/* ================= COUNTRY INFO ================= */}

      {selectedCountry && (
        <div className="absolute right-5 top-24 z-[10000] w-72 rounded-lg border border-[#42d3c5] bg-[#101820]/95 p-5 shadow-2xl backdrop-blur-md">

          <button
            onClick={() =>
              setSelectedCountry(null)
            }
            className="float-right text-[#8995a3] hover:text-white"
          >
            ×
          </button>

          <div className="text-[10px] uppercase tracking-widest text-[#42d3c5]">
            Country risk
          </div>

          <h2 className="mt-2 text-lg font-bold text-white">
            {selectedCountry.name}
          </h2>

          <div
            className="mt-4 text-4xl font-extrabold"
            style={{
              color: riskColor(
                selectedCountry.score
              ),
            }}
          >
            {selectedCountry.score}
          </div>

          <div className="mt-1 text-xs uppercase tracking-wider text-[#8995a3]">
            {selectedCountry.band}
          </div>

          <div className="mt-5 space-y-3 text-xs">

            <div className="flex justify-between border-b border-[#26323d] pb-2">
              <span className="text-[#8995a3]">
                Political stability
              </span>

              <strong>
                {selectedCountry.stability ??
                  'N/A'}
              </strong>
            </div>

            <div className="flex justify-between border-b border-[#26323d] pb-2">
              <span className="text-[#8995a3]">
                Conflict exposure
              </span>

              <strong>
                {selectedCountry.conflict ??
                  'N/A'}
              </strong>
            </div>

            <div className="flex justify-between">
              <span className="text-[#8995a3]">
                Sanctions
              </span>

              <strong>
                {selectedCountry.sanctions ??
                  'N/A'}
              </strong>
            </div>

          </div>

        </div>
      )}


      {/* ================= LEGEND ================= */}

      <div className="absolute bottom-5 left-5 z-[10000] rounded-lg border border-[#52636a] bg-[#101820]/95 p-4 shadow-2xl backdrop-blur-md">

        <div className="mb-3 text-[10px] uppercase tracking-widest text-[#8995a3]">
          Risk layer
        </div>

        <div className="flex flex-wrap gap-4 text-[10px] uppercase tracking-wider text-[#c4d0d6]">

          {[
            ['Low', 10],
            ['Moderate', 30],
            ['Elevated', 50],
            ['High', 70],
            ['Critical', 90],
          ].map(
            ([label, score]) => (
              <span
                key={label}
                className="flex items-center gap-1.5"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    background:
                      riskColor(
                        Number(score)
                      ),
                  }}
                />

                {label}
              </span>
            )
          )}

        </div>

      </div>


      {/* ================= NETWORK INFO ================= */}

      <div className="absolute bottom-5 right-5 z-[10000] hidden rounded-lg border border-[#26323d] bg-[#101820]/95 px-4 py-3 text-right backdrop-blur-md md:block">

        <div className="text-[10px] uppercase tracking-widest text-[#8995a3]">
          Network
        </div>

        <div className="mt-1 text-sm font-bold text-white">
          {countries.length} countries
        </div>

        <div className="mt-1 text-[10px] text-[#42d3c5]">
          {arcs.length} active corridors
        </div>

      </div>

    </div>
  );
}