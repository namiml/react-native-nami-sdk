import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageJsonPath = join(__dirname, '../../../package.json');
const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

const name = pkg.name.replace('@', '').replace('/', '-');
const version = pkg.version;

console.log(`${name}-${version}.tgz`);
