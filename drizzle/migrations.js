// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import m0000 from './0000_needy_starbolt.sql';
import m0001 from './0001_rename_barecode_to_barcode.sql';
import m0002 from './0002_add_all_tables.sql';
import journal from './meta/_journal.json';

export default {
  journal,
  migrations: {
    m0000,
    m0001,
    m0002,
  },
};
