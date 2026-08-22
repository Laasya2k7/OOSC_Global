'use client';
import { useEffect, useMemo, useState } from 'react';
import { CircleMarker, MapContainer, Polyline, Popup, TileLayer, Tooltip, useMap } from 'react-leaflet';
import { LatLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getData } from '../../lib/api';

type Country = { id: string; name: string; score: number; band: string; lat: number; lng: number; stability?: number; conflict?: number; sanctions?: number };
type RouteData = { id: string; name: string; from: string; to: string; risk: number; capacity: number; cost: number; transit_days: number; chokepoint: string };
type Port = { id: string; name: string; country: string; lat: number; lng: number; capacity: number };
type Supplier = { id: string; name: string; country: string; commodity: string; capacity: number; reliability: number };
type Selection = { kind: 'country' | 'route' | 'port' | 'supplier'; item: Country | RouteData | Port | Supplier };
const riskColor = (score: number) => score >= 80 ? '#f16b6b' : score >= 60 ? '#f18b5b' : score >= 40 ? '#f3b45b' : score >= 20 ? '#8ccf9b' : '#42d3c5';
const coords = (id: string, ports: Port[], countries: Country[]) => { const port = ports.find(item => item.id === id); if (port) return [port.lat, port.lng] as [number, number]; const country = countries.find(item => item.id === id); return country ? [country.lat, country.lng] as [number, number] : null; };
const WORLD_BOUNDS = new LatLngBounds([-58, -180], [78, 180]);

function MapViewport() {
  const map = useMap();
  useEffect(() => {
    const fitWorld = () => map.fitBounds(WORLD_BOUNDS, { padding: [28, 28], maxZoom: 2, animate: false });
    fitWorld();
    const resizeObserver = new ResizeObserver(() => map.invalidateSize({ pan: false }));
    resizeObserver.observe(map.getContainer());
    window.addEventListener('resize', fitWorld);
    return () => { resizeObserver.disconnect(); window.removeEventListener('resize', fitWorld); };
  }, [map]);
  return null;
}

function FitWorldControl() {
  const map = useMap();
  return <button type="button" className="absolute right-3 top-3 z-[1000] rounded border border-[#52636a] bg-[#101820]/95 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#e8edf2] shadow hover:border-[#42d3c5]" onClick={() => map.fitBounds(WORLD_BOUNDS, { padding: [28, 28], maxZoom: 2 })}>Fit world</button>;
}

