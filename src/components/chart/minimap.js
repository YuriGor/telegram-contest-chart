import _ from 'lodash';
import Hammer from 'hammerjs';
import './minimap.scss';
import Line from './line';

const gripWidth = 16;

function Minimap(parent, lData, state) {
  let element = document.createElement('div');
  element.classList.add('chart-minimap');
  element.setAttribute('draggable', false);

  const lines = {};
  _.each(lData, (ld) => {
    lines[ld.id] = Line(element, ld, state, { lineWidth: 2, fullWidth: true });
  });

  let leftCover = document.createElement('div');
  leftCover.classList.add('cover', 'left');
  element.appendChild(leftCover);

  let leftHandle = document.createElement('div');
  leftHandle.classList.add('handle', 'left');
  leftHandle.setAttribute('draggable', false);
  element.appendChild(leftHandle);

  let frame = document.createElement('div');
  frame.classList.add('frame');
  element.appendChild(frame);

  let rightHandle = document.createElement('div');
  rightHandle.classList.add('handle', 'right');
  element.appendChild(rightHandle);

  let rightCover = document.createElement('div');
  rightCover.classList.add('cover', 'right');
  element.appendChild(rightCover);

  let stateB4 = null;
  let target = {};
  var hammer = new Hammer(element);
  hammer.get('pan').set({ threshold: 0 });
  hammer.on('panstart', function(ev) {
    stateB4 = _.clone(state);
    target = {};
    if (ev.target.classList.contains('handle') || ev.target.classList.contains('cover')) {
      if (ev.target.classList.contains('left')) {
        target.left = true;
      } else if (ev.target.classList.contains('right')) {
        target.right = true;
      }
    } else if (ev.target.classList.contains('frame')) {
      target.left = true;
      target.right = true;
    }
  });

  hammer.on('panmove', function(ev) {
    let patch = {};
    if (target.left) {
      patch.frameStart = stateB4.frameStart + ev.deltaX / element.offsetWidth;
    }
    if (target.right) {
      patch.frameEnd = stateB4.frameEnd + ev.deltaX / element.offsetWidth;
    }
    if (target.left || target.right) {
      state.patch(patch);
    }
  });

  hammer.on('panend', function(ev) {
    // console.log('panend');
    stateB4 = null;
    target = null;
  });

  state.on(['frameStart', 'frameEnd'], (e) => {
    renderFrame(state);
  });

  function renderFrame(state) {
    leftCover.style = 'right:' + (100 - state.frameStart * 100) + '%;';
    leftHandle.style = 'left:' + state.frameStart * 100 + '%;';

    rightHandle.style = 'right:' + (100 - state.frameEnd * 100) + '%;';
    rightCover.style = 'left:' + state.frameEnd * 100 + '%;';

    frame.style = [
      `left:calc(${state.frameStart * 100}% + ${gripWidth}px);`,
      `right:calc(${100 - state.frameEnd * 100}% + ${gripWidth}px);`,
    ].join('');
  }
  function render(state) {
    _.each(lines, (l) => {
      l.render(state);
    });
    renderFrame(state);
  }

  parent.appendChild(element);
  return { render, element };
}
export default Minimap;
