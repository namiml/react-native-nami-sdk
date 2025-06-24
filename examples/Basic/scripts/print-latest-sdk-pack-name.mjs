import pkg from '../../../package.json' assert {type: 'json'};

const name = pkg.name.replace('@', '').replace('/', '-');
const version = pkg.version;

console.log(`${name}-${version}.tgz`);
