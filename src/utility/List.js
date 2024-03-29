import { v4 as uuid } from 'uuid';

export const uniqueKey = (keys) => {
  let key = uuid();

  while (keys.includes(key)) {
    key = uuid();
  }

  return key;
};

const Keys = new WeakMap();
const KeyedValues = new WeakMap();

export const getValues = (key) =>
  KeyedValues.get(key) ?? KeyedValues.set(key, Object.create(null)).get(key);
export const getKeys = (key) => Keys.get(key) ?? Keys.set(key, []).get(key);

// const merge = (a, b) => {
//   const length = Math.max(a.length, b.length);
//   const keys = [];
//
//   for (let i = 0; i < length; i++) {
//     keys[i] = b[i] ?? a[i];
//   }
//   return keys;
// };

const assign = (...sources) => {
  const maxSourceLength = Math.max(
    ...sources.map((source) => source?.length ?? 0)
  );
  const sourcesLength = sources?.length ?? 0;
  const baseSource = sources?.[0] ?? [];

  for (let i = 1; i < sourcesLength; i++) {
    const currentSource = sources?.[i] ?? [];

    for (let ii = 0; ii < maxSourceLength; ii++) {
      baseSource[ii] = currentSource[ii] ?? baseSource[ii];
    }
  }

  return baseSource;
};

