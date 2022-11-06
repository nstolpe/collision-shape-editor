// src/data/base-state.js
import * as Interactions from 'Constants/interactions';
import * as Modes from 'Constants/modes';
import * as Tools from 'Constants/tools';
import List from 'Utility/List';

const buildShapes = shapes => {
  shapes.map(shape => List(shape))
};

const state = {
  backgroundColor: '',
  mode: Modes.VERTEX,
  tool: Tools.SELECT,
  resolution: window.devicePixelRatio,
  textureSources: [],
  // PIXI sprites. Maybe a List
  sprites: [],
  // a shape is a List of vertices. vertice = { x, y }
  shapes: [],
  vertices: [],
};

export default state;
