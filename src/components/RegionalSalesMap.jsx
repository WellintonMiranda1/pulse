import { useEffect, useMemo, useState } from 'react';
import { MapPinned } from 'lucide-react';
import { formatBRL } from '../lib/currency';

const UF_NAMES = {AC:'Acre',AL:'Alagoas',AP:'Amapá',AM:'Amazonas',BA:'Bahia',CE:'Ceará',DF:'Distrito Federal',ES:'Espírito Santo',GO:'Goiás',MA:'Maranhão',MT:'Mato Grosso',MS:'Mato Grosso do Sul',MG:'Minas Gerais',PA:'Pará',PB:'Paraíba',PR:'Paraná',PE:'Pernambuco',PI:'Piauí',RJ:'Rio de Janeiro',RN:'Rio Grande do Norte',RS:'Rio Grande do Sul',RO:'Rondônia',RR:'Roraima',SC:'Santa Catarina',SP:'São Paulo',SE:'Sergipe',TO:'Tocantins'};
const UFS = Object.keys(UF_NAMES);
const GEO_URL = 'https://cdn.jsdelivr.net/gh/codeforamerica/click_that_hood@master/public/data/brazil-states.geojson';
const ufFromFeature = f => {
  const p = f.properties || {};
  const raw = String(p.sigla || p.uf || p.code || p.abbrev || p.name || p.nome || '').trim();
  const normalized = raw.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  return UFS.find(uf => uf.toLowerCase() === normalized || UF_NAMES[uf].normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase() === normalized) || null;
};
// Projeção equiretangular local: o mapa é vetorial, preserva as fronteiras reais do GeoJSON.
const xy = ([lon,lat]) => [(lon+75)*10, (7-lat)*10];
function ringPath(ring) { return ring.map((point,i) => `${i?'L':'M'}${xy(point).map(v=>v.toFixed(2)).join(' ')}`).join(' ')+'Z'; }
function geometryPath(geometry) {
  if (!geometry) return '';
  if (geometry.type === 'Polygon') return geometry.coordinates.map(ringPath).join(' ');
  if (geometry.type === 'MultiPolygon') return geometry.coordinates.flatMap(poly=>poly.map(ringPath)).join(' ');
  return '';
}
export default function RegionalSalesMap({ clients = [], purchases = [], months = [] }) {
  const [selected,setSelected] = useState(null);
  const [hovered,setHovered] = useState(null);
  const [period,setPeriod] = useState('range');
  const [features,setFeatures] = useState(null);
  const [mapError,setMapError] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    fetch(GEO_URL,{signal:controller.signal}).then(r=>{if(!r.ok) throw new Error('Mapa indisponível');return r.json();}).then(data=>setFeatures((data.features||[]).map(f=>({...f,uf:ufFromFeature(f),path:geometryPath(f.geometry)})).filter(f=>f.uf&&f.path))).catch(err=>{if(err.name!=='AbortError')setMapError(true);});
    return ()=>controller.abort();
  },[]);
  const {rows,missing} = useMemo(()=>{
    const map = new Map(UFS.map(uf=>[uf,{uf,revenue:0,count:0,customers:new Set()}]));
    const byId = new Map(clients.map(c=>[c.id,c]));
    let missing=0;
    for(const p of purchases){
      if(period==='range'&&!months.includes(String(p.date||'').slice(0,7)))continue;
      const c=byId.get(p.client_id);if(!c)continue;
      const uf=String(c.estado||'').trim().toUpperCase();
      if(!map.has(uf)){missing++;continue;}
      const r=map.get(uf);r.revenue+=Number(p.amount||0);r.count++;r.customers.add(c.id);
    }
    return {rows:[...map.values()].map(({customers,...r})=>({...r,customers:customers.size})).sort((a,b)=>b.revenue-a.revenue),missing};
  },[clients,purchases,months,period]);
  const max=Math.max(...rows.map(r=>r.revenue),0);
  const active=rows.find(r=>r.uf===selected)||rows.find(r=>r.revenue>0)||rows[0];
  const totalRevenue=rows.reduce((s,r)=>s+r.revenue,0);
  const totalSales=rows.reduce((s,r)=>s+r.count,0);
  const byUF=new Map(rows.map(r=>[r.uf,r]));
  const color=(v)=>!v?'#122238':`rgba(20, 153, 255, ${(.33+.67*(max?v/max:0)).toFixed(3)})`;
  return <section className="pulse-regional-card pulse-analytics-card rounded-2xl p-5">
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2"><MapPinned size={20} color="#38bdf8"/><div><h3 className="font-semibold">Vendas por Estado</h3><p className="mt-1 text-xs text-slate-400">Mapa geográfico do Brasil · faturamento por UF</p></div></div>
      <select value={period} onChange={e=>setPeriod(e.target.value)} className="rounded-xl border border-sky-500/25 bg-[#091525] px-3 py-2 text-sm text-slate-100"><option value="range">Período da análise</option><option value="all">Todo o histórico</option></select>
    </div>
    <div className="pulse-regional-layout">
      <div className="pulse-brazil-map-container">
        {features?.length ? <svg viewBox="0 0 590 580" className="pulse-brazil-svg" role="group" aria-label="Mapa geográfico interativo dos estados brasileiros">
          <defs><filter id="pulse-map-glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
          {features.map(f=>{const r=byUF.get(f.uf);const chosen=active?.uf===f.uf;const over=hovered===f.uf;return <path key={f.uf} d={f.path} fill={color(r?.revenue||0)} stroke={chosen||over?'#7ed5ff':'#39739d'} strokeWidth={chosen||over?1.6:.7} className="pulse-brazil-state" style={{filter:chosen||over?'url(#pulse-map-glow)':undefined}} onMouseEnter={()=>setHovered(f.uf)} onMouseLeave={()=>setHovered(null)} onClick={()=>setSelected(f.uf)} tabIndex={0} role="button" aria-label={`${UF_NAMES[f.uf]}: ${formatBRL(r?.revenue||0)} em ${r?.count||0} compras`} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setSelected(f.uf);}}}><title>{UF_NAMES[f.uf]} · {formatBRL(r?.revenue||0)} · {r?.count||0} compra(s)</title></path>})}
        </svg> : <div className="pulse-map-loading">{mapError?'Não foi possível carregar os contornos do mapa. Verifique a conexão com a internet.':'Carregando mapa geográfico do Brasil…'}</div>}
        <div className="pulse-map-legend"><span>Sem vendas</span><div className="pulse-map-gradient"/><span>Mais vendas</span></div>
        {hovered&&<div className="pulse-map-hover-info">{UF_NAMES[hovered]} · {formatBRL(byUF.get(hovered)?.revenue||0)}</div>}
      </div>
      <div className="pulse-regional-insights">
        <div className="pulse-regional-detail"><span>FATURAMENTO TOTAL</span><strong>{formatBRL(totalRevenue)}</strong><small>{totalSales} compra(s) com estado informado</small></div>
        <div className="pulse-regional-detail"><span>ESTADO SELECIONADO · {active?.uf||'—'}</span><strong>{formatBRL(active?.revenue||0)}</strong><small>{active?.count||0} compra(s) · {active?.customers||0} cliente(s)</small></div>
        <div className="pulse-regional-ranking"><span>ESTADOS COM MAIS VENDAS</span>{rows.filter(r=>r.revenue>0).slice(0,5).map((r,i)=><button key={r.uf} type="button" onClick={()=>setSelected(r.uf)} className="pulse-regional-rank"><b>{i+1}. {r.uf}</b><span>{formatBRL(r.revenue)}</span></button>)}{!totalSales&&<p className="text-sm text-slate-400">Nenhuma venda com estado cadastrado neste período.</p>}</div>
        {missing>0&&<p className="text-xs text-amber-300">{missing} compra(s) sem UF válida não entram no mapa. Atualize o cadastro do cliente.</p>}
      </div>
    </div>
    <p className="mt-4 text-xs text-slate-500">Fronteiras geográficas via GeoJSON público (Click That Hood). O mapa requer internet. Valores somados pelas compras registradas e pelo estado atual do cliente; a atribuição histórica ao vendedor não muda.</p>
  </section>;
}
