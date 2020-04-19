// tools/utilities.js

export const propertyMap = (map, { delimiter='.', asString=false }={}) => {
  return asString ? (
    typeof map === 'string' ? map :
      Array.isArray(map) ? map.join(delimiter) :
      String(map)
  ) : (
    typeof map === 'string' ? map.split(delimiter) :
      Array.isArray(map) ? map :
      [map]
  );
}
/**
 * Attempts to safely retrieve a nested property from a `source` object.
 * The `propString` determines the levels and names of properties, with the
 * names/levels delineatd by a period.
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
    (obj, key) => obj && key in Object(obj) ? obj[key] : fallback, source
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
 * @param {(string|Array)} map  The map of keys to the final object
 * @param {string} delimiter    The delimiter of the keys in map if it's a string.
 * @return {*}
 */
export const properties = (source, maps, fallback, delimiter='.') => (
  maps.reduce((obj, map) => {
    const keys = typeof map === 'string' ? map.split(delimiter) :
       Array.isArray(map) ? map :
       typeof map === 'object' ? propertyMap(
         map.map || [],
         { delimiter: map.delimiter || delimiter },
       ) :
       [];

    if (keys.length) {
      const lastKey = keys[keys.length - 1];

      obj[lastKey] = property(
        source,
        keys,
        property(map, 'fallback', fallback),
      );
    }

    return obj;
  }, {})
);

export default {
  properties,
  property,
  propertyMap,
};
