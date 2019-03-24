import Hammer from 'hammerjs';
import './minimap.scss';
import Canvas from './canvas';

const gripWidth = 16;

function Minimap(parent, data, state) {
  let element = document.createElement('div');
  element.classList.add('chart-minimap');
  element.setAttribute('draggable', false);
  const canvas = Canvas(element, data, state, { lineWidth: 2, fullWidth: true });

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
    stateB4 = { ...state };
    target = {};
    if (ev.target.classList.contains('handle') || ev.target.classList.contains('cover')) {
      if (ev.target.classList.contains('left')) {
        target.left = true;
      } else if (ev.target.classList.contains('right')) {
        target.right = true;
      }
    } else if (ev.target.classList.contains('frame')) {
      let x = ev.srcEvent.offsetX / ev.target.offsetWidth;
      target.left = x < 0.95;
      target.right = x > 0.05;
    }
  });

  hammer.on('panmove', function(ev) {
    let patch = {};
    if (target.left) {
      patch.clipStart = stateB4.clipStart + ev.deltaX / element.offsetWidth;
    }
    if (target.right) {
      patch.clipEnd = stateB4.clipEnd + ev.deltaX / element.offsetWidth;
    }
    if (target.left || target.right) {
      if (!target.left || !target.right || (patch.clipStart >= 0 && patch.clipEnd <= 1))
        state.patch(patch);
    }
  });

  hammer.on('panend', function(ev) {
    // console.log('panend');
    stateB4 = null;
    target = null;
  });

  state.on(['clipStart', 'clipEnd'], (e) => {
    renderFrame(state);
  });

  function renderFrame(state) {
    leftCover.style = 'right:' + (100 - state.clipStart * 100) + '%;';
    leftHandle.style = 'left:' + state.clipStart * 100 + '%;';

    rightHandle.style = 'right:' + (100 - state.clipEnd * 100) + '%;';
    rightCover.style = 'left:' + state.clipEnd * 100 + '%;';

    frame.style = [
      `left:calc(${state.clipStart * 100}% + ${gripWidth}px);`,
      `right:calc(${100 - state.clipEnd * 100}% + ${gripWidth}px);`,
    ].join('');
  }
  function render(state) {
    canvas.render(state);
    renderFrame(state);
  }

  parent.appendChild(element);
  return { render, element };
}
export default Minimap;
