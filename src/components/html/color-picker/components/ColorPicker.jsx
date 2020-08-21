// src/js/components/html/color-picker/components/ColorPicker.jsx
import PropTypes from 'prop-types';
import React, {
  useEffect,
  useState,
} from 'react';
import chroma from 'chroma-js';

import ContentWrapper from 'components/html/color-picker/components/ContentWrapper';
import Modal from 'components/html/color-picker/components/Modal';
import Store, { setActiveColor, StoreContext } from 'components/html/color-picker/store/Store';
import ColorInputs from 'components/html/color-picker/components/ColorInputs';
import Trigger from 'components/html/color-picker/components/Trigger';
import InitializeWrapper from 'components/html/color-picker/components/InitializeWrapper';
import HueCanvas from 'components/html/color-picker/components/HueCanvas';
import SaturationValueCanvas from 'components/html/color-picker/components/SaturationValueCanvas';

const ColorPicker = ({
  modalContainerElement,
  initialColor,
  padWidth,
  padHeight,
  slideWidth,
  slideHeight,
  title,
  titleFontFamily,
  onColorChange,
}) => {
  return (
    <Store>
      <InitializeWrapper initialColor={initialColor}>
        <Trigger
          title={title}
        />
        {modalContainerElement &&
          <Modal
            container={modalContainerElement}
            title={title}
            titleFontFamily={titleFontFamily}
          >
            <ContentWrapper>
              <SaturationValueCanvas
                width={padWidth}
                height={padHeight}
                onColorChange={onColorChange}
              />
              <HueCanvas
                width={slideWidth}
                height={slideHeight}
                onColorChange={onColorChange}
              />
              <ColorInputs />
            </ContentWrapper>
          </Modal>
        }
      </InitializeWrapper>
    </Store>
  );
};

ColorPicker.defaultProps = {
  modalContainerElement: document.body,
  color: 0xff0000,
  padWidth: 256,
  padHeight: 256,
  slideWidth: 48,
  slideHeight: 256,
  title: 'Color Picker',
  titleFontFamily: 'sans-serif',
  valueFontFamily: 'sans-serif',
  onColorChange: ({ r, g, b }) => ({ r, g, b }),
};

ColorPicker.propTypes = {
  modalContainerElement: PropTypes.object,
  color: PropTypes.number,
  padWidth: PropTypes.number,
  padHeight: PropTypes.number,
  slideWidth: PropTypes.number,
  slideHeight: PropTypes.number,
  title: PropTypes.string,
  titleFontFamily: PropTypes.string,
  valueFontFamily: PropTypes.string,
  onColorChange: PropTypes.func,
};

export default ColorPicker;
