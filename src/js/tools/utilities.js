// /src/js/tools/utilities.js

    /**
     * Attempts to safely retrieve a nested property from a `source` object.
     * The `propString` determines the levels and names of properties, with the
     * names/levels delineatd by a period.
     * ex: The desired target object is `bar`, the parent/source object is foo
     *     var foo = {
     *         baz: {
     *            gaz: {}
     *                bar: 'bar'
     *            }
     *         }
     *     }
     *     property(foo, 'baz.gaz.bar');
     *     > 'bar'
     *
     * @param source {object}
     * @param keys {(string|Array)}
     * @param {*} fallback
     * @return {*}
     */
export const property = (source, keys, fallback) => {
    keys = typeof keys === 'string' ? keys.split('.') : Array.isArray(keys) ? keys : [];
    return keys.length ? keys.reduce((obj, key) => obj && obj[key] ? obj[key] : fallback, source) : fallback;
};

export default {
    property,
};
