// src/js/constants/modes-tools.js
import { ALL, EDGE, SHAPE, SPRITE, VERTEX } from 'Constants/modes';
import { ADD, DELETE, SELECT, ROTATE } from 'Constants/tools';

// tools available to each mode
const modeTools = {
  [ALL]: [ADD, DELETE, SELECT, ROTATE],
  [EDGE]: [DELETE, SELECT, ROTATE],
  [SHAPE]: [DELETE, SELECT, ROTATE],
  [SPRITE]: [DELETE, SELECT, ROTATE],
  [VERTEX]: [ADD, DELETE, SELECT, ROTATE],
};

export default modeTools;
