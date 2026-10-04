// Guards the shared Supabase database: portfolio SQL must not touch Codex
// (`inner_mirror`) or redefine helpers that Codex also uses. Run: npm run check:db
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = 'supabase';
const files = [
  ...readdirSync(join(dir, 'migrations')).map((f) => join(dir, 'migrations', f)),
  join(dir, 'seed.sql'),
].filter((f) => f.endsWith('.sql'));

const RULES = [
  [/inner_mirror/i, 'references the Codex schema (inner_mirror)'],
  [/(create\s+or\s+replace|drop|alter)\s+function\s+private\.set_updated_at/i, 'changes private.set_updated_at(), which Codex also uses'],
  [/\b(delete\s+from|update|truncate)\s+auth\./i, 'modifies shared auth data'],
  [/\b(alter|drop)\s+schema\s+(?!portfolio\b)/i, 'alters a schema other than portfolio'],
  [/\bon\s+schema\s+(?!portfolio\b)\w+/i, 'grants/revokes on a schema other than portfolio'],
];

let failed = false;
for (const file of files) {
  if (!file.includes('seed') && !/portfolio/.test(file)) {
    console.error(`✗ ${file}: migration file name must include "portfolio"`);
    failed = true;
  }
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    const code = line.replace(/--.*$/, '');
    for (const [pattern, why] of RULES) {
      if (pattern.test(code)) {
        console.error(`✗ ${file}:${i + 1} ${why}\n    ${line.trim()}`);
        failed = true;
      }
    }
  });
}

if (failed) process.exit(1);
console.log(`✓ ${files.length} SQL files stay inside the portfolio's part of shared-backend`);
