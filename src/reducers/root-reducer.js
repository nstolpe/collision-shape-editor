// src/reducers/root-reducer.js
import removeVertexFromShapes from 'Reducers/helpers/remove-vertex-from-shapes';
import removeEdgeFromShapes from 'Reducers/helpers/remove-edge-from-shapes';
import getShapeVerticesRelativeToCoordinates from 'Reducers/helpers/get-shape-vertices-relative-to-coordinates';
import recenterSelectedVertices from 'Reducers/helpers/recenter-selected-vertices';

import {
  SET_ROOT_CONTAINER,
  ADD_VERTEX,
  INSERT_VERTEX_BEFORE,
  INSERT_VERTEX_AFTER,
  DELETE_VERTEX,
  MOVE_VERTEX,
  MOVE_VERTICES,
  START_MOVE_VERTEX,
  STOP_MOVE_VERTEX,
  SET_SELECTED_VERTEX_POSITIONS_RELATIVE_TO_COORDINATES,
  SET_SELECTED_VERTICES,
  ADD_SELECTED_VERTICES,
  RECENTER_SELECTED_VERTICES,
  OPEN_SHAPE,
  CLOSE_SHAPE,
  REVERSE_SHAPE_WINDING,
  TOGGLE_SHAPE_SHOW_WINDING,
  CREATE_SHAPE,
  DELETE_SHAPE,
  SET_INTERACTION,
  SET_MODE,
  SET_TOOL,
  RESIZE,
  SCALE_UI,
  SET_BACKGROUND_COLOR,
  SET_ALT_PRESSED,
  SET_CTRL_PRESSED,
  SET_SHIFT_PRESSED,
  SET_SELECT_OVERLAY,
  SET_SELECT_OVERLAY_ENABLED,
  SET_SELECT_OVERLAY_POSITION,
  SET_SELECT_OVERLAY_DIMENSIONS,
  SET_PIXI_APP,
  ADD_TEXTURE_SOURCE,
  REMOVE_TEXTURE_SOURCE,
  ADD_SPRITE,
  SET_CONTEXT_MENU,
  SET_CONTEXT_MENU_OPEN,
  SET_CONTEXT_MENU_POSITION,
  CLOSE_CONTEXT_MENU,
  SET_POINTER_COORDINATES,
} from 'Constants/action-types';
import * as Modes from 'Constants/modes';
import * as Tools from 'Constants/tools';

import List from 'Utility/List';
import { translation } from 'Utility/math';
import { addPrefix, DEFAULT_DELIMITER } from 'Utility/prefix';
import projectShapesToVertices from 'Utility/projectors/project-shapes-to-vertices';

import { VERTEX } from 'Constants/prefixes';

const vertices = [
  [
    {
      x: 400,
      y: 200,
    },
    {
      x: 600,
      y: 200,
    },
    {
      x: 700,
      y: 300,
    },
    {
      x: 700,
      y: 500,
    },
    {
      x: 600,
      y: 600,
    },
    {
      x: 400,
      y: 600,
    },
    {
      x: 300,
      y: 500,
    },
    {
      x: 300,
      y: 300,
    },
  ],
  [
    {
      x: 800,
      y: 600,
    },
    {
      x: 1000,
      y: 600,
    },
    {
      x: 1000,
      y: 800,
    },
    {
      x: 800,
      y: 800,
    },
  ],
];

export const initialState = {
  backgroundColor: 0xbff2d4,
  // interaction: Interactions.TRANSLATE,
  mode: Modes.VERTEX,
  tool: Tools.SELECT,
  // width: 0,
  // height: 0,
  resolution: window.devicePixelRatio,
  lastResize: Date.now(),
  images: {
    default: 'turtle-body.png',
  },
  textureSources: [],
  sprites: [],
  // WARN:  Do not use these vertices, they're old and won't be in sync w/ the shapes.
  vertices: List(vertices[0]),
  selectedVertices: {
    // coordinates (really coordinate modifiers) keyed to a string with
    // delimited vertex and shape identifiers
    // ['VERTEX::<uid>::SHAPE::<uid>']: {
    //   x: 0,
    //   y: 0,
    // },
  },
  shapes: List([
    {
      vertices: List(vertices[0]),
      closed: true,
      showWinding: false,
    },
    {
      vertices: List(vertices[1]),
      closed: false,
      showWinding: false,
    },
  ]),
  movingVerticeIds: [],
  scale: { x: 1, y: 1 },
  altPressed: false,
  ctrlPressed: false,
  shiftPressed: false,
  rootContainer: null,
  selectOverlay: {
    enabled: false,
    height: 0,
    width: 0,
    x: null,
    y: null,
  },
  uiOptions: {
    vertexRadius: 6.5,
  },
  contextMenu: { type: undefined },
  pixiApp: undefined,
  pointerCoordinates: { x: undefined, y: undefined },
};

