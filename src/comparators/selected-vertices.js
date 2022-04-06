// src/comparators/selected-vertices.js
// selectedVertices = {
//   <uuid-0>: { x, y },
//   <uuid-2>: { x, y },
//   <uuid-1>: { x, y },
// }
const comparator = (selectedVertices, oldSelectedVertices) => {
  const selectedVerticesEntries = Object.entries(selectedVertices);

  if (selectedVerticesEntries.length !== Object.keys(oldSelectedVertices).length) {
    return false;
  }

  for (const [key, vertex1] of selectedVerticesEntries) {
    const vertex2 = oldSelectedVertices[key];

    if (!vertex2 || vertex1.x !== vertex2.x || vertex1.y !== vertex2.y) {
      return false;
    }
  }

  return true;
};

export default comparator;
