export const STORAGE_MIGRATION_FLAG = 'vive-mexico-storage-migrated';

const KEY_MIGRATIONS: Array<{ from: string; to: string }> = [
  { from: 'ola-session', to: 'vive-mexico-session' },
  { from: 'ola-mexico-settings', to: 'vive-mexico-settings' },
  { from: 'ola-mexico-lang', to: 'vive-mexico-lang' },
  { from: 'ola-mexico-role', to: 'vive-mexico-role' },
  { from: 'ola-merchant-id', to: 'vive-mexico-merchant-id' },
  { from: 'ola-tourist-id', to: 'vive-mexico-tourist-id' },
  { from: 'ola-swipe-categories', to: 'vive-mexico-swipe-categories' },
];

export const migrateLocalStorageKeys = () => {
  try {
    if (localStorage.getItem(STORAGE_MIGRATION_FLAG)) return;
    KEY_MIGRATIONS.forEach(({ from, to }) => {
      const current = localStorage.getItem(to);
      if (current !== null) return;
      const legacy = localStorage.getItem(from);
      if (legacy === null) return;
      localStorage.setItem(to, legacy);
      localStorage.removeItem(from);
    });
    localStorage.setItem(STORAGE_MIGRATION_FLAG, '1');
  } catch {}
};
