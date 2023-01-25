// hooks/usePointerInteractions.js
import { useState } from 'react';

import { setSelectedVertexPositionsRelativeToCoordinates } from 'Actions/actions';
import { pointerDown, pointerMove, pointerUp } from 'Reducers/pointer-events';
import ScreenContext from 'Contexts/ScreenContext';

import { findAncestorViewport } from 'Utility/pixi';
import projectShapesToVertices from 'Utility/projectors/project-shapes-to-vertices';

import { hasPrefix } from 'Utility/prefix';
import { EDGE } from 'Constants/prefixes';
import useSelector from 'Hooks/useSelector';
import restComparator from 'Comparators/rest';
import selectOverlayComparator from 'Comparators/select-overlay';
import selectedVerticesComparator from 'Comparators/selected-vertices';
import verticesComparator from 'Comparators/vertices';
import { keySelector } from 'Selectors/keys';

// @TODO break this file up. maybe convert it into multiple hooks.. useCallback(handler)
// https://stackoverflow.com/a/55015145
// or make into an hoc? (still break out functions).
// consider combining some logic from the reducer helpers
const selector = ({
  dispatch,
  mode,
  selectOverlay,
  tool,
  shapes,
  uiOptions: { vertexRadius },
  addModifierCode,
  subtractModifierCode,
  panModifierCode,
  pressedKeyCodes,
  selectedVertices,
}) => ({
  dispatch,
  mode,
  selectOverlay,
  tool,
  shapes,
  // project all the vertices into a flattened List
  // @TODO move this to util: Projections.flattenShapeVertices(shapes);
  vertices: projectShapesToVertices(shapes),
  vertexRadius,
  addModifierCode,
  subtractModifierCode,
  panModifierCode,
  pressedKeyCodes,
  selectedVertices,
  addModifierKeyPressed: !!keySelector(addModifierCode)({ pressedKeyCodes }),
  panModifierKeyPressed: !!keySelector(panModifierCode)({ pressedKeyCodes }),
});

const comparator = (
  { selectOverlay, vertices, pressedKeyCodes, selectedVertices, ...restProps },
  {
    selectOverlay: oldSelectOverlay,
    vertices: oldVertices,
    pressedKeyCodes: oldPressedKeyCodes,
    selectedVertices: oldSelectedVertices,
    ...restOldProps
  }
) => {
  if (!selectOverlayComparator(selectOverlay, oldSelectOverlay)) {
    return false;
  }

  // pressedKeyCodes
  const keyCodeLength = Object.keys(pressedKeyCodes).length;

  if (keyCodeLength !== Object.keys(oldPressedKeyCodes).length) {
    return false;
  }

  for (let i = 0; i < keyCodeLength; i++) {
    if (pressedKeyCodes[i] !== oldPressedKeyCodes[i]) {
      return false;
    }
  }
  // end pressedKeyCodes

  if (!selectedVerticesComparator(selectedVertices, oldSelectedVertices)) {
    return false;
  }

  if (!verticesComparator(vertices, oldVertices)) {
    return false;
  }

  if (!restComparator(restProps, restOldProps)) {
    return false;
  }

  return true;
};

const usePointerInteraction = () => {
  const [activePointers] = useState([]);
  const [justRemoved] = useState(false);
  const { dispatch, selectedVertices } = useSelector(
    ScreenContext,
    selector,
    comparator
  );
  /****************************************************************************************
   * Main pointer events, catch all interactions and pass them to more specific handlers. *
   ***************************************************************************************/

  /**
   * Main pointerdown, initial entry for most events.
   */
  const handlePointerDown = (event) => {
    const {
      data: { button, identifier },
      target,
    } = event;
    const viewport = findAncestorViewport(event.target);

    if (!viewport) {
      return;
    }

    const coordinates = event.data.getLocalPosition(viewport);

    dispatch(
      pointerDown({
        button,
        coordinates,
        identifier,
        key: target.name,
        position: target.position,
        target,
      })
    );
  };

  /**
   * Main pointermove, covers a large variety of interactions.
   * @TODO decide whether throttling this whole function or
   */
  const handlePointerMove = (event) => {
    const { data: { identifier } = {}, target } = event;
    const viewport = findAncestorViewport(target);

    // @TODO don't make moves outside of the canvas cancel if there's a pointer.
    // so this will need to get to the reducer then
    if (!viewport) {
      return;
    }

    const pointerCoordinates = event.data.getLocalPosition(viewport);

    dispatch(
      pointerMove({
        coordinates: pointerCoordinates,
        identifier,
      })
    );
  };

  /**
   * Main pointerup, final main entry for an interaction.
   */
  const handlePointerUp = (event) => {
    const {
      data: { button, identifier },
      target,
    } = event;
    const pointer = activePointers.find(
      (activePointer) => activePointer.identifier === identifier
    );
    const viewport = findAncestorViewport(target);
    const coordinates = event.data.getLocalPosition(viewport);
    dispatch(
      pointerUp({
        button,
        coordinates,
        identifier,
        position: target.position,
        key: target.name,
      })
    );
  };

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    selectedVertices,
  };
};

export default usePointerInteraction;
