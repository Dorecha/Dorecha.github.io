import { filterMissions, randomMission, validateMissions } from './mission-core.js';
import { missions as ruMissions } from './missions-ru.js';
import { missions as enMissions } from './missions-en.js';
import { renderSvgMap } from './maps.js';

const language = document.documentElement.lang === 'en' ? 'en' : 'ru';
const missions = language === 'en' ? enMissions : ruMissions;
const translations = language === 'en'
    ? {
        count: (n) => `Available missions: ${n}`,
        spinHint: 'Click "SPIN THE ROULETTE"'
      }
    : {
        count: (n) => `Доступно миссий: ${n}`,
        spinHint: 'Нажми "КРУТИТЬ РУЛЕТКУ"'
      };

const validationErrors = validateMissions(missions);
if (validationErrors.length) throw new Error(validationErrors.join('\n'));

let currentFilter = 'all';
let isSpinning = false;
const usedIds = new Set();

function getFiltered() {
    return filterMissions(missions, currentFilter);
}

function updateCount() {
    const badge = document.getElementById('mission-count-badge');
    if (badge) badge.innerText = translations.count(getFiltered().length);
}

function renderMissionDetails(mission) {
    document.getElementById('mission-title').innerText = mission.title;
    document.getElementById('mission-subtitle').innerText = mission.subtitle;
    document.getElementById('mission-category').innerText = mission.categoryName;
    document.getElementById('mission-type').innerText = mission.type + (language === 'en' ? ' DEPLOYMENT' : ' РАССТАНОВКА');
    document.getElementById('deployment-text').innerHTML = mission.deployment;
    document.getElementById('scoring-text').innerHTML = mission.scoring;
    document.getElementById('mechanics-text').innerHTML = mission.mechanics;
    document.getElementById('pace-text').innerText = mission.pace;
    document.getElementById('svg-map-container').innerHTML = renderSvgMap(mission.id);
    document.getElementById('mission-card').classList.remove('hidden');
}

function showRouletteMission(mission) {
    document.getElementById('roulette-display').innerHTML = `
        <div>
            <span class="text-xs bg-orange-600 text-white font-bold px-2 py-0.5 rounded uppercase tracking-widest">${mission.categoryName}</span>
            <h3 class="text-2xl font-black font-orbitron text-orange-400 mt-1">${mission.title}</h3>
            <p class="text-xs text-zinc-400 mt-1">${mission.subtitle}</p>
        </div>
    `;
    renderMissionDetails(mission);
}

function chooseMission(list) {
    const available = list.filter((mission) => !usedIds.has(mission.id));
    if (!available.length) usedIds.clear();
    const chosen = randomMission(list, usedIds);
    if (chosen) usedIds.add(chosen.id);
    return chosen;
}

window.setFilter = (filter) => {
    if (isSpinning) return;
    currentFilter = filter;
    document.querySelectorAll('.filter-btn').forEach((button) => {
        button.classList.remove('bg-orange-600', 'text-white');
        button.classList.add('text-zinc-400');
    });
    const activeButton = document.getElementById(`filter-${filter}`);
    if (activeButton) {
        activeButton.classList.add('bg-orange-600', 'text-white');
        activeButton.classList.remove('text-zinc-400');
    }
    updateCount();
    renderMissionsGrid();
};

function renderMissionsGrid() {
    const grid = document.getElementById('missions-grid');
    if (!grid) return;
    grid.innerHTML = getFiltered().map((mission) => `
        <div onclick="selectMissionById('${mission.id}')" class="bg-zinc-900 border border-zinc-800 hover:border-orange-500 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:-translate-y-1 group flex flex-col h-full">
            <div class="flex justify-between items-center mb-2">
                <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded ${mission.category === 'advanced' ? 'bg-orange-950 text-orange-400 border border-orange-800' : 'bg-zinc-800 text-zinc-300'}">${mission.categoryName}</span>
                <span class="text-[10px] text-zinc-500 font-mono">${mission.type}</span>
            </div>
            <h4 class="text-base font-bold font-orbitron text-white group-hover:text-orange-400 transition">${mission.title}</h4>
            <p class="text-xs text-zinc-400 mt-1 flex-grow">${mission.subtitle}</p>
        </div>
    `).join('');
}

window.spinRoulette = () => {
    if (isSpinning) return;
    const list = getFiltered();
    if (!list.length) return;

    isSpinning = true;
    const button = document.getElementById('spin-btn');
    const display = document.getElementById('roulette-display');
    const card = document.getElementById('mission-card');
    button.disabled = true;
    button.classList.add('opacity-50', 'cursor-not-allowed');
    card.classList.add('hidden');
    display.classList.add('roulette-spin');

    let counter = 0;
    const interval = setInterval(() => {
        const preview = list[Math.floor(Math.random() * list.length)];
        display.innerHTML = `<div><span class="text-xs text-orange-500 font-bold uppercase tracking-widest">${preview.type}</span><h3 class="text-xl font-black font-orbitron text-white">${preview.title}</h3></div>`;
        counter += 1;

        if (counter >= 25) {
            clearInterval(interval);
            display.classList.remove('roulette-spin');
            const finalMission = chooseMission(list);
            showRouletteMission(finalMission);
            isSpinning = false;
            button.disabled = false;
            button.classList.remove('opacity-50', 'cursor-not-allowed');
            setTimeout(() => card.scrollIntoView({ behavior: 'smooth' }), 300);
        }
    }, 80);
};

window.getRandomMissionDirectly = () => {
    if (isSpinning) return;
    const mission = chooseMission(getFiltered());
    if (!mission) return;
    showRouletteMission(mission);
    document.getElementById('mission-card').scrollIntoView({ behavior: 'smooth' });
};

window.selectMissionById = (id) => {
    const mission = missions.find((item) => item.id === id);
    if (!mission) return;
    usedIds.add(mission.id);
    showRouletteMission(mission);
    document.getElementById('mission-card').scrollIntoView({ behavior: 'smooth' });
};

window.scrollUpToSpin = () => window.scrollTo({ top: 0, behavior: 'smooth' });

window.addEventListener('DOMContentLoaded', () => {
    const hint = document.querySelector('#roulette-display p');
    if (hint) hint.innerText = translations.spinHint;
    updateCount();
    renderMissionsGrid();
});
