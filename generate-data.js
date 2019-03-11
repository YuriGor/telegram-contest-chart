const fs = require('fs');
const _ = require('lodash');
const moment = require('moment');
const day = 24 * 60 * 60 * 1000;
const daysAgo = 60;
const now = Date.now();
const limits = { joinedMax: 250, joinedMin: 50, leftMax: 150, leftMin: 25 };
let data = [];

for (var i = 0; i < daysAgo; i++) {
  let d = moment(now - day * i).startOf('day');
  let j = _.random(limits.joinedMin, limits.joinedMax);
  let l = _.random(limits.leftMin, limits.leftMax);
  data.push([d.valueOf(), j, l]);
  // console.log(d.format('MMM D'));
}
// console.log(data);
fs.writeFileSync('dist/data/generated.json', JSON.stringify(data), 'utf-8');
// fs.writeFileSync(
//   'company-sentiment-flat.json',
//   JSON.stringify(flat, null, 2),
//   'utf-8'
// );
// fs.writeFileSync('company-sentiment.dsql', collection, 'utf-8');
// console.log('done');
