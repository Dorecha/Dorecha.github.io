import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const studio = path.join(root, 'tools', 'mission-studio.html');
const studioScript = path.join(root, 'tools', 'mission-studio-v2.js');
const port = Number(process.env.PORT || 4173);
const missionFiles = { ru: path.join(root, 'js', 'missions-ru.js'), en: path.join(root, 'js', 'missions-en.js') };
const mapsFile = path.join(root, 'js', 'maps-custom.js');

async function loadModule(file) {
  return import(pathToFileURL(file).href + `?v=${Date.now()}`);
}
async function loadMissions(lang) { return (await loadModule(missionFiles[lang])).missions; }
async function saveMissions(lang, missions) { await fs.writeFile(missionFiles[lang], `export const missions = ${JSON.stringify(missions, null, 4)};\n`, 'utf8'); }
async function loadCustomMaps() { return (await loadModule(mapsFile)).customMaps; }
async function saveCustomMaps(maps) { await fs.writeFile(mapsFile, `export const customMaps = ${JSON.stringify(maps, null, 4)};\n`, 'utf8'); }
function json(res, status, value) { const body = JSON.stringify(value); res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' }); res.end(body); }
async function readBody(req) { let data = ''; for await (const chunk of req) data += chunk; return JSON.parse(data || '{}'); }

async function handler(req, res) {
  try {
    if (req.method === 'GET' && req.url === '/') {
      const html = await fs.readFile(studio, 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(html);
    }

    if (req.method === 'GET' && req.url === '/tools/mission-studio-v2.js') {
      const script = await fs.readFile(studioScript, 'utf8');
      res.writeHead(200, {
        'Content-Type': 'text/javascript; charset=utf-8',
        'Cache-Control': 'no-store'
      });
      return res.end(script);
    }

    if (req.method === 'GET' && req.url === '/api/content') {
      const [ru, en, maps] = await Promise.all([loadMissions('ru'), loadMissions('en'), loadCustomMaps()]);
      return json(res, 200, { ru, en, maps });
    }

    if (req.method === 'POST' && req.url === '/api/save-all') {
      const body = await readBody(req);
      const lang = body.lang === 'en' ? 'en' : 'ru';
      const mission = body.mission;
      const maps = body.maps;
      if (!mission?.id || !mission?.title) return json(res, 400, { error: 'ID и название обязательны' });
      if (!/^[a-z0-9_-]+$/i.test(mission.id)) return json(res, 400, { error: 'ID может содержать только латинские буквы, цифры, _ и -' });
      const missions = await loadMissions(lang);
      const index = missions.findIndex((m) => m.id === mission.id);
      if (index >= 0) missions[index] = mission;
      else missions.push(mission);
      await Promise.all([saveMissions(lang, missions), saveCustomMaps(maps || {})]);
      return json(res, 200, { ok: true, id: mission.id, count: missions.length });
    }

    if (req.method === 'POST' && req.url === '/api/delete-mission') {
      const body = await readBody(req);
      const lang = body.lang === 'en' ? 'en' : 'ru';
      const id = body.id;
      if (!id) return json(res, 400, { error: 'ID обязателен' });
      const missions = await loadMissions(lang);
      const next = missions.filter((m) => m.id !== id);
      if (next.length === missions.length) return json(res, 404, { error: 'Миссия не найдена' });
      const maps = await loadCustomMaps();
      delete maps[id];
      await Promise.all([saveMissions(lang, next), saveCustomMaps(maps)]);
      return json(res, 200, { ok: true, id, count: next.length });
    }

    json(res, 404, { error: 'Not found' });
  } catch (error) {
    console.error(error);
    json(res, 500, { error: error.message });
  }
}

http.createServer(handler).listen(port, () => {
  console.log(`Mission Studio: http://localhost:${port}`);
});
