const $ = (id) => document.getElementById(id);
const missionFields = ['id','title','subtitle','categoryName','type','deployment','scoring','mechanics','pace'];
let content = { ru: [], en: [], maps: {} };
let lang = 'ru';
let currentId = null;
let map = emptyMap();
let tool = 'select';
let selected = null;
let drag = null;
let polygon = [];

function emptyMap() {
  return { zones: [], objectives: [], obstacles: [], lines: [], labels: [] };
}

function clone(value) { return structuredClone(value); }
function esc(value) { return String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c])); }
function missions() { return content[lang]; }
function currentMission() { return missions().find(m => m.id === currentId) || null; }
function nextId() {
  const nums = missions().map(m => /^m(\d+)$/.exec(m.id)?.[1]).filter(Boolean).map(Number);
  return `m${(nums.length ? Math.max(...nums) : 0) + 1}`;
}
function blankMission() {
  return { id: nextId(), title: 'Новая миссия', subtitle: '', category: 'basic', categoryName: lang === 'ru' ? 'Базовая' : 'Basic', type: lang === 'ru' ? 'Фронтальная' : 'Front', deployment: '<p><strong>Игрок А:</strong> ...</p><p><strong>Игрок Б:</strong> ...</p>', scoring: '<ul><li><strong>1 VP:</strong> ...</li></ul>', mechanics: '<p><strong>Действие:</strong> ...</p>', pace: '' };
}
function templateMap(name) {
  if (name === 'front') return { zones: [{x:0,y:0,w:60,h:220,player:'A'},{x:240,y:0,w:60,h:220,player:'B'}], objectives: [{x:100,y:60,r:7,label:'1'},{x:200,y:60,r:7,label:'2'},{x:100,y:160,r:7,label:'3'},{x:200,y:160,r:7,label:'4'}], obstacles: [], lines: [{x1:150,y1:0,x2:150,y2:220}], labels: [], };
  if (name === 'standard') return { zones: [{x:0,y:0,w:300,h:60,player:'A'},{x:0,y:160,w:300,h:60,player:'B'}], objectives: [{x:100,y:100,r:7,label:'1'},{x:200,y:100,r:7,label:'2'},{x:150,y:70,r:7,label:'3'},{x:150,y:150,r:7,label:'4'}], obstacles: [], lines: [], labels: [], };
  if (name === 'diagonal') return { zones: [{kind:'polygon',player:'A',points:'0,0 100,0 0,100'},{kind:'polygon',player:'B',points:'300,220 200,220 300,120'}], objectives: [{x:70,y:150,r:7,label:'1'},{x:123,y:110,r:7,label:'2'},{x:177,y:110,r:7,label:'3'},{x:230,y:70,r:7,label:'4'}], obstacles: [], lines: [{x1:0,y1:0,x2:300,y2:220}], labels: [], };
  if (name === 'center') return { zones: [{x:0,y:0,w:300,h:50,player:'A'},{x:0,y:170,w:300,h:50,player:'B'}], objectives: [{x:150,y:110,r:9,label:'1'},{x:80,y:110,r:7,label:'2'},{x:220,y:110,r:7,label:'3'}], obstacles: [{x:110,y:75,w:80,h:70,label:'ТЕРРЕЙН'}], lines: [], labels: [], };
  return emptyMap();
}
function fill(m) { missionFields.forEach(f => $(f).value = m[f] ?? ''); $('category').value = m.category || 'basic'; }
function readMission() { const m={}; missionFields.forEach(f=>m[f]=$(`${f}`).value); m.category=$('category').value; return m; }
function missionOptions() { $('missionSelect').innerHTML = missions().map(m => `<option value="${esc(m.id)}">${esc(m.id)} — ${esc(m.title)}</option>`).join(''); $('missionSelect').value = currentId || ''; }
function renderList() { $('missionList').innerHTML = missions().map(m => `<div class="mission-item ${m.id===currentId?'active':''}" data-id="${esc(m.id)}"><strong>${esc(m.id)}</strong> — ${esc(m.title)}</div>`).join(''); }
function selectMission(id) { currentId=id; const m=currentMission(); if(!m) return; fill(m); map=clone(content.maps[id]||emptyMap()); selected=null; polygon=[]; missionOptions(); renderList(); renderMap(); updateTitle(); }
function refresh() { if (!missions().length) { const m=blankMission(); missions().push(m); } currentId=missions()[0].id; selectMission(currentId); }
function setLang(next) { lang=next; $('langRu').classList.toggle('active',next==='ru'); $('langEn').classList.toggle('active',next==='en'); refresh(); }
function updateTitle() { $('editorTitle').textContent = currentMission()?.title || 'Миссия'; $('mapLabel').textContent = currentId ? `Карта: ${currentId}` : 'Карта'; }
function setTool(next) { tool=next; document.querySelectorAll('[data-tool]').forEach(b=>b.classList.toggle('active',b.dataset.tool===next)); }
function pos(evt) { const r=$('canvas').getBoundingClientRect(); return {x:(evt.clientX-r.left)/r.width*300,y:(evt.clientY-r.top)/r.height*220}; }
function setSelected(kind, idx) { selected={kind,idx}; renderMap(); }
function removeSelected() { if(!selected) return; const key={zone:'zones',objective:'objectives',obstacle:'obstacles',line:'lines',label:'labels'}[selected.kind]; if(key) map[key].splice(selected.idx,1); selected=null; renderMap(); }
function renderMap() {
  const s=$('canvas');
  const selectedStroke=(kind,i)=>selected?.kind===kind&&selected?.idx===i?3:1.5;
  s.innerHTML = `<defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#27272a" stroke-width=".5"/></pattern></defs><rect width="300" height="220" fill="#18181b"/><rect width="300" height="220" fill="url(#grid)"/>`
    + map.zones.map((z,i)=>z.kind==='polygon'?`<polygon data-k="zone" data-i="${i}" points="${z.points}" fill="${z.player==='A'?'#2563eb':'#dc2626'}" fill-opacity=".3" stroke="${z.player==='A'?'#3b82f6':'#ef4444'}" stroke-width="${selectedStroke('zone',i)}"/>`:`<rect data-k="zone" data-i="${i}" x="${z.x}" y="${z.y}" width="${z.w}" height="${z.h}" fill="${z.player==='A'?'#2563eb':'#dc2626'}" fill-opacity=".3" stroke="${z.player==='A'?'#3b82f6':'#ef4444'}" stroke-width="${selectedStroke('zone',i)}"/>`).join('')
    + map.obstacles.map((o,i)=>`<rect data-k="obstacle" data-i="${i}" x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}" rx="4" fill="#27272a" stroke="${selected?.kind==='obstacle'&&selected.idx===i?'#fff':'#52525b'}" stroke-width="2"/><text x="${o.x+o.w/2}" y="${o.y+o.h/2+3}" fill="#a1a1aa" font-size="8" text-anchor="middle">${esc(o.label||'ТЕРРЕЙН')}</text>`).join('')
    + map.lines.map((l,i)=>`<line data-k="line" data-i="${i}" x1="${l.x1}" y1="${l.y1}" x2="${l.x2}" y2="${l.y2}" stroke="#f59e0b" stroke-width="${selected?.kind==='line'&&selected.idx===i?3:1}" stroke-dasharray="4" opacity=".55"/>`).join('')
    + map.objectives.map((o,i)=>`<circle data-k="objective" data-i="${i}" cx="${o.x}" cy="${o.y}" r="${o.r||7}" fill="#f59e0b" stroke="#fff" stroke-width="${selectedStroke('objective',i)}"/><text x="${o.x}" y="${o.y+3}" fill="#18181b" font-size="7" font-weight="bold" text-anchor="middle">${esc(o.label||i+1)}</text>`).join('')
    + map.labels.map((l,i)=>`<text data-k="label" data-i="${i}" x="${l.x}" y="${l.y}" fill="#d4d4d8" font-size="${l.size||8}" text-anchor="middle" font-weight="bold">${esc(l.text)}</text>`).join('')
    + (polygon.length?`<polyline points="${polygon.map(p=>`${p.x},${p.y}`).join(' ')}" fill="none" stroke="#f97316" stroke-width="2"/>`: '');
}
function hitTarget(p) { const candidates=[]; map.zones.forEach((o,i)=>o.kind==='polygon'?null:candidates.push(['zone',i,o])); map.objectives.forEach((o,i)=>candidates.push(['objective',i,o])); map.obstacles.forEach((o,i)=>candidates.push(['obstacle',i,o])); map.lines.forEach((o,i)=>candidates.push(['line',i,o])); map.labels.forEach((o,i)=>candidates.push(['label',i,o])); for(let i=candidates.length-1;i>=0;i--){const [kind,idx,o]=candidates[i]; if(kind==='objective'&&Math.hypot(p.x-o.x,p.y-o.y)<10)return{kind,idx}; if((kind==='zone'||kind==='obstacle')&&p.x>=o.x&&p.x<=o.x+o.w&&p.y>=o.y&&p.y<=o.y+o.h)return{kind,idx}; if(kind==='label'&&Math.abs(p.x-o.x)<30&&Math.abs(p.y-o.y)<12)return{kind,idx}; if(kind==='line'){const dx=o.x2-o.x1,dy=o.y2-o.y1,t=Math.max(0,Math.min(1,((p.x-o.x1)*dx+(p.y-o.y1)*dy)/(dx*dx+dy*dy||1))),qx=o.x1+t*dx,qy=o.y1+t*dy;if(Math.hypot(p.x-qx,p.y-qy)<7)return{kind,idx};}} return null; }
function startDraw(p) { if(tool==='select'){setSelected(...Object.values(hitTarget(p) || {kind:null,idx:null})); if(!hitTarget(p)) { selected=null; renderMap(); } return; } if(tool==='objective'){map.objectives.push({x:p.x,y:p.y,r:7,label:String(map.objectives.length+1)});renderMap();return;} if(tool==='label'){const text=prompt('Текст подписи:',''); if(text)map.labels.push({x:p.x,y:p.y,text,size:8});renderMap();return;} if(tool==='polygonA'||tool==='polygonB'){polygon.push(p);renderMap();return;} drag={start:p,current:p}; }
function moveDraw(p){ if(!drag)return;drag.current=p;renderMap(); const d=drag,e=d.current; if(tool==='rectA'||tool==='rectB'){const x=Math.min(d.start.x,e.x),y=Math.min(d.start.y,e.y),w=Math.abs(e.x-d.start.x),h=Math.abs(e.y-d.start.y); $('canvas').insertAdjacentHTML('beforeend',`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${tool==='rectA'?'#2563eb':'#dc2626'}" fill-opacity=".3" stroke="${tool==='rectA'?'#3b82f6':'#ef4444'}" stroke-dasharray="4"/>`);} if(tool==='obstacle') {const x=Math.min(d.start.x,e.x),y=Math.min(d.start.y,e.y),w=Math.abs(e.x-d.start.x),h=Math.abs(e.y-d.start.y); $('canvas').insertAdjacentHTML('beforeend',`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#27272a" fill-opacity=".8" stroke="#52525b" stroke-width="2"/>`);} if(tool==='line') $('canvas').insertAdjacentHTML('beforeend',`<line x1="${d.start.x}" y1="${d.start.y}" x2="${e.x}" y2="${e.y}" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4" opacity=".55"/>`); }
function endDraw(){if(!drag)return;const {start,current}=drag;drag=null;const x=Math.min(start.x,current.x),y=Math.min(start.y,current.y),w=Math.abs(current.x-start.x),h=Math.abs(current.y-start.y); if(w<3&&h<3)return; if(tool==='rectA'||tool==='rectB')map.zones.push({x,y,w,h,player:tool==='rectA'?'A':'B'}); if(tool==='obstacle'){const label=prompt('Название объекта:','ТЕРРЕЙН');map.obstacles.push({x,y,w,h,label:label||'ТЕРРЕЙН'});} if(tool==='line')map.lines.push({x1:start.x,y1:start.y,x2:current.x,y2:current.y}); renderMap(); }
function finishPolygon(){if(polygon.length<3){polygon=[];renderMap();return;} const player=tool==='polygonB'?'B':'A'; map.zones.push({kind:'polygon',player,points:polygon.map(p=>`${Math.round(p.x)},${Math.round(p.y)}`).join(' ')});polygon=[];renderMap();}
async function api(url,body){const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const d=await r.json();if(!r.ok)throw new Error(d.error||'Ошибка');return d;}
async function load(){const r=await fetch('/api/content');content=await r.json();refresh();}
async function saveAll(){const m=readMission();const maps={...content.maps};maps[m.id]=clone(map);const r=await api('/api/save-all',{lang,mission:m,maps});content[lang]=content[lang].some(x=>x.id===m.id)?content[lang].map(x=>x.id===m.id?m:x):[...content[lang],m];content.maps=maps;currentId=m.id;missionOptions();renderList();status(`Сохранено: ${m.id}`);}
async function deleteMission(){const m=currentMission();if(!m)return;if(!confirm(`Удалить миссию «${m.title}» (${m.id})?`))return;await api('/api/delete-mission',{lang,id:m.id});content[lang]=content[lang].filter(x=>x.id!==m.id);delete content.maps[m.id];if(!missions().length)missions().push(blankMission());currentId=missions()[0].id;selectMission(currentId);status(`Удалена: ${m.id}`);}
function duplicateMission(){const m=currentMission();if(!m)return;const copy=clone(m);copy.id=nextId();copy.title=`${m.title} — копия`;copy.subtitle=`${m.subtitle||''}`;missions().push(copy);content.maps[copy.id]=clone(map);selectMission(copy.id);status(`Создана копия: ${copy.id}`);}
function applyTemplate(name){map=templateMap(name);selected=null;polygon=[];renderMap();status(`Шаблон карты: ${name}`);}
function status(text){$('status').textContent=text;}

