import { VIEWPORT } from 'Constants/prefixes';
import projectShapesToVertices from 'Utility/projectors/project-shapes-to-vertices';
import { withinAABB } from 'Utility/math';
import { keySelector } from 'Selectors/keys';

/**
 * @TODO: this is serving double duty to update the selectedVertices state and the
 * selectOverlay state. split into two util functions. no need to check selectOverlay.enabled,
 * that's done in the reducer. each will take state and return its portion of state.
 * only break up once flow is complete so this can be tested.
 */
const updateSelectOverlay = (state) => {
  const {
    addModifierCode,
    pressedKeyCodes,
    selectOverlay,
    selectedVertices,
    uiOptions: { vertexRadius },
  } = state;
  const addModifierKeyPressed = !!keySelector(addModifierCode)({
    pressedKeyCodes,
  });
  // selectedVertices need the shape key as part of it. modify projection
  const vertices = projectShapesToVertices(state.shapes);

  // If the overlay is open so there's a potential select by overlay in progress,
  // try to change the selection change the selection and close the overlay.
  let newSelectedVertices;
  const targetVertices = vertices.filter(({ x, y }) =>
    withinAABB(
      { x, y },
      { x: selectOverlay.x, y: selectOverlay.y },
      {
        x: selectOverlay.x + selectOverlay.width,
        y: selectOverlay.y + selectOverlay.height,
      },
      vertexRadius
    )
  );

  if (addModifierKeyPressed) {
    newSelectedVertices = targetVertices.reduce(
      (resultVertices, _c, _i, key) => {
        resultVertices[key] = { x: 0, y: 0 };
        return resultVertices;
      },
      { ...selectedVertices }
    );
  } else {
    // replace the selection
    newSelectedVertices = targetVertices.reduce(
      (resultVertices, _c, _i, key) => {
        resultVertices[key] = { x: 0, y: 0 };
        return resultVertices;
      },
      {}
    );
  }

  // @TODO: move this into reducer. add func to return this state.
  const newSelectOverlay = {
    enabled: false,
    x: null,
    y: null,
    height: 0,
    width: 0,
  };

  return {
    ...state,
    selectOverlay: newSelectOverlay,
    selectedVertices: newSelectedVertices,
  };
};

/**
 * Reducer that handles a MAIN (left) pointer up. Passes control on to a target
 * specific reducer.
 */
const reducer = (state, { type }) => {
  switch (type) {
    // @TODO: SHAPE *might* want to use VIEWPORT's case as well.
    case VIEWPORT: {
      const { selectOverlay } = state;
      if (selectOverlay.enabled) {
        return updateSelectOverlay(state);
      }
      return state;
    }
    default:
      return state;
  }
};

export default reducer;
