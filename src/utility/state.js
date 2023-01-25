import { EDGE, VERTEX } from 'Constants/prefixes';
import { keySelector } from 'Selectors/keys';
import { translation } from 'Utility/math';
import { DEFAULT_DELIMITER } from 'Utility/prefix';
import targetTypeFromKey from 'Utility/target-type-from-key';

// @TODO rename this to utility/vertex.js, utility/geometry.js or something
/**
 * Checks if a vertex is selected
 */
export const isVertexSelected = (selectedVertices, key) =>
  Object.prototype.hasOwnProperty.call(selectedVertices, key);

export const areAllVerticesSelected = (selectedVertices, ...keys) => {
  for (const key of keys) {
    if (!isVertexSelected(selectedVertices, key)) {
      return false;
    }
  }
  return true;
};

/**
 * Returns selectedVertices with the queuedSelectedVertex added
 */
export const processQueuedSelectedVertex = (
  { addModifierCode, selectedVertices, pressedKeyCodes },
  { queuedSelectedVertex }
) => {
  const basePayload = {
    queuedSelectedVertex: null,
    selectedVertexQueue: [],
    selectedVertices,
  };

  if (queuedSelectedVertex == null) {
    return basePayload;
  }

  let newSelectedVertices = { ...selectedVertices };

  const { coordinates, key, position } = queuedSelectedVertex;
  const isThisVertexSelected = isVertexSelected(selectedVertices, key);
  const distance = translation(coordinates, position);

  // If addModifier is pressed, toggle the single target vertex
  if (keySelector(addModifierCode)({ pressedKeyCodes }) !== undefined) {
    if (isThisVertexSelected) {
      delete newSelectedVertices[key];
    } else {
      newSelectedVertices[key] = distance;
    }
    return { ...basePayload, selectedVertices: newSelectedVertices };
  }

  // vertex isn't selected, it becomes the only selection
  if (!isThisVertexSelected) {
    newSelectedVertices = { [key]: distance };
  }

  return { ...basePayload, selectedVertices: newSelectedVertices };
};

export const processQueuedSelectedEdge = (
  { addModifierCode, selectedVertices, pressedKeyCodes, selectedVertexQueue },
  data
) => {
  let newSelectedVertices = {};
  const selectedVertexQueueKeys = selectedVertexQueue.map(({ key }) => key);

  if (keySelector(addModifierCode)({ pressedKeyCodes }) !== undefined) {
    // if the first/primary/add/shift modifier key is pressed
    newSelectedVertices = { ...selectedVertices };

    if (areAllVerticesSelected(selectedVertices, ...selectedVertexQueueKeys)) {
      // if both edge vertices are selected, unselect them
      for (const key of selectedVertexQueueKeys) {
        delete newSelectedVertices[key];
      }
    } else {
      // if neither or one is selected, select both.
      newSelectedVertices = selectedVertexQueue.reduce(
        (newSelectedVerts, queuedSelectedVertex) => {
          const distance = translation(
            queuedSelectedVertex.position,
            data.coordinates
          );
          newSelectedVerts[queuedSelectedVertex.key] = distance;
          return newSelectedVerts;
        },
        newSelectedVertices
      );
    }
  } else {
    if (areAllVerticesSelected(selectedVertices, ...selectedVertexQueueKeys)) {
      // if both edge vertices are selected, change nothing
      newSelectedVertices = selectedVertices;
    } else {
      // otherwise replace the selectedVertices with the edge vertices
      newSelectedVertices = selectedVertexQueue.reduce(
        (newSelectedVerts, queuedSelectedVertex) => {
          const distance = translation(
            queuedSelectedVertex.position,
            data.coordinates
          );
          newSelectedVerts[queuedSelectedVertex.key] = distance;
          return newSelectedVerts;
        },
        {}
      );
    }
  }

  return {
    queuedSelectedVertex: null,
    selectedVertexQueue: [],
    selectedVertices: newSelectedVertices,
  };
};

export const processSelectedVertexQueue = (
  { addModifierCode, selectedVertices, pressedKeyCodes, selectedVertexQueue },
  data
) => {
  const type = targetTypeFromKey(data.key);
  const defaultSelectedVertexQueueData = {
    queuedSelectedVertex: null,
    selectedVertexQueue: [],
    selectedVertices,
  };

  if (selectedVertexQueue.length <= 0) {
    return defaultSelectedVertexQueueData;
  }

  switch (type) {
    case EDGE:
      return processQueuedSelectedEdge(
        {
          addModifierCode,
          selectedVertices,
          pressedKeyCodes,
          selectedVertexQueue,
        },
        data
      );
    case VERTEX:
      return processQueuedSelectedVertex(
        {
          addModifierCode,
          selectedVertices,
          pressedKeyCodes,
          selectedVertexQueue,
        },
        {
          queuedSelectedVertex: selectedVertexQueue[0],
        }
      );
    default:
      return defaultSelectedVertexQueueData;
  }
};

/**
 * Returns shapes with x and y elements of all selected vertices
 * updated relative to the pointer coordinates.
 */
export const getUpdatedShapeVertexPositions = (
  { selectedVertices, shapes },
  { coordinates }
) => {
  let newShapes = shapes.slice();

  for (const name in selectedVertices) {
    const [, vertexKey, , shapeKey] = name.split(DEFAULT_DELIMITER);
    const shape = newShapes.key(shapeKey);
    const distance = selectedVertices[name];
    const newVertices = shape.vertices.map((vertex, index, key) => {
      if (key === vertexKey) {
        return {
          x: coordinates.x + distance.x,
          y: coordinates.y + distance.y,
        };
      } else {
        return vertex;
      }
    });

    newShapes = newShapes.setByKey(
      {
        ...shape,
        vertices: newVertices,
      },
      shapeKey
    );
  }

  return newShapes;
};

/**
 * Updates shapes (vertices) or activePointers based on a vertex move event.
 */
export const updateStateFromPointerMove = (state, { data }) => {
  const { coordinates, identifier } = data;
  // @TODO: maybe return state here if tool is Tools.DELETE. possibly new reducer.
  const {
    activePointers,
    addModifierCode,
    pressedKeyCodes,
    queuedSelectedVertex,
    selectedVertices,
    shapes,
  } = state;
  // const newSelectedVertices = processQueuedSelectedVertex(state, {
  //   queuedSelectedVertex: selectedVertexQueue[0],
  // }).selectedVertices;

  const newSelectedVertices = processSelectedVertexQueue(
    state,
    data
  ).selectedVertices;

  let newActivePointers = activePointers;
  let newShapes = shapes;

  if (
    queuedSelectedVertex !== null &&
    keySelector(addModifierCode)({ pressedKeyCodes }) !== undefined && // is addModifier (shift) pressed
    isVertexSelected(selectedVertices, queuedSelectedVertex.key)
  ) {
    // if the addModifierKey is pressed and the queuedSelectedVertex is already selected (so this event
    // is deselecting it) remove the active pointer and end this pointer event chain
    newActivePointers = activePointers.filter(
      (activePointer) => activePointer.identifier !== identifier
    );
  } else {
    // update the positions of the latest selectedVertices, including any just selected or deselected
    newShapes = getUpdatedShapeVertexPositions(
      { shapes, selectedVertices: newSelectedVertices },
      {
        coordinates,
      }
    );
  }

  return {
    ...state,
    activePointers: newActivePointers,
    queuedSelectedVertex: null,
    selectedVertexQueue: [],
    selectedVertices: newSelectedVertices,
    shapes: newShapes,
  };
};
