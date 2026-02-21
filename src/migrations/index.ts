import * as migration_20260221_142619_initial from './20260221_142619_initial';

export const migrations = [
  {
    up: migration_20260221_142619_initial.up,
    down: migration_20260221_142619_initial.down,
    name: '20260221_142619_initial'
  },
];
