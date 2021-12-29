// src/comparators/vertices.js
const comparator = (vertices, oldVertices) => {
  if (vertices?.length !== oldVertices?.length) {
    return false;
  }

  for (let i = 0, l = vertices?.length; i < l; i++) {
    const vertex = vertices.index(i);
    const oldVertex = oldVertices.index(i);

    if (
      vertex.name !== oldVertex.name ||
      vertex.x !== oldVertex.x ||
      vertex.y !== oldVertex.y
    ) {
      return false;
    }
  }

  return true;
};

export default comparator;
