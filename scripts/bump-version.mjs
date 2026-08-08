import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const targetVersion = process.argv[2];

if (!targetVersion || !/^\d+\.\d+\.\d+(?:-[a-zA-Z0-9.]+)?$/.test(targetVersion)) {
  console.error('\n❌ Error: Please specify a valid SemVer string.');
  console.error('Usage: pnpm version:set <new-version> (e.g. pnpm version:set 0.2.0)\n');
  process.exit(1);
}

// Function to locate all package.json files across the monorepo
function findPackageJsonFiles(baseDir) {
  const results = [];
  
  // 1. Root package.json
  const rootPkg = path.join(baseDir, 'package.json');
  if (fs.existsSync(rootPkg)) {
    results.push(rootPkg);
  }

  // 2. Scan workspace folders (apps and packages)
  const workspaceFolders = ['apps', 'packages'];
  for (const folder of workspaceFolders) {
    const folderPath = path.join(baseDir, folder);
    if (fs.existsSync(folderPath)) {
      const subdirs = fs.readdirSync(folderPath, { withFileTypes: true });
      for (const subdir of subdirs) {
        if (subdir.isDirectory()) {
          const pkgPath = path.join(folderPath, subdir.name, 'package.json');
          if (fs.existsSync(pkgPath)) {
            results.push(pkgPath);
          }
        }
      }
    }
  }

  return results;
}

console.log(`\n🚀 Synchronizing all workspace package versions to v${targetVersion}...\n`);

const allPackages = findPackageJsonFiles(rootDir);

for (const pkgPath of allPackages) {
  const relPath = path.relative(rootDir, pkgPath);
  const raw = fs.readFileSync(pkgPath, 'utf8');
  const json = JSON.parse(raw);
  const oldVersion = json.version;
  
  json.version = targetVersion;
  fs.writeFileSync(pkgPath, JSON.stringify(json, null, 2) + '\n', 'utf8');
  console.log(`  ✓ ${relPath} (${oldVersion || 'none'} -> ${targetVersion})`);
}

// Also sync constants in source code (packages/core/src/index.ts)
const coreIndexPath = path.join(rootDir, 'packages/core/src/index.ts');
if (fs.existsSync(coreIndexPath)) {
  let content = fs.readFileSync(coreIndexPath, 'utf8');
  content = content.replace(/VERSION:\s*['"][^'"]+['"]/, `VERSION: '${targetVersion}'`);
  fs.writeFileSync(coreIndexPath, content, 'utf8');
  console.log(`  ✓ packages/core/src/index.ts (IDE_METADATA.VERSION = '${targetVersion}')`);
}

console.log(`\n✅ Monorepo version successfully updated to v${targetVersion} across ${allPackages.length} package.json files!\n`);