export default function WorldMap({ countries, routes, scenarioActive = false }: { countries: Country[]; routes: RouteData[]; scenarioActive?: boolean }) {
  const [ports, setPorts] = useState<Port[]>([]); const [suppliers, setSuppliers] = useState<Supplier[]>([]); const [selection, setSelection] = useState<Selection | null>(null);
  useEffect(() => { Promise.all([getData<Port[]>('/api/ports'), getData<Supplier[]>('/api/suppliers')]).then(([nextPorts, nextSuppliers]) => { setPorts(nextPorts); setSuppliers(nextSuppliers); }).catch(() => { }); }, []);
  const countriesById = useMemo(() => new Map(countries.map(country => [country.id, country])), [countries]);
  const activeRoutes = useMemo(() => routes.map(route => scenarioActive && (route.id === 'R-HORMUZ' || route.id === 'R-DAMMAM') ? { ...route, risk: 100 } : route), [routes, scenarioActive]);
  const selectedCountry = selection?.kind === 'country' ? selection.item as Country : null;
  return <div className="relative min-h-[420px] overflow-hidden rounded-lg border border-[#26323d] bg-[#10242c] md:min-h-[600px]">
    <MapContainer center={[20, 0]} zoom={1} minZoom={1} maxZoom={18} zoomSnap={0.25} zoomDelta={1} wheelPxPerZoomLevel={80} scrollWheelZoom doubleClickZoom dragging touchZoom className="h-[420px] w-full bg-[#10242c] md:h-[600px]" attributionControl={true}>
      <MapViewport />
      <FitWorldControl />
      <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}" attribution="&copy; Esri, HERE, Garmin, &copy; OpenStreetMap contributors" opacity={0.94} />
      <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}" attribution="&copy; Esri" opacity={0.96} />
      {activeRoutes.map(route => { const from = coords(route.from, ports, countries); const to = coords(route.to, ports, countries); return from && to ? <Polyline key={route.id} positions={[from, to]} pathOptions={{ color: riskColor(route.risk), weight: route.risk > 60 ? 4 : 2, opacity: .86, dashArray: scenarioActive && route.risk > 60 ? '8 8' : undefined }} eventHandlers={{ click: () => setSelection({ kind: 'route', item: route }) }}><Tooltip sticky>{route.name} · risk {route.risk}</Tooltip></Polyline> : null; })}
      {countries.map(country => <CircleMarker key={country.id} center={[country.lat, country.lng]} radius={Math.max(7, Math.min(16, country.score / 5))} pathOptions={{ color: riskColor(country.score), fillColor: riskColor(country.score), fillOpacity: .72, weight: 2 }} eventHandlers={{ click: () => setSelection({ kind: 'country', item: country }) }}><Tooltip>{country.name} · {country.score} {country.band}</Tooltip><Popup><strong>{country.name}</strong><br />Risk {country.score} · {country.band}</Popup></CircleMarker>)}
      {ports.map(port => <CircleMarker key={port.id} center={[port.lat, port.lng]} radius={5} pathOptions={{ color: '#e8edf2', fillColor: '#42d3c5', fillOpacity: 1, weight: 2 }} eventHandlers={{ click: () => setSelection({ kind: 'port', item: port }) }}><Tooltip>{port.name} · port</Tooltip></CircleMarker>)}
      {suppliers.map(supplier => { const country = countriesById.get(supplier.country); return country ? <CircleMarker key={supplier.id} center={[country.lat + 1.4, country.lng + 1.4]} radius={4} pathOptions={{ color: '#071115', fillColor: '#f3b45b', fillOpacity: 1, weight: 2 }} eventHandlers={{ click: () => setSelection({ kind: 'supplier', item: supplier }) }}><Tooltip>{supplier.name} · supplier</Tooltip></CircleMarker> : null; })}
    </MapContainer>
    <div className="pointer-events-none absolute left-4 top-4 z-[1000] rounded border border-[#52636a] bg-[#101820]/90 px-3 py-2 text-[10px] uppercase tracking-[.16em] text-[#e8edf2]"><span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-[#42d3c5]" /> English labels · Free basemap · {scenarioActive ? 'Scenario active' : 'Demo mode'}</div>
    <div className="absolute bottom-4 left-4 z-[1000] rounded border border-[#52636a] bg-[#101820]/95 p-3 text-[10px] uppercase tracking-wider text-[#c4d0d6]"><div className="mb-2 text-[#8995a3]">Risk layer</div><div className="flex flex-wrap gap-3">{[['Low',10],['Moderate',30],['Elevated',50],['High',70],['Critical',90]].map(([label,score]) => <span key={label}><i className="mr-1 inline-block h-2 w-2 rounded-full" style={{ background: riskColor(Number(score)) }} />{label}</span>)}</div></div>
    {selection && <div className="absolute right-4 top-16 z-[1000] w-64 rounded border border-[#42d3c5] bg-[#101820]/95 p-4 shadow-2xl"><button className="float-right text-[#8995a3] hover:text-white" onClick={() => setSelection(null)} aria-label="Close details">×</button><div className="text-[10px] uppercase tracking-widest text-[#42d3c5]">Selected {selection.kind}</div>{selection.kind === 'country' && selectedCountry && <><h3 className="mt-2 text-sm font-bold">{selectedCountry.name}</h3><div className="mt-4 grid grid-cols-2 gap-3 text-xs"><span className="text-[#8995a3]">Overall risk</span><strong style={{ color: riskColor(selectedCountry.score) }}>{selectedCountry.score}</strong><span className="text-[#8995a3]">Political stability</span><strong>{selectedCountry.stability ?? 'n/a'}</strong><span className="text-[#8995a3]">Conflict exposure</span><strong>{selectedCountry.conflict ?? 'n/a'}</strong><span className="text-[#8995a3]">Sanctions</span><strong>{selectedCountry.sanctions ?? 'n/a'}</strong></div></>}{selection.kind === 'route' && <><h3 className="mt-2 text-sm font-bold">{(selection.item as RouteData).name}</h3><div className="mt-4 space-y-2 text-xs text-[#c4d0d6]">{[['Capacity',`${(selection.item as RouteData).capacity}kt`],['Transit',`${(selection.item as RouteData).transit_days} days`],['Cost',`$${(selection.item as RouteData).cost}/unit`],['Risk',`${(selection.item as RouteData).risk}`],['Availability',scenarioActive && ['R-HORMUZ','R-DAMMAM'].includes((selection.item as RouteData).id) ? 'Unavailable' : 'Available']].map(([label,value])=><div className="flex justify-between border-b border-[#26323d] pb-1" key={label}><span className="text-[#8995a3]">{label}</span><strong>{value}</strong></div>)}</div></>}{selection.kind === 'port' && <><h3 className="mt-2 text-sm font-bold">{(selection.item as Port).name}</h3><p className="mt-3 text-xs text-[#8995a3]">Port capacity: {(selection.item as Port).capacity}kt</p></>}{selection.kind === 'supplier' && <><h3 className="mt-2 text-sm font-bold">{(selection.item as Supplier).name}</h3><p className="mt-3 text-xs leading-6 text-[#c4d0d6]">{(selection.item as Supplier).commodity}<br />Capacity: {(selection.item as Supplier).capacity}kt<br />Reliability: {(selection.item as Supplier).reliability}%</p></>}</div>}
  </div>;
}
