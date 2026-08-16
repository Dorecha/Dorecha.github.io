import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const studio = path.join(root, 'tools', 'mission-studio.html');
const port = Number(process.env.PORT || 4173);

const missionFiles = {
  ru: path.join(root, 'js', 'missions-ru.js'),
  en: path.join(root, 'js', 'missions-en.js')
};
const mapsFile = path.join(root, 'js', 'maps-custom.js');

async function loadModule(file) {
  const url = pathToFileURL(file).href + `?v=${Date.now()}`;
  return import(url);
}

async function loadMissions(lang) {
  const mod = await loadModule(missionFiles[lang]);
  return mod.missions;
}

async function saveMissions(lang, missions) {
  const content = `export const missions = ${JSON.stringify(missions, null, 4)};\n`;
  await fs.writeFile(missionFiles[lang], content, 'utf8');
}

async function loadCustomMaps() {
  const mod = await loadModule(mapsFile);
  return mod.customMaps;
}

async function saveCustomMaps(maps) {
  const content = `export const customMaps = ${JSON.stringify(maps, null, 4)};\n`;
  await fs.writeFile(mapsFile, content, 'utf8');
}

function json(res, status, value) {
  const body = JSON.stringify(value);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(body);
}

async function readBody(req) {
  let data = '';
  for await (const chunk of req) data += chunk;
  return JSON.parse(data || '{}');
}

async function handler(req, res) {
  try {
    if (req.method === 'GET' && req.url === '/') {
      const html = await fs.readFile(studio, 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(html);
    }

    if (req.method === 'GET' && req.url === '/api/content') {
      const [ru, en, maps] = await Promise.all([loadMissions('ru'), loadMissions('en'), loadCustomMaps()]);
      return json(res, 200, { ru, en, maps });
    }

    if (req.method === 'POST' && req.url === '/api/mission') {
      const body = await readBody(req);
      const lang = body.lang === 'en' ? 'en' : 'ru';
      const mission = body.mission;
      if (!mission?.id || !mission?.title) return json(res, 400, { error: 'id and title are required' });
      if (!/^[a-z0-9_-]+$/i.test(mission.id)) return json(res, 400, { error: 'id may contain only letters, digits, _ and -' });

      const missions = await loadMissions(lang);
      const index = missions.findIndex((item) => item.id === mission.id);
      if (index >= 0) missions[index] = mission;
      else missions.push(mission);
      await saveMissions(lang, missions);
      return json(res, 200, { ok: true, mission, count: missions.length });
    }

    if (req.method === 'POST' && req.url === '/api/map') {
      const body = await readBody(req);
      const id = body.id;
      const map = body.map;
      if (!id || !map) return json(res, 400, { error: 'id and map are required' });
      const maps = await loadCustomMaps();
      maps[id] = map;
      await saveCustomMaps(maps);
      return json(res, 200, { ok: true, id });
    }

    json(res, 404, { error: 'Not found' });
  } catch (error) {
    console.error(error);
    json(res, 500, { error: error.message });
  }
}

http.createServer(handler).listen(port, () => {
  console.log(`Mission Studio: http://localhost:${port}`);
  console.log('Edit files in this repository directly; no external service is used.');
});
