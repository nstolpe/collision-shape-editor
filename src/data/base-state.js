// src/data/base-state.js
import * as Interactions from 'constants/interactions';
import * as Modes from 'constants/modes';
import * as Tools from 'constants/tools';
import List from 'tools/List';

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
