// src/js/components/ConnectedViewport.js
import { connect } from "react-redux";

import store from 'App/store/store';
import Viewport from 'App/components/Viewport';

const mapStateToProps = state => ({ ...state });
const mapDispatchToProps = dispatch => ({ addVertex: ({ x, y }) => dispatch(addVertex({ x, y })) });
const ConnectedViewport = () => {
    return (<Viewport />)
};
export default connect(mapStateToProps)(ConnectedViewport);