export const reducer = (state, action) => {
  const { data, type } = action;

  switch (type) {
    case SET_ROOT_CONTAINER:
      return {
        ...state,
        rootContainer: data.container,
      };
    case SET_SELECT_OVERLAY:
      return {
        ...state,
        selectOverlay: { ...state.selectOverlay, ...data },
      };
    case SET_SELECT_OVERLAY_ENABLED:
      return {
        ...state,
        selectOverlay: { ...state.selectOverlay, enabled: data },
      };
    case SET_SELECT_OVERLAY_POSITION:
      return {
        ...state,
        selectOverlay: {
          ...state.selectOverlay,
          x: data.x,
          y: data.y,
        },
      };
    case SET_SELECT_OVERLAY_DIMENSIONS:
      return {
        ...state,
        selectOverlay: {
          ...state.selectOverlay,
          height: data.height,
          width: data.width,
        },
      };
    case SET_PIXI_APP:
      return {
        ...state,
        pixiApp: data.pixiApp,
      };
    case SET_POINTER_COORDINATES:
      return {
        ...state,
        pointerCoordinates: { x: data.x, y: data.y },
      };
    case ADD_VERTEX:
      return {
        ...state,
        vertices: List([...state.vertices, { x: data.x, y: data.y }]),
      };
    case INSERT_VERTEX_BEFORE: {
      const { shapeKey, vertexKey, x, y, makeSelected } = data;
      const { shapes } = state;
      const shape = shapes.key(shapeKey);
      const vertexIndex = shape.vertices.indexOfKey(vertexKey) + 1;
      const shapeIndex = shapes.indexOf(shape);
      const vertices = shape.vertices.splice(
        {
          start: vertexIndex - 1,
          deleteCount: 0,
          newKeys: [undefined],
        },
        { x, y }
      );
      const newShapes = shapes.splice(
        {
          start: shapeIndex,
          deleteCount: 1,
          newKeys: [shapes.keys[shapeIndex]],
        },
        { ...shape, vertices }
      );

      const newState = { ...state, shapes: newShapes };

      if (makeSelected) {
        const key = `VERTEX::${
          vertices.keys[vertexIndex - 1]
        }::SHAPE::${shapeKey}`;
        newState.selectedVertices = { [key]: { x: 0, y: 0 } };
      }

      return newState;
    }
    case INSERT_VERTEX_AFTER: {
      // @TODO: where is makeSelected coming from?
      const { shapeKey, vertexKey, x, y, makeSelected } = data;
      const { shapes } = state;
      const shape = shapes.key(shapeKey);
      const vertexIndex = shape.vertices.indexOfKey(vertexKey) + 1;
      const shapeIndex = shapes.indexOf(shape);
      const vertices = shape.vertices.splice(
        {
          start: vertexIndex,
          deleteCount: 0,
          newKeys: [undefined],
        },
        { x, y }
      );
      const newShapes = shapes.splice(
        {
          start: shapeIndex,
          deleteCount: 1,
          newKeys: [shapes.keys[shapeIndex]],
        },
        { ...shape, vertices }
      );

      const newState = { ...state, shapes: newShapes };

      if (makeSelected) {
        const key = `VERTEX::${vertices.keys[vertexIndex]}::SHAPE::${shapeKey}`;
        newState.selectedVertices = { [key]: { x: 0, y: 0 } };
      }

      return newState;
    }
    case DELETE_VERTEX: {
      const { shapes } = state;
      const { shapeKey, vertexKey } = data;

      return {
        ...state,
        shapes: removeVertexFromShapes(
          { shapes },
          { key: `VERTEX::${vertexKey}::SHAPE::${shapeKey}` }
        ),
      };
    }
    case MOVE_VERTEX:
      return {
        ...state,
        vertices: state.vertices.map((vertex) =>
          vertex.id === data.id ? data : vertex
        ),
      };
    case START_MOVE_VERTEX:
      return {
        ...state,
        movingVerticeIds: [...state.movingVerticeIds, data.id],
      };
    case STOP_MOVE_VERTEX:
      return {
        ...state,
        movingVerticeIds: state.movingVerticeIds.filter(
          (vid) => vid !== data.id
        ),
      };
    case MOVE_VERTICES:
      // @TODO this will probably be removed
      return state;
    // @TODO this constant and everything related to it should be named better.
    case SET_SELECTED_VERTEX_POSITIONS_RELATIVE_TO_COORDINATES:
      return {
        ...state,
        shapes: getShapeVerticesRelativeToCoordinates(
          data,
          state.shapes,
          state.selectedVertices
        ),
      };
    case RECENTER_SELECTED_VERTICES:
      return {
        ...state,
        shapes: recenterSelectedVertices(
          data,
          state.selectedVertices,
          state.shapes
        ),
      };
    case ADD_SELECTED_VERTICES:
      return {
        ...state,
        selectedVertices: {
          ...state.selectedVertices,
          ...data.selectedVertices,
        },
      };
    case SET_SELECTED_VERTICES:
      return {
        ...state,
        selectedVertices: data.selectedVertices,
      };
    case OPEN_SHAPE:
      return state;
    case CLOSE_SHAPE:
      return {
        ...state,
        shapes: state.shapes.map((shape, idx, key) =>
          key === data.id ? { ...shape, closed: true } : shape
        ),
      };
    case REVERSE_SHAPE_WINDING:
      return {
        ...state,
        shapes: state.shapes.map((shape, idx, key) =>
          key === data.id
            ? { ...shape, vertices: shape.vertices.reverse() }
            : shape
        ),
      };
    case TOGGLE_SHAPE_SHOW_WINDING:
      return {
        ...state,
        shapes: state.shapes.map((shape, idx, key) =>
          key === data.id
            ? { ...shape, showWinding: !shape.showWinding }
            : shape
        ),
      };
    case CREATE_SHAPE: {
      const { vertices, closed, showWinding } = data;
      const newShape = { vertices, closed, showWinding };
      const {
        shapes: { keys, values },
      } = state;
      const newShapes = List([...values, newShape], keys);
      const shapeKey = newShapes.keyOf(newShape);
      const newSelectedVertices = vertices.reduce(
        (result, { x, y }, _, vertexKey) => {
          const key = `VERTEX::${vertexKey}::SHAPE::${shapeKey}`;
          result[key] = { x, y };
          return result;
        },
        {}
      );

      return {
        ...state,
        shapes: newShapes,
        selectedVertices: newSelectedVertices,
      };
    }
    // makes the vertex selected if it's unselected and unselected if it's selected.
    // so this is an ok name for now. from a pointerdown.
    case 'TOGGLE_VERTEX_IN_SELECTION': {
      const { name, distance } = data;
      const isThisVertexSelected = Object.prototype.hasOwnProperty.call(
        state.selectedVertices,
        name
      );

      if (isThisVertexSelected) {
        return {
          ...state,
          selectedVertices: Object.entries(state.selectedVertices).reduce(
            (newSelectedVertices, [key, vertex]) => {
              if (key !== name) {
                newSelectedVertices[key] = vertex;
              }
              return newSelectedVertices;
            },
            {}
          ),
        };
      }

      return {
        ...state,
        selectedVertices: { ...state.selectedVertices, [name]: distance },
      };
    }
    case DELETE_SHAPE: {
      return {
        ...state,
        shapes: state.shapes.splice({
          start: state.shapes.indexOfKey(data.id),
          deleteCount: 1,
        }),
      };
    }
    case SET_INTERACTION:
      return {
        ...state,
        mode: data.interaction,
      };
    case SET_MODE:
      return {
        ...state,
        mode: data.mode,
      };
    case SET_TOOL:
      return {
        ...state,
        tool: data.tool,
      };
    case RESIZE:
      return {
        ...state,
        ...action.data,
      };
    case SCALE_UI:
      return {
        ...state,
        scale: { x: data.x, y: data.y },
      };
    case SET_BACKGROUND_COLOR:
      return {
        ...state,
        backgroundColor: data.backgroundColor,
      };
    case SET_ALT_PRESSED:
      return {
        ...state,
        altPressed: data.pressed,
      };
    case SET_CTRL_PRESSED:
      return {
        ...state,
        ctrlPressed: data.pressed,
      };
    case SET_SHIFT_PRESSED:
      return {
        ...state,
        shiftPressed: data.pressed,
      };
    case ADD_TEXTURE_SOURCE:
      return {
        ...state,
        textureSources: {
          ...state.textureSources,
          [data.id]: data.textureData,
        },
      };
    case REMOVE_TEXTURE_SOURCE:
      return {
        ...state,
        textureSources: state.textureSources.filter(
          (textureSource) => textureSource.id !== data.source.id
        ),
      };
    case ADD_SPRITE:
      return {
        ...state,
        sprites: [...state.sprites, { ...data.sprite }],
      };
    case SET_CONTEXT_MENU:
      return {
        ...state,
        contextMenu: {
          type: data.type,
          x: data.x,
          y: data.y,
          options: data.options,
        },
      };
    case SET_CONTEXT_MENU_OPEN:
      return {
        ...state,
        contextMenu: { ...state.contextMenu, open: !!data.open },
      };
    case SET_CONTEXT_MENU_POSITION:
      return {
        ...state,
        contextMenu: {
          ...state.contextMenu,
          x: data.x ?? state.contextMenu.x,
          y: data.y ?? state.contextMenu.y,
        },
      };
    case CLOSE_CONTEXT_MENU:
      return {
        ...state,
        contextMenu: {
          type: undefined,
        },
      };
    default:
      // console.log(`undefined action: ${action.type}`, action);
      return state;
  }
};