const ListPrototype = Object.create(
  {},
  {
    // Array methods/properties
    concat: {
      value: function () {
        const { keys, values } = this;
        return new List(values.concat(...arguments), keys);
      },
    },
    // copyWithin: {
    //   value: function() {
    //     /* @TODO implement this */
    //   },
    // },
    every: {
      value: function (callback) {
        const { keys, values } = this;

        return keys.every((key, index) => {
          const value = values[index];

          return callback(value, index, key, values);
        });
      },
    },
    fill: {
      value: function (value, start, end) {
        const { keys } = this;
        const instanceValues = getValues(this);

        start = start ?? 0;
        end = end ?? keys.length;

        keys.forEach((key, index) => {
          if (index >= start && index < end) {
            instanceValues[key] = value;
          }
        });

        return this.values;
      },
    },
    filter: {
      value: function (callback) {
        const { keys, values } = this;

        const filteredKeys = keys.filter((key, index) => {
          const value = values[index];
          return callback(value, index, key, values);
        });

        return new List(
          filteredKeys.map((key, index) => this.key(key)),
          filteredKeys
        );
      },
    },
    find: {
      value: function (callback) {
        const { keys, values } = this;

        const key = keys.find((currentKey, index) => {
          const value = values[index];
          return callback(value, index, currentKey, values);
        });

        return getValues(this)[key];
      },
    },
    findIndex: {
      value: function (callback) {
        const { keys, values } = this;

        return keys.findIndex((currentKey, idx) => {
          const value = values[idx];
          return callback(value, idx, currentKey, values);
        });
      },
    },
    forEach: {
      value: function (callback) {
        const { keys, values } = this;

        keys.forEach((key, index) => {
          const value = values[index];
          return callback(value, index, key, values);
        });
      },
    },
    includes: {
      value: function (value) {
        return this.indexOf(value) >= 0 ? true : false;
      },
    },
    /**
     * Returns `values` numeric index of the Lists's backing values array if `value` is a member.
     * Returns -1 if the index is not found.
     */
    indexOf: {
      value: function (value) {
        const { values } = this;

        return values.indexOf(value);
      },
    },
    /**
     * Returns `keys` numeric index of the List's backing keys array if `key` is a member.
     */
    indexOfKey: {
      value: function (key) {
        const { keys } = this;

        return keys.indexOf(key);
      },
    },
    lastIndexOf: {
      value: function (value) {
        const { values } = this;
        return values.lastIndexOf(value);
      },
    },
    length: {
      get() {
        return getKeys(this).length;
      },
    },
    map: {
      /**
       * Takes `keys` optional arg so `List` can accept an arg for them
       */
      value: function (callback, keys = []) {
        const { keys: instanceKeys, values: instanceValues } = this;

        return new List(
          instanceKeys.map((instanceKey, index) => {
            const value = instanceValues[index];

            return callback(value, index, instanceKey, instanceValues);
          }),
          assign(instanceKeys, keys)
        );
      },
    },
    pop: {
      value: function () {
        const instanceValues = getValues(this);
        const instanceKeys = getKeys(this);
        const key = instanceKeys.pop();
        const value = instanceValues[key];

        return List([value], [key]);
      },
    },
    push: {
      /* @TODO let it take a key too*/
      value: function (value, key) {
        const instanceValues = getValues(this);
        const instanceKeys = getKeys(this);
        const actualKey = key ?? uuid();
        const index = instanceKeys.push(actualKey);

        instanceValues[actualKey] = value;

        return index;
      },
    },
    reduce: {
      value: function (callback, accumulator) {
        const { keys, values } = this;

        return keys.reduce((currentAccumulator, key, index) => {
          const value = values[index];
          return callback(currentAccumulator, value, index, key, values);
        }, accumulator);
      },
    },
    reduceRight: {
      value: function (callback, accumulator) {
        const values = this.values.reverse();
        const keys = this.keys.reverse();

        return keys.reduce((currentAccumulator, key, index) => {
          const value = values[index];
          return callback(currentAccumulator, value, index, key, values);
        }, accumulator);
      },
    },
    reverse: {
      value: function () {
        return new List(this.values.reverse(), this.keys.reverse());
      },
    },
    shift: {
      value: function () {
        const instanceValues = getValues(this);
        const instanceKeys = getKeys(this);
        const key = instanceKeys[0];
        const value = instanceValues[key];

        return List([value], [key]);
      },
    },
    slice: {
      value: function (start, end) {
        const { keys, values } = this;
        /* @TODO persist keys */
        return new List(values.slice(start, end), keys.slice(start, end));
      },
    },
    some: {
      value: function (callback) {
        const { keys, values } = this;

        return keys.some((key, index) => {
          const value = values[index];
          return callback(value, index, key, [...values]);
        });
      },
    },
    sort: {
      /**
       * Returns a new list sorted by a value comparator
       * @TODO add a sory-by-key method?
       */
      value: function (comparator) {
        const { keys, values } = this;
        const sortedValues = values.slice().sort(comparator);
        const sortedKeys = sortedValues.map(
          (value) => keys[values.indexOf(value)]
        );

        return new List(sortedValues, sortedKeys);
      },
    },
    splice: {
      /**
       * Splices at an index, like Array.prototype.splice. It returns a new List though.
       * The `newKeys` argument allows for an array of new keys to be passed
       *
       * @param {number} options.start
       * @param {number} options.deleteCount
       * @param {array}  options.newKeys
       * @param {...any} newValues
       */
      value: function (options = {}, ...newValues) {
        // const { start=0, deleteCount=0, newKeys=[] } = options ?? {};
        const start = options?.start ?? 0;
        const deleteCount = options?.deleteCount ?? 0;
        const newKeys = options?.newKeys ? Array.from(options.newKeys) : [];
        const { keys, values } = this;

        for (let i = 0, l = newValues.length; i < l; i++) {
          newKeys[i] = newKeys[i] ?? uniqueKey([...keys, ...newKeys]);
        }

        values.splice(start, deleteCount, ...newValues);
        keys.splice(start, deleteCount, ...newKeys);

        return new List(values, keys);
      },
    },
    unshift: {
      value: function (value) {
        const instanceValues = getValues(this);
        const instanceKeys = getKeys(this);
        const key = uniqueKey(this);

        instanceKeys.unshift(key);
        instanceValues[key] = value;

        return this.length;
      },
    },
    // List methods
    /**
     * Returns the List's key if value is one of the List's values.
     */
    keyOf: {
      value: function (value) {
        const { values, keys } = this;
        const index = values.indexOf(value);

        return keys[index];
      },
    },
    /**
     * Returns the List's key if key is one of the List's numberic indices.
     */
    keyOfIndex: {
      value: function (index) {
        const { keys } = this;
        return keys[index];
      },
    },
    /**
     * Returns a new List with newValues appeneded to the existing values.
     */
    append: {
      value: function (newKeys = [], ...newValues) {
        return this.splice({ newKeys, start: this.length }, ...newValues);
      },
    },
    /**
     * Returns a new List with newValues prepended to the existing values.
     */
    prepend: {
      value: function (newKeys = [], ...newValues) {
        return this.splice({ newKeys }, ...newValues);
      },
    },
    /**
     * Deletes a key/value by the numerical index of the value. Values with higher
     * indices will have their indices decremented.
     */
    deleteByIndex: {
      value: function (index) {
        return this.splice({ start: index, deleteCount: 1 })[0];
      },
    },
    /* @TODO handle with proxy deleteHandler for strings/numbers that == an index*/
    /**
     * Deletes a key/value by the key
     */
    deleteByKey: {
      value: function (key) {
        const { keys } = this;
        const index = keys.indexOf(key);

        return this.deleteByIndex(index);
      },
    },
    /**
     * Deletes a key/value by value
     * @param {any} value  The value that should be deleted, along with its key
     */
    deleteByValue: {
      value: function (value) {
        const values = getValues(this);
        const [key] = Object.entries(values).find(
          ([, currentValue]) => currentValue === value
        );

        return this.deleteByKey(key);
      },
    },
    entries: {
      /**
       * iterator of sequential [index, key, value] arrays.
       */
      value: function* () {
        const keys = getKeys(this);
        const values = getValues(this);
        const data = keys.map((key, index) => {
          const value = values[key];
          return [index, key, value];
        });
        let index = 0;

        while (index < data.length) {
          yield data[index++];
        }
      },
    },
    keys: {
      /**
       * returns all keys for values in this List. Not an iterator like Array.prototype.keys
       */
      get() {
        return [...getKeys(this)];
      },
    },
    values: {
      /**
       * returns all values of the List in sequential order.
       */
      get() {
        return Array.from(this);
      },
    },
    [Symbol.iterator]: {
      enumerable: false,
      writable: false,
      configurable: true,
      value: function () {
        const instanceKeys = getKeys(this);
        const instanceValues = getValues(this);
        let idx = 0;

        return {
          next: function () {
            return {
              value: instanceValues[instanceKeys[idx++]],
              done: idx > instanceKeys.length,
            };
          },
        };
      },
    },
    toString: {
      value: function () {
        return this.values.toString();
      },
    },
    /**
     * Gets a value by its index.
     */
    index: {
      value: function (index) {
        const key = this.keys[index];
        const { [key]: value } = getValues(this);

        return value;
      },
    },
    /**
     * Gets the value at index 0.
     */
    first: {
      get() {
        return this.index(0);
      },
    },
    /**
     * Gets the value at the last index.
     */
    last: {
      get() {
        return this.index(this.length - 1);
      },
    },
    /* @TODO handle with proxy too: list[<key>] */
    // returns a value by key instead of index.
    // Do not remove in favor of proxy, both should exist
    key: {
      value: function (key) {
        const instanceValues = getValues(this);
        return instanceValues[key];
      },
    },
    setByKey: {
      value: function (value, key) {
        const { values, keys } = this;

        if (keys.includes(key)) {
          values[keys.indexOf(key)] = value;
        } else {
          keys.push(key);
          values[keys.indexOf(key)] = value;
        }

        return new List(values, keys);
      },
    },
    setByIndex: {
      // @TODO update this to return a new instance like setByKey
      value: function (value, index) {
        const instanceValues = getValues(this);
        const instanceKeys = getKeys(this);

        if (instanceKeys.hasOwnProperty(index)) {
          instanceValues[instanceKeys[index]] = value;
        } else {
          const key = uniqueKey(instanceKeys);
          instanceKeys[index] = key;
          instanceValues[key] = value;
        }
      },
    },
    insert: {
      /**
       * Inserts a new entry at `index`. If `index` is already set, it and all subsequent values will
       * see their `index` value rise by 1.
       *
       * @param {any}     value  The value to be stored in the list
       * @param {number}  index  The index to store the value
       * @return {List}   A new List with the inserted value
       *
       * @TODO probably should check for duplicate keys. Also, this test is broken.
       */
      value: function (value, index, key) {
        const { keys, values } = this;

        key = key ?? uniqueKey(keys);

        // should this be checking the index/key combination? or maybe index/key/value?
        // or should any combination overwrite what's there?
        if (keys.includes(key)) {
          throw new Error(`key ${key} already exists`);
        }

        values.splice(index, 0, value);
        keys.splice(key, 0, key);

        return new List(values, keys);
      },
    },
    /**
     * Removes all values and keysfrom List and replaces them with new ones.
     */
    init: {
      value: function (values, keys) {
        if (List.prototype.isPrototypeOf(values)) {
          return this.init(
            values.values,
            Array.isArray(keys) ? keys : values.keys
          );
        }

        const instanceKeys = getKeys(this);
        const instanceValues = getValues(this);

        // clear out existing keys and values
        instanceKeys.forEach((key) => delete instanceValues[key]);
        instanceKeys.length = 0;

        values.forEach((value, index) => {
          const key = keys?.[index] ?? uuid();
          instanceKeys.push(key);
          instanceValues[key] = value;
        });

        return this.values;
      },
    },
  }
);

