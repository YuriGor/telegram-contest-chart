# Install
`npm i`

# Run
`npm start`

# Built App

/dist

# App size

- bundle.js - 64.6 KB
- index.html - 1.6 KB

# Libs used
- Hammerjs  - for touch gestures
- Lodash    - for making life easier

# App Features

## Requirements extracted from screenshots / video

- auto-scale to fit highest visibe point. Autoscale debounced to avoid jerking while panning
- animated Y-axis labels fade out, when autoscale happens, debounced too.
- auto-densing of X-axis labels depending on scale, with fade animation
- minimap with pan/scale
- legend with fancy "material" switches
- switching some line off cause chart auto-scale too
- Details callout / tooltip - triggered by 'tap'
- Nigth Mode - switch moved from bottom to the top-right corner, because there are 4 more charts below


## Extra features not presented explicitly on screenshots / video

- 'Pan' and 'Pinch' gestures on the main chart area
- 'Pan' gesture on details panel to slide over X-axis


## Implementation details

### Webpack + Babel + Lodash tree shaking plugin

* Handy but still lightweight

### SVG + CSS (translate3D/transitions/:nth-child) for rendering

* nice and fast enough, but still easy in implementation
* dynamic CSS classes injecting to use `:nth-last-child` selector instead of manipulating label nodes directly
(see axisX.js and dynamicCssRule.js)

### ES modules as components + decoupled state management

* take a look at state.js - fast and dirty but durable enough "micro-redux"
* isolated HTML

All the code except Lodash and hammer.js written by myself from scratch specially for this constest.
