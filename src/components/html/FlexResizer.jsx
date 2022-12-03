// src/js/components/html/FlexResizer.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import throttle from 'Utility/throttle';

const FlexWrapper = styled.div`
  flex: 1;
  overflow: hidden;
`;

// Resizes on window.resize, stores its width and height, sends them as render props.
class FlexResizer extends React.Component {
  ref = React.createRef();

  state = {
    height: 0,
    width: 0,
  };

  resize = () => {
    const height = this.ref.current?.offsetHeight ?? 0;
    const width = this.ref.current?.offsetWidth ?? 0;
    this.setState({ height, width });
  };

  throttledResize = throttle(this.resize, 50);

  componentDidMount() {
    window.addEventListener('resize', this.throttledResize);
    this.resize(this.ref.current);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.throttledResize);
  }

  render() {
    const { children } = this.props;
    const { height, width } = this.state;

    return (
      <FlexWrapper ref={this.ref}>{children?.({ height, width })}</FlexWrapper>
    );
  }
}

FlexResizer.propTypes = {
  children: PropTypes.func,
};

export default FlexResizer;
