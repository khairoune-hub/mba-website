import * as migration_20261025_141913_initial from './20261025_141913_initial';
import * as migration_20261025_182715_initial from './20261025_182715_initial';
import * as migration_20261111_150146_redesign_content from './20261111_150146_redesign_content';

export const migrations = [
  {
    up: migration_20261025_141913_initial.up,
    down: migration_20261025_141913_initial.down,
    name: '20261025_141913_initial',
  },
  {
    up: migration_20261025_182715_initial.up,
    down: migration_20261025_182715_initial.down,
    name: '20261025_182715_initial',
  },
  {
    up: migration_20261111_150146_redesign_content.up,
    down: migration_20261111_150146_redesign_content.down,
    name: '20261111_150146_redesign_content'
  },
];
