/**
 * Shared mission-generator helpers.
 *
 * This module is intentionally dependency-free so the GitHub Pages site can
 * keep using plain HTML/JS. It provides the pieces needed to move mission
 * data and application state out of the page without introducing a framework.
 */

export function filterMissions(missions, category = 'all') {
    if (category === 'all') return [...missions];
    return missions.filter((mission) => mission.category === category);
}

export function randomMission(missions, excludedIds = new Set()) {
    const available = missions.filter((mission) => !excludedIds.has(mission.id));
    const pool = available.length ? available : missions;
    if (!pool.length) return null;
    return pool[Math.floor(Math.random() * pool.length)];
}

export function validateMission(mission) {
    const errors = [];
    const requiredStrings = ['id', 'title', 'subtitle', 'category', 'categoryName', 'type'];

    for (const field of requiredStrings) {
        if (typeof mission?.[field] !== 'string' || !mission[field].trim()) {
            errors.push(`Missing or invalid ${field}`);
        }
    }

    if (!['basic', 'advanced'].includes(mission?.category)) {
        errors.push(`Invalid category: ${mission?.category}`);
    }

    for (const field of ['deployment', 'scoring', 'mechanics', 'pace']) {
        if (typeof mission?.[field] !== 'string') {
            errors.push(`Missing or invalid ${field}`);
        }
    }

    return errors;
}

export function validateMissions(missions) {
    const errors = [];
    const ids = new Set();

    if (!Array.isArray(missions)) {
        return ['Mission database must be an array'];
    }

    missions.forEach((mission, index) => {
        if (ids.has(mission?.id)) {
            errors.push(`Duplicate mission id at index ${index}: ${mission.id}`);
        }
        if (mission?.id) ids.add(mission.id);

        validateMission(mission).forEach((error) => {
            errors.push(`Mission ${mission?.id || index}: ${error}`);
        });
    });

    return errors;
}

export function createMissionPool(missions) {
    let usedIds = new Set();

    return {
        next() {
            const mission = randomMission(missions, usedIds);
            if (!mission) return null;
            usedIds.add(mission.id);
            return mission;
        },
        reset() {
            usedIds = new Set();
        },
        remaining() {
            return missions.filter((mission) => !usedIds.has(mission.id)).length;
        }
    };
}
