import _ from 'lodash';
import './style.scss';
import Chart from './components/chart/chart';

// function component() {
//   let element = document.createElement('div');
//
//   // Lodash, currently included via a script, is required for this line to work
//   element.innerHTML =
//     _.join(['Hello', 'webpack!'], ' ') +
//     '<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="#000000" d="' +
//     mdiCheck +
//     '"/></svg>';
//   element.classList.add('hello');
//   return element;
// }

window.addEventListener(
  'contextmenu',
  function(e) {
    e.preventDefault();
  },
  false,
);

fetch('data/canonical.json')
  .then(function(response) {
    return response.json();
  })
  .then(function(dataArray) {
    // console.log(JSON.stringify(myJson));
    let charts = _.map(dataArray, (data, i) => {
      let chart = Chart(document.getElementById('charts'), data, {
        title: `Awesome Chart ${i + 1} / ${dataArray.length}`,
      });
      chart.render();
      window.addEventListener('resize', function(event) {
        chart.render();
      });
      return chart;
    });
  });
