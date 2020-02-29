// src/js/constants/modes-tooli.js
import { EDGE, SHAPE, SPRITE, VERTEX } from 'constants/modes';
import { ADD, DELETE, SELECT, ROTATE } from 'constants/tools';

export default {
  [EDGE]: [DELETE, SELECT, ROTATE],
  [SHAPE]: [DELETE, SELECT, ROTATE],
  [SPRITE]: [DELETE, SELECT, ROTATE],
  [VERTEX]: [ADD, DELETE, SELECT, ROTATE],
}
