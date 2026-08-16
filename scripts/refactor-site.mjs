import fs from 'node:fs';
import vm from 'node:vm';

const ROOT = process.cwd();
const pages = [
  { file: 'index.html', lang: 'ru' },
  { file: 'en.html', lang: 'en' }
];

function extractScript(html) {
  const match = html.match(/<script>\s*\/\/ --- MISSIONS DATABASE[\s\S]*?<\/script>/);
  if (!match) throw new Error('Mission application script was not found');
  return match[0].replace(/^<script>/, '').replace(/<\/script>$/, '');
}

function extractSection(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  if (start < 0) throw new Error(`Missing marker: ${startMarker}`);
  const end = source.indexOf(endMarker, start);
  if (end < 0) throw new Error(`Missing marker: ${endMarker}`);
  return source.slice(start, end).trim();
}

function evaluateMissions(source) {
  const start = source.indexOf('const missions = [');
  const end = source.indexOf('];', start);
  if (start < 0 || end < 0) throw new Error('Could not locate missions array');
  const expression = source.slice(start, end + 2).replace(/^const missions\s*=/, 'globalThis.missions =');
  const context = vm.createContext({});
  vm.runInContext(expression, context);
  return context.missions;
}

function extractMapRenderer(source) {
  const start = source.indexOf('function renderSvgMap(missionId) {');
  const end = source.indexOf('// --- RENDER ALL MISSIONS LIST ---', start);
  if (start < 0 || end < 0) throw new Error('Could not locate SVG map renderer');

  let fn = source.slice(start, end).trim();
  fn = fn.replace(
    "const container = document.getElementById('svg-map-container');",
    ''
  );
  fn = fn.replace(
    'container.innerHTML = `<svg viewBox="0 0 300 220" class="w-full h-full">${grid}${innerSvg}</svg>`;',
    'return `<svg viewBox="0 0 300 220" class="w-full h-full">${grid}${innerSvg}</svg>`;'
  );

  if (!fn.includes('return `<svg')) {
    throw new Error('Map renderer transformation failed');
  }

  return fn;
}

function js(value) {
  return JSON.stringify(value, null, 4)
    .replace(/"([a-zA-Z_$][\w$]*)":/g, '$1:');
}

const contents = Object.fromEntries(
  pages.map(({ file }) => [file, fs.readFileSync(file, 'utf8')])
);

const scripts = Object.fromEntries(
  pages.map(({ file }) => [file, extractScript(contents[file])])
);

const missionsByLang = {
  ru: evaluateMissions(scripts['index.html']),
  en: evaluateMissions(scripts['en.html'])
};

if (missionsByLang.ru.length !== 12 || missionsByLang.en.length !== 12) {
  throw new Error(`Expected 12 missions per language, got RU=${missionsByLang.ru.length}, EN=${missionsByLang.en.length}`);
}

const idsRu = missionsByLang.ru.map((m) => m.id).join(',');
const idsEn = missionsByLang.en.map((m) => m.id).join(',');
if (idsRu !== idsEn) throw new Error('RU and EN mission IDs do not match');

const mapRenderer = extractMapRenderer(scripts['index.html']);

fs.mkdirSync('js', { recursive: true });
fs.writeFileSync('js/missions-ru.js', `export const missions = ${js(missionsByLang.ru)};\n`);
fs.writeFileSync('js/missions-en.js', `export const missions = ${js(missionsByLang.en)};\n`);
fs.writeFileSync('js/maps.js', `${mapRenderer}\n\nexport { renderSvgMap };\n`);

