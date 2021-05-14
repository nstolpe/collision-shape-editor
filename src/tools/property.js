// tools/property.js

/**
 * Returns a property map string or array ('foo.bar.baz' or ['foo', 'bar', 'baz'])
 *
 * @param map {string}        The map
 * @param delimiter {string}  The delimiter for the map, if the map is a string
 * @param asString {boolean}  Should the returned map be an array or string
 */
export const propertyMap = (map, { delimiter='.', asString=false }={}) => {
  if (asString) {
    switch (true) {
      case typeof map === 'string':
        return map;
      case Array.isArray(map):
        return map.join(delimiter);
      default:
        return String(map);
    }
  } else {
    switch (true) {
      case typeof map === 'string':
        return map.split(delimiter);
      case Array.isArray(map):
        return map;
      default:
        return [map];
    }
  }
};

/**
 * Attempts to safely retrieve a nested property from a `source` object.
 * The `map` argument is a `delimiter` separated string or an array. The
 * segments in either are sequentially more specific properties nested in
 * `source`.
 * ex: The desired target object is `bar`, the parent/source object is foo
 *   var foo = {
 *     baz: {
 *       gaz: {}
 *         bar: 'bar'
 *       }
 *     }
 *   }
 *   property(foo, 'baz.gaz.bar');
 *   > 'bar'
 *
 * @param source {object}
 * @param map {(string|Array)}  delimited string (delimits with `delimiter`) of nodes leading
 *                              from the `source` object to the desired final node.
 * @param {*} fallback          fallback value if the node does not have the final property/node.
 * @param {string} delimiter    string delimiter used when `map` is a string.
 * @return {*}
 */
export const property = (source, map, fallback, delimiter='.') => {
  const keys = propertyMap(map, { delimiter });
  return keys.length ? keys.reduce(
    (obj, key) => obj && Object.hasOwnProperty.call(obj, key) ? obj[key] : fallback, source
  ) : fallback;
};

/**
 * Returns an object of properties from another object. `source` must be an object.
 * `maps` must be an array of maps, each map either a
 *
 * ex:
 *   const g = {
 *     x: {
 *       a: {
 *         b: 'c',
 *       },
 *     },
 *     y: {
 *       t: [
 *         { g: 'f' },
 *         2,
 *         45,
 *       ]
 *     },
 *     z: {
 *       t: {
 *         p: [
 *           'foo',
 *           'bar',
 *           [
 *             2,
 *             7,
 *             9,
 *           ]
 *         ]
 *       }
 *     }
 *   }
 *
 *   properties(g, ['x.a.b', ['y', 't', 0, 'g'], 'z.t.p.2.2', { map: 'x.a.zoo', default: 1900 }])
 *   > {
 *       2: 9,
 *       b: 'c',
 *       g: 'f',
 *       zoo: 1900
 *     }
 *
 * @param {object} source       The source object.
 * @param {Array}  maps         An array of property maps.
 * @param {string} delimiter    The delimiter of the keys in map if it's a string.
 * @return {*}
 */
export const properties = (source, maps, fallback, delimiter='.') => {
  return Array.prototype.reduce.call(maps, (obj, map) => {
    let keys;

    switch (true) {
      case typeof map === 'string':
        keys = map.split(delimiter);
        break;
      case Array.isArray(map):
        keys = map;
        break;
      case typeof map === 'object':
        keys = propertyMap(map.map ?? [], { delimiter: map.delimiter ?? delimiter });
        break;
      default:
        keys = [String(map).split(delimiter)];
    }

    if (keys.length) {
      const lastKey = keys[keys.length - 1];

      obj[lastKey] = property(
        source,
        keys,
        map?.fallback ?? fallback
      );
    }

    return obj;
  }, {})
};
window.propertyMap = propertyMap;
window.property = property;
window.properties = properties;
