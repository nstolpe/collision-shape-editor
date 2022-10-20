/**
 * Finds and returns the ancestor of a Pixi component
 * that has the name equal to the `name` constant.
 * Or returns `null`.
 */
export const findAncestorByName = (name, child) => {
  let parent = null;

  while (!parent && child != null) {
    if (child && child.name == name) {
      parent = child;
      child = null;
    }

    if (child && child.parent) {
      if (child.parent.name === name) {
        parent = child.parent;
        child = null;
      } else {
        child = child.parent;
      }
    } else {
      child = null;
    }
  }

  return parent;
};

const VIEWPORT = 'VIEWPORT';

export const findAncestorViewport = (child) => findAncestorByName(VIEWPORT, child);
