const _ = require('lodash');
const cfg = require('./src/components/chart/cfg.js');
const fs = require('fs');

let scss =
  '$' +
  _.trim(JSON.stringify(cfg), '{};')
    .replace(/['"]/g, '')
    .replace(/,/g, ';\n$') +
  ';';

fs.writeFileSync('src/components/chart/cfg.scss', scss, 'utf-8');
