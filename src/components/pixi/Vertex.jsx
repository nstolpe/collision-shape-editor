// components/pixi/Vertex.js
import React from 'react';
import PropTypes from 'prop-types';
import * as PIXI from 'pixi.js';

import Circle from 'components/pixi/base/Circle';
import ScreenContext from 'contexts/ScreenContext';
import {
  CELL,
  DEFAULT,
  GRAB,
  MOVE,
  NONE,
  NOT_ALLOWED,
} from 'constants/cursors';
import Tools from 'constants/tools';
import {
  deleteVertex,
  moveVertex,
} from 'actions/actions';
import { useScreenContext } from 'contexts/ScreenContext';

export const getCursor = tool => {
  switch (tool) {
    case Tools.ADD:
      return CELL;
    case Tools.DELETE:
      return NOT_ALLOWED;
    case Tools.SELECT:
      return MOVE;
    default:
      return DEFAULT;
  }
};

const Vertex = ({
  active,
  activeFill,
  fill,
  hitArea,
  id,
  setCursor,
  setSelectedVertices,
  selectedVertices,
  tool,
  x,
  y,
  ...props
}) => {
  const {
    altPressed,
    ctrlPressed,
    dispatch,
  } = useScreenContext();

  const pointerdown = event => {
    event.stopPropagation();
    console.log('sdf')
    // console.log('pointerdown');
    // switch (true) {
    //     case altPressed && !ctrlPressed:
    //         dispatch(deleteVertex(id));
    //         break;
    //     case !altPressed && !ctrlPressed:
    //         coordinates = event.data.getLocalPosition(event.currentTarget.parent);
    //         // dispatch(startMoveVertex(id));
    //         (true);
    //         setSelectedVertices(ids => [...ids, { id, coordinates, isPrimary: event.data.isPrimary, tye: event.data.pointerType }]);
    //         break;
    //     default:
    //         break;
    // }
    setCursor(MOVE);
    if (
      !selectedVertices.find(vertex =>
        vertex.id === event.currentTarget.id &&
        vertex.identifier === event.data.identifier
      ) && event.currentTarget.id === id
    ) {
      const coordinates = event.data.getLocalPosition(event.currentTarget.parent);
      setSelectedVertices(
        ids => [...ids, { id, coordinates, identifier: event.data.identifier }]
      );
    }
  };

  const pointerup = event => {
    event.stopPropagation();
    // @TODO make stage available via context.
    // const stage = e.target.parent.parent.parent;
    const graphic = event.target;
    // const sprite = stage.children[0].children[0].children[0];
    const graphicGlobalCoords = graphic.toGlobal({x:0,y:0});
    const pointGlobalCoords = event.target.toGlobal({x:0,y:0});
    // console.log(`x: ${graphicGlobalCoords.x} y: ${graphicGlobalCoords.y}, x: ${pointGlobalCoords.x} y: ${pointGlobalCoords.y}`);
    // console.log(`x diff: ${graphicGlobalCoords.x - pointGlobalCoords.x} y diff: ${graphicGlobalCoords.y - pointGlobalCoords.y}`);

    const coordinates = event.data.getLocalPosition(event.currentTarget.parent);
    // dispatch(moveVertex({ ...coordinates, id }));
    // dispatch(stopMoveVertex(id));
    setCursor(GRAB);

    if (selectedVertices.find(vertex => vertex.id === event.currentTarget.id) && event.currentTarget.id === id) {
      dispatch(moveVertex({ ...coordinates, id }));
    }

    setSelectedVertices(currentselectedVertices => currentselectedVertices.filter(activeVertex => activeVertex.id !== id));
  };

  const pointerupoutside = event => {
    event.stopPropagation();
    setSelectedVertices(currentselectedVertices => currentselectedVertices.filter(activeVertex => activeVertex.id !== id));
  };

  const eventLog = e => {
    // e.stopPropagation();
    console.log(e.type, e);
  }

  return (
    <Circle
      name={`VERTEX__${id}`}
      fill={selectedVertices.find(vertex => vertex.name === `VERTEX__${id}`) ? activeFill : fill}
      interactive={true}
      buttonMode
      cursor={getCursor(tool)}
      // pointerdown={pointerdown}
      // pointerup={pointerup}
      // pointerupoutside={pointerupoutside}
      // pointercancel={eventLog}
      // pointerdown={eventLog}
      // pointermove={eventLog}
      // pointerout={eventLog}
      // pointerover={eventLog}
      // pointerup={eventLog}
      // pointerupoutside={eventLog}
      hitArea={hitArea}
      x={x}
      y={y}
      pivot={{x: 0, y: 0}}
      {...props}
    />
  );
};

Vertex.defaultProps = {
  active: false,
  activeFill: 0x17bafb,
  alpha: 1,
  radius: 4.5,
  fill: 0xe62bdc,
  strokeColor: 0xffffff,
  strokeWidth: 2,
  strokeAlignment: 1,
  hitArea:new PIXI.Circle(0, 0, 5.5)
};

Vertex.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  active: PropTypes.bool,
  activeFill: PropTypes.number,
  alpha: PropTypes.number,
  radius: PropTypes.number,
  fill: PropTypes.number,
  strokeColor: PropTypes.number,
  strokeWidth: PropTypes.number,
  strokeAlignment: PropTypes.number,
};

export default Vertex;