export const arrayAccessHandler = {
  get: function (target, prop) {
    switch (true) {
      // without bind, functions will be called with the proxy as `this`
      case typeof target[prop] === 'function':
        return target[prop].bind(target);
      // String or Number ('10' or 10) that's 0 or greater. handle like this was an array
      case Number.isInteger(+prop?.toString()) &&
        prop >= 0 &&
        prop <= Number.MAX_SAFE_INTEGER:
        return target.values[prop];
      default:
        return target[prop];
    }
  },
  set: (target, prop, value) => {
    if (
      Number.isInteger(+prop?.toString()) &&
      prop >= 0 &&
      prop <= Number.MAX_SAFE_INTEGER
    ) {
      const instanceKeys = getKeys(target);
      const instanceValues = getValues(target);

      if (instanceKeys.hasOwnProperty(prop)) {
        instanceValues[instanceKeys[prop]] = value;
      } else {
        const key = uniqueKey(instanceKeys);
        instanceKeys[prop] = key;
        instanceValues[key] = value;
      }

      return true;
    }
    return false;
  },
};

/**
 * Factory
 */
export const createList = (values, keys) => {
  const instance = Object.create(ListPrototype);
  instance.init(values, keys);

  return instance;
};

/**
 * Factory for Proxy's that allow array access
 */
export const createArrayAccessList = (values, keys) => {
  const instance = Object.create(ListPrototype);
  instance.init(values, keys);

  return new Proxy(instance, arrayAccessHandler);
};

/**
 * Constructor
 */
const List = function (values = [], keys = []) {
  if (!new.target) {
    return new List(values, keys);
  }
  this.init(values, keys);
};

List.prototype = ListPrototype;
window.List = List;
window.createList = createList;
window.createArrayAccessList = createArrayAccessList;
export default List;