$('missionSelect').onchange=e=>selectMission(e.target.value);
$('missionList').onclick=e=>{const item=e.target.closest('.mission-item');if(item)selectMission(item.dataset.id);};
$('langRu').onclick=()=>setLang('ru');$('langEn').onclick=()=>setLang('en');
$('newBtn').onclick=()=>{const m=blankMission();missions().push(m);selectMission(m.id);};
$('duplicateBtn').onclick=duplicateMission;$('deleteBtn').onclick=deleteMission;$('saveBtn').onclick=saveAll;$('reload').onclick=load;
$('clearMap').onclick=()=>{if(confirm('Очистить текущую карту?')){map=emptyMap();selected=null;polygon=[];renderMap();}};
$('finishPolygon').onclick=finishPolygon;$('delete').onclick=removeSelected;
document.querySelectorAll('[data-tool]').forEach(b=>b.onclick=()=>setTool(b.dataset.tool));
document.querySelectorAll('[data-template]').forEach(b=>b.onclick=()=>applyTemplate(b.dataset.template));
$('canvas').addEventListener('pointerdown',e=>{e.preventDefault();startDraw(pos(e));});$('canvas').addEventListener('pointermove',e=>moveDraw(pos(e)));window.addEventListener('pointerup',endDraw);
load();
