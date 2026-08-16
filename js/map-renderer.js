import { renderSvgMap as renderLegacyMap } from './maps.js';
import { customMaps } from './maps-custom.js';

function esc(value = '') {
    return String(value).replace(/[&<>"']/g, (ch) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));
}

function renderCustomMap(map) {
    const zones = (map.zones || []).map((z) => {
        if (z.kind === 'polygon') {
            const fill = z.player === 'A' ? '#2563eb' : '#dc2626';
            const stroke = z.player === 'A' ? '#3b82f6' : '#ef4444';
            return `<polygon points="${esc(z.points)}" fill="${fill}" fill-opacity=".3" stroke="${stroke}" stroke-width="1.5"/>`;
        }
        const fill = z.player === 'A' ? '#2563eb' : '#dc2626';
        const stroke = z.player === 'A' ? '#3b82f6' : '#ef4444';
        const label = esc(z.label || `Игрок ${z.player}`);
        return `<rect x="${z.x}" y="${z.y}" width="${z.w}" height="${z.h}" fill="${fill}" fill-opacity=".3" stroke="${stroke}" stroke-width="1.5"/><text x="${z.x + z.w / 2}" y="${z.y + z.h / 2}" fill="#e4e4e7" font-size="9" font-weight="bold" text-anchor="middle">${label}</text>`;
    }).join('');

    const objectives = (map.objectives || []).map((o, i) => `<circle cx="${o.x}" cy="${o.y}" r="${o.r || 7}" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/><text x="${o.x}" y="${o.y + 3}" fill="#18181b" font-size="7" font-weight="bold" text-anchor="middle">${esc(o.label || i + 1)}</text>`).join('');
    const obstacles = (map.obstacles || []).map((o) => `<rect x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}" rx="4" fill="#27272a" stroke="#52525b" stroke-width="2"/><text x="${o.x + o.w / 2}" y="${o.y + o.h / 2 + 3}" fill="#a1a1aa" font-size="8" text-anchor="middle">${esc(o.label || 'ОБЪЕКТ')}</text>`).join('');
    const lines = (map.lines || []).map((l) => `<line x1="${l.x1}" y1="${l.y1}" x2="${l.x2}" y2="${l.y2}" stroke="#f59e0b" stroke-width="1" stroke-dasharray="4" opacity=".45"/>`).join('');
    const labels = (map.labels || []).map((l) => `<text x="${l.x}" y="${l.y}" fill="#a1a1aa" font-size="${l.size || 8}" text-anchor="middle" font-weight="bold">${esc(l.text)}</text>`).join('');

    return `<svg viewBox="0 0 300 220" class="w-full h-full">
        <defs><pattern id="custom-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="#27272a" stroke-width="0.5"/></pattern></defs>
        <rect width="100%" height="100%" fill="#18181b"/><rect width="100%" height="100%" fill="url(#custom-grid)"/>
        ${zones}${obstacles}${lines}${objectives}${labels}
    </svg>`;
}

export function renderSvgMap(missionId) {
    return customMaps[missionId] ? renderCustomMap(customMaps[missionId]) : renderLegacyMap(missionId);
}
