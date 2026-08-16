import fs from 'node:fs';
import vm from 'node:vm';

const pages = ['index.html', 'en.html'];

function extractScript(html) {
    const match = html.match(/<script>\s*\/\/ --- MISSIONS DATABASE[\s\S]*?<\/script>/);
    if (!match) throw new Error('Mission application script was not found');
    return match[0].replace(/^<script>/, '').replace(/<\/script>$/, '');
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
    fn = fn.replace("const container = document.getElementById('svg-map-container');", '');
    fn = fn.replace(
        'container.innerHTML = `<svg viewBox="0 0 300 220" class="w-full h-full">${grid}${innerSvg}</svg>`;',
        'return `<svg viewBox="0 0 300 220" class="w-full h-full">${grid}${innerSvg}</svg>`;'
    );
    if (!fn.includes('return `<svg')) throw new Error('Map renderer transformation failed');
    return fn;
}

const html = Object.fromEntries(pages.map((file) => [file, fs.readFileSync(file, 'utf8')]));
const scripts = Object.fromEntries(pages.map((file) => [file, extractScript(html[file])]));
const ruMissions = evaluateMissions(scripts['index.html']);
const enMissions = evaluateMissions(scripts['en.html']);

if (ruMissions.length !== 12 || enMissions.length !== 12) {
    throw new Error(`Expected 12 missions per language, got RU=${ruMissions.length}, EN=${enMissions.length}`);
}

if (ruMissions.map((m) => m.id).join('|') !== enMissions.map((m) => m.id).join('|')) {
    throw new Error('RU and EN mission IDs do not match');
}

const mapRenderer = extractMapRenderer(scripts['index.html']);
fs.mkdirSync('js', { recursive: true });
fs.writeFileSync('js/missions-ru.js', `export const missions = ${JSON.stringify(ruMissions, null, 4)};\n`);
fs.writeFileSync('js/missions-en.js', `export const missions = ${JSON.stringify(enMissions, null, 4)};\n`);
fs.writeFileSync('js/maps.js', `${mapRenderer}\n\nexport { renderSvgMap };\n`);
fs.copyFileSync('scripts/app-template.js', 'js/app.js');

const tag = '\n    <script type="module" src="js/app.js"></script>\n';
for (const file of pages) {
    const inline = extractScript(html[file]);
    const withoutInline = html[file].replace(inline, '').replace(/\n{3,}/g, '\n\n');
    fs.writeFileSync(file, withoutInline.replace('</body>', `${tag}</body>`));
}

console.log(`Migrated ${ruMissions.length} RU and ${enMissions.length} EN missions.`);
