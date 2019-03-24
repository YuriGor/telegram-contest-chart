import _ from 'lodash';
import './style.scss';
import Chart from './components/chart/chart';

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
      let rerender = _.throttle(() => {
        _.defer(() => {
          chart.render();
        });
      }, 1000);
      window.addEventListener('resize', function(event) {
        rerender();
      });
      return chart;
    });
  });
