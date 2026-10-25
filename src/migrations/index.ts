import * as migration_20261025_182715_initial from './20261025_182715_initial';

export const migrations = [
  {
    up: migration_20261025_182715_initial.up,
    down: migration_20261025_182715_initial.down,
    name: '20261025_182715_initial'
  },
];