const app = `import { filterMissions, randomMission, validateMissions } from './mission-core.js';\nimport { missions as ruMissions } from './missions-ru.js';\nimport { missions as enMissions } from './missions-en.js';\nimport { renderSvgMap } from './maps.js';\n\nconst language = document.documentElement.lang === 'en' ? 'en' : 'ru';\nconst missions = language === 'en' ? enMissions : ruMissions;\nconst translations = language === 'en'\n    ? {\n        all: 'All', basic: 'Basic', advanced: 'Advanced',\n        count: (n) => \\`Available missions: \\${n}\\`,\n        respin: 'Respin', quick: 'Quick Pick',\n        spinHint: 'Click "SPIN THE ROULETTE"'\n      }\n    : {\n        all: 'Все', basic: 'Базовые', advanced: 'Продвинутые',\n        count: (n) => \\`Доступно миссий: \\${n}\\`,\n        respin: 'Перекрутить', quick: 'Быстрый выбор',\n        spinHint: 'Нажми "КРУТИТЬ РУЛЕТКУ"'\n      };\n\nconst validationErrors = validateMissions(missions);\nif (validationErrors.length) throw new Error(validationErrors.join('\\n'));\n\nlet currentFilter = 'all';\nlet isSpinning = false;\nconst usedIds = new Set();\n\nfunction getFiltered() { return filterMissions(missions, currentFilter); }\nfunction updateCount() {\n  const badge = document.getElementById('mission-count-badge');\n  if (badge) badge.innerText = translations.count(getFiltered().length);\n}\n\nfunction renderMissionDetails(m) {\n  document.getElementById('mission-title').innerText = m.title;\n  document.getElementById('mission-subtitle').innerText = m.subtitle;\n  document.getElementById('mission-category').innerText = m.categoryName;\n  document.getElementById('mission-type').innerText = m.type + (language === 'en' ? ' DEPLOYMENT' : ' РАССТАНОВКА');\n  document.getElementById('deployment-text').innerHTML = m.deployment;\n  document.getElementById('scoring-text').innerHTML = m.scoring;\n  document.getElementById('mechanics-text').innerHTML = m.mechanics;\n  document.getElementById('pace-text').innerText = m.pace;\n  document.getElementById('svg-map-container').innerHTML = renderSvgMap(m.id);\n  document.getElementById('mission-card').classList.remove('hidden');\n}\n\nfunction showRouletteMission(m) {\n  document.getElementById('roulette-display').innerHTML = \\`\n    <div>\n      <span class="text-xs bg-orange-600 text-white font-bold px-2 py-0.5 rounded uppercase tracking-widest">\\${m.categoryName}</span>\n      <h3 class="text-2xl font-black font-orbitron text-orange-400 mt-1">\\${m.title}</h3>\n      <p class="text-xs text-zinc-400 mt-1">\\${m.subtitle}</p>\n    </div>\n  \\`;\n  renderMissionDetails(m);\n}\n\nfunction chooseMission(list) {\n  const available = list.filter((m) => !usedIds.has(m.id));\n  if (!available.length) usedIds.clear();\n  const chosen = randomMission(list, usedIds);\n  if (chosen) usedIds.add(chosen.id);\n  return chosen;\n}\n\nwindow.setFilter = (filter) => {\n  if (isSpinning) return;\n  currentFilter = filter;\n  document.querySelectorAll('.filter-btn').forEach((btn) => {\n    btn.classList.remove('bg-orange-600', 'text-white');\n    btn.classList.add('text-zinc-400');\n  });\n  const active = document.getElementById(\`filter-\\${filter}\`);\n  if (active) { active.classList.add('bg-orange-600', 'text-white'); active.classList.remove('text-zinc-400'); }\n  updateCount();\n  renderMissionsGrid();\n};\n\nfunction renderMissionsGrid() {\n  const grid = document.getElementById('missions-grid');\n  if (!grid) return;\n  grid.innerHTML = getFiltered().map((m) => \\`\n    <div onclick="selectMissionById('\\${m.id}')" class="bg-zinc-900 border border-zinc-800 hover:border-orange-500 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:-translate-y-1 group flex flex-col h-full">\n      <div class="flex justify-between items-center mb-2">\n        <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded \\${m.category === 'advanced' ? 'bg-orange-950 text-orange-400 border border-orange-800' : 'bg-zinc-800 text-zinc-300'}">\\${m.categoryName}</span>\n        <span class="text-[10px] text-zinc-500 font-mono">\\${m.type}</span>\n      </div>\n      <h4 class="text-base font-bold font-orbitron text-white group-hover:text-orange-400 transition">\\${m.title}</h4>\n      <p class="text-xs text-zinc-400 mt-1 flex-grow">\\${m.subtitle}</p>\n    </div>\n  \\`).join('');\n}\n\nwindow.spinRoulette = () => {\n  if (isSpinning) return;\n  const list = getFiltered();\n  if (!list.length) return;\n  isSpinning = true;\n  const btn = document.getElementById('spin-btn');\n  const display = document.getElementById('roulette-display');\n  const card = document.getElementById('mission-card');\n  btn.disabled = true;\n  btn.classList.add('opacity-50', 'cursor-not-allowed');\n  card.classList.add('hidden');\n  display.classList.add('roulette-spin');\n  let counter = 0;\n  const interval = setInterval(() => {\n    const preview = list[Math.floor(Math.random() * list.length)];\n    display.innerHTML = \\`<div><span class="text-xs text-orange-500 font-bold uppercase tracking-widest">\\${preview.type}</span><h3 class="text-xl font-black font-orbitron text-white">\\${preview.title}</h3></div>\\`;\n    if (++counter >= 25) {\n      clearInterval(interval);\n      display.classList.remove('roulette-spin');\n      const finalMission = chooseMission(list);\n      showRouletteMission(finalMission);\n      isSpinning = false;\n      btn.disabled = false;\n      btn.classList.remove('opacity-50', 'cursor-not-allowed');\n      setTimeout(() => card.scrollIntoView({ behavior: 'smooth' }), 300);\n    }\n  }, 80);\n};\n\nwindow.getRandomMissionDirectly = () => {\n  if (isSpinning) return;\n  const m = chooseMission(getFiltered());\n  if (!m) return;\n  showRouletteMission(m);\n  document.getElementById('mission-card').scrollIntoView({ behavior: 'smooth' });\n};\n\nwindow.selectMissionById = (id) => {\n  const m = missions.find((item) => item.id === id);\n  if (!m) return;\n  usedIds.add(m.id);\n  showRouletteMission(m);\n  document.getElementById('mission-card').scrollIntoView({ behavior: 'smooth' });\n};\n\nwindow.scrollUpToSpin = () => window.scrollTo({ top: 0, behavior: 'smooth' });\n\nwindow.addEventListener('DOMContentLoaded', () => {\n  const hint = document.querySelector('#roulette-display p');\n  if (hint) hint.innerText = translations.spinHint;\n  updateCount();\n  renderMissionsGrid();\n});\n`;

fs.writeFileSync('js/app.js', app);

const scriptTag = `\n    <script type="module" src="js/app.js"></script>\n`;
for (const { file } of pages) {
  const html = contents[file];
  const block = extractScript(html);
  const withoutInline = html.replace(block, '').replace(/\n{3,}/g, '\n\n');
  fs.writeFileSync(file, withoutInline.replace('</body>', `${scriptTag}</body>`));
}

console.log('Migration complete:', { ru: missionsByLang.ru.length, en: missionsByLang.en.length });
