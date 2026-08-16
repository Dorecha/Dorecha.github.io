import assert from 'node:assert/strict';
import {
    filterMissions,
    randomMission,
    validateMission,
    validateMissions,
    createMissionPool
} from '../js/mission-core.js';

const missions = [
    {
        id: 'm1', title: 'One', subtitle: 'One', category: 'basic', categoryName: 'Basic', type: 'Front',
        deployment: '<p>deployment</p>', scoring: '<p>scoring</p>', mechanics: '<p>mechanics</p>', pace: 'pace'
    },
    {
        id: 'm2', title: 'Two', subtitle: 'Two', category: 'advanced', categoryName: 'Advanced', type: 'Diagonal',
        deployment: '<p>deployment</p>', scoring: '<p>scoring</p>', mechanics: '<p>mechanics</p>', pace: 'pace'
    }
];

assert.equal(filterMissions(missions, 'all').length, 2);
assert.equal(filterMissions(missions, 'basic').length, 1);
assert.equal(filterMissions(missions, 'advanced')[0].id, 'm2');

assert.equal(validateMission(missions[0]).length, 0);
assert.equal(validateMission({ id: 'bad', category: 'wrong' }).length > 0, true);
assert.equal(validateMissions(missions).length, 0);
assert.equal(validateMissions([...missions, { ...missions[0] }]).length, 1);

const selected = randomMission(missions, new Set(['m1']));
assert.equal(selected.id, 'm2');

const pool = createMissionPool(missions);
const first = pool.next();
const second = pool.next();
assert.notEqual(first.id, second.id);
assert.equal(pool.remaining(), 0);
assert.equal(pool.next().id === first.id || pool.next().id === second.id, true);
pool.reset();
assert.equal(pool.remaining(), 2);

console.log('mission-core tests: OK');
