// src/tools/combine-reducers.js

/**
 * Combines reducers. Will pass entire state to each reducer in `reducers`.
 *
 * Base on:
 * https://codezup.com/how-to-combine-multiple-reducers-in-react-hooks-usereducer/
 *
 */
const combineReducers = (...reducers) => (inState, action) => reducers.reduce(
  (outState, reducer) => (reducer(outState, action)),
  inState
);

export default combineReducers;
