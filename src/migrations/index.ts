import * as migration_20260221_142619_initial from './20260221_142619_initial';
import * as migration_20260221_152105 from './20260221_152105';

export const migrations = [
  {
    up: migration_20260221_142619_initial.up,
    down: migration_20260221_142619_initial.down,
    name: '20260221_142619_initial',
  },
  {
    up: migration_20260221_152105.up,
    down: migration_20260221_152105.down,
    name: '20260221_152105'
  },
];
