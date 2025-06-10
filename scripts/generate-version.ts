import * as fs from 'fs';
import * as path from 'path';

const pkgPath = path.resolve(__dirname, '../package.json');
const versionFilePath = path.resolve(__dirname, '../src/version.ts');

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const version = pkg.version;

const fileContent = `/**
 * Auto-generated file. Do not edit manually.
 * React Native Nami SDK version.
 */
export const NAMI_REACT_NATIVE_VERSION = '${version}';
`;

fs.writeFileSync(versionFilePath, fileContent, 'utf8');
console.log(`Generated version.ts with version ${version}`);
