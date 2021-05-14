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

export const getKeyedValues = key => KeyedValues.get(key) ?? KeyedValues.set(key, Object.create(null)).get(key);
export const getKeys = key => Keys.get(key) ?? Keys.set(key, []).get(key);

const ListPrototype = Object.create({}, {
  // Array methods/properties
  concat: {
    value: function() {
      const { values } = this;
      return new List(...values.concat(...arguments));
    },
  },
  // copyWithin: {
  //   value: function() {
  //     /* @TODO implement this */
  //   },
  // },
  every: {
    value: function(callback) {
      const { values } = this;
      const keys = getKeys(this);

      return keys.every((key, index) => {
        const value = values[index];

        return callback(value, index, key, values);
      });
    },
  },
  fill: {
    value: function(value, start, end) {
      const keys = getKeys(this);
      const keyedValues = getKeyedValues(this);
      start = start ?? 0;
      end = end ?? keys.length;

      keys.forEach((key, index) => {
        if (index >= start && index < end) {
          keyedValues[key] = value;
        }
      });

      return this.values;
    },
  },
  filter: {
    value: function(callback) {
      const keyedValues = getKeyedValues(this);
      const keys = getKeys(this);
      const filteredKeys = keys.filter((key, index) => {
        const value = keyedValues[key];
        return callback(value, index, key, this.values);
      });

      return new List(...filteredKeys.map(key => keyedValues[key]));
    },
  },
  find: {
    value: function(callback) {
      const { values } = this;
      const keys = getKeys(this);

      const key = keys.find((currentKey, index) => {
        const value = values[index];
        return callback(value, index, currentKey, values);
      });

      return getKeyedValues(this)[key];
    },
  },
  findIndex: {
    value: function(callback) {
      const { values } = this;
      const keys = getKeys(this);

      return keys.findIndex((currentKey, idx) => {
        const value = values[idx];
        return callback(value, idx, currentKey, values);
      });
    },
  },
  forEach: {
    value: function(callback) {
      const { values } = this;
      const keys = getKeys(this);

      keys.forEach((key, index) => {
        const value = values[index];
        return callback(value, index, key, values);
      });
    },
  },
  includes: {
    value: function(value) {
      return this.indexOf(value) >= 0 ? true : false;
    },
  },
  indexOf: {
    value: function(value) {
      const keyedValues = getKeyedValues(this);
      const keys = getKeys(this);
      const [key] = Object.entries(keyedValues).find(([, currentValue]) => currentValue === value) || [];

      return keys.indexOf(key);
    },
  },
  lastIndexOf: {
    value: function(value) {
      const keyedValues = getKeyedValues(this);
      const keys = getKeys(this);
      const index = Object.entries(keyedValues).reduce((highestIndex, [key, currentValue]) => {
        if (currentValue === value) {
          const currentIndex = keys.indexOf(key)
          return currentIndex;
        }

        return highestIndex;
      }, -1);

      return index;
    },
  },
  length: {
    get() {
      return getKeys(this).length;
    },
  },
  map: {
    value: function(callback) {
      const { values } = this;
      const keys = getKeys(this);

      return new List(
        ...keys.map((key, index) => {
          const value = values[index];

          return callback(value, index, key, values);
        })
      );
    },
  },
  pop: {
    value: function() {
      const keyedValues = getKeyedValues(this);
      const keys = getKeys(this);
      const key = keys.pop();
      const value = keyedValues[key];

      delete keyedValues[key];

      return value;
    },
  },
  push: {
    value: function(value) {
      const keyedValues = getKeyedValues(this);
      const keys = getKeys(this);
      const key = uuid();

      keys.push(key);
      keyedValues[key] = value;

      return key;
    },
  },
  reduce: {
    value: function(callback, accumulator) {
      const { values } = this;
      const keys = getKeys(this);

      return keys.reduce((currentAccumulator, key, index) => {
        const value = values[index];
        return callback(currentAccumulator, value, index, key, values);
      }, accumulator);
    },
  },
  reduceRight: {
    value: function(callback, accumulator) {
      const values = this.values.reverse();
      const keys = [...getKeys(this)].reverse();

      return keys.reduce((currentAccumulator, key, index) => {
        const value = values[index];
        return callback(currentAccumulator, value, index, key, values);
      }, accumulator);
    },
  },
  reverse: {
    value: function() {
      return this.values.reverse();
    },
  },
  shift: {
    value: function() {
      const keyedValues = getKeyedValues(this);
      const keys = getKeys(this);
      const key = keys.shift();
      const value = keyedValues[key];

      delete keyedValues[key];

      return value;
    },
  },
  slice: {
    value: function(start, end) {
      const { values } = this;
      return new List(...values.slice(start, end));
    },
  },
  some: {
    value: function(callback) {
      const { values } = this;
      const keys = getKeys(this);

      return keys.some((key, index) => {
        const value = values[index];

        return callback(value, index, key, [...values]);
      });
    },
  },
  sort: {
    value: function(comparator) {
      const { values } = this;
      const keys = getKeys(this);

      return values.sort(comparator);
    },
  },
  splice: {
    value: function(start, deleteCount, ...values) {
      const keys = getKeys(this);
      const keyedValues = getKeyedValues(this);

      const newKeys = values.map((value, index) => {
        const key = uniqueKey(keys);
        keyedValues[key] = value;

        return key;
      });

      return keys
        .splice(start, deleteCount, ...newKeys)
        .map(key => {
          const value = keyedValues[key];

          delete keyedValues[key];

          return value;
        });
    },
  },
  unshift: {
    value: function(value) {
      const keyedValues = getKeyedValues(this);
      const keys = getKeys(this);
      const key = uniqueKey(this);

      keys.unshift(key);
      keyedValues[key] = value;

      return this.length;
    },
  },
  // List methods
  /**
   * Deletes a key/value by the numerical index of the value. Values with higher
   * indices will have their indices decremented.
   */
  deleteByIndex: {
    value: function(index) {
      return this.splice(index, 1)[0];
    }
  },
  /* @TODO handle with proxy deleteHandler for strings/numbers that == an index*/
  /**
   * Deletes a key/value by the key
   */
  deleteByKey: {
    value: function(key) {
      const { keys } = this;
      const index = keys.indexOf(key);

      return this.deleteByIndex(index);
    }
  },
  /**
   * Deletes a key/value by value
   * @param {any} value  The value that should be deleted, along with its key
   */
  deleteByValue: {
    value: function(value) {
      const keys = getKeys(this);
      const keyedValues = getKeyedValues(this);
      const [key] = Object.entries(keyedValues).find(([,currentValue]) => currentValue === value);

      return this.deleteByKey(key);
    },
  },
  entries: {
    /**
     * iterator of sequential [index, key, value] arrays.
     */
    value: function*() {
      const keys = getKeys(this);
      const keyedValues = getKeyedValues(this);
      const data = keys.map((key, index) => {
        const value = keyedValues[key];
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
      const keys = getKeys(this);
      const keyedValues = getKeyedValues(this);
      let idx = 0;

      return {
        next: function () {
          return {
            value: keyedValues[keys[idx++]],
            done: (idx > keys.length)
          };
        }
      };
    }
  },
  toString: {
    value: function() {
      return this.values.toString();
    },
  },
  /* @TODO handle with proxy */
  index: {
    value: function(index) {
      const keys = getKeys(this);
      const keyedValues = getKeyedValues(this);
      const key = keys[index];

      return keyedValues[key];
    },
  },
  /* @TODO handle with proxy too: list[<key>] */
  // returns a value by key instead of index.
  // Do not remove in favor of proxy, both should exist
  key: {
    value: function(key) {
      const keyedValues = getKeyedValues(this);

      return keyedValues[key];
    }
  },
  insert: {
    /**
     * Inserts a new entry at `index`. If `index` is already set, it and all subsequent values will
     * see their `index` value rise by 1. Shortcut to `List.prototype.splice(index, 0, value)` that
     * returns the object property for the new value.
     *
     * @param {any}     value  The value to be stored in the list
     * @param {number}  index  The index to store the value
     * @return {string} key    The key to access the value as a property instead of array index
     */
    value: function(value, index) {
      const keyedValues = getKeyedValues(this);
      this.splice(index, 0, value);

      return Object.entries(keyedValues).reduce(
        (result, [currentKey, currentValue], currentIndex) => value === currentValue ? currentKey : result
      );
    },
  },

  /**
   * Removes all values and keysfrom List and replaces them with new ones.
   */
  init: {
    value: function (...values) {
      const keys = getKeys(this);
      const keyedValues = getKeyedValues(this);
      keys.forEach(key => delete keyedValues[key]);
      keys.length = 0;

      // handle a single source array or iterator
      if (
        values.length === 1 &&
        typeof values[0] !== 'string' &&
        (
          Array.isArray(values[0]) ||
          Array.from(values[0] ??
          ''
        ).length
      )) {
        const newValues = Array.from(values[0]);
        keys.splice(0, 0, ...newValues.map(() => uuid()));

        newValues.forEach((value, index) => {
          const key = keys[index];
          keyedValues[key] = value;
        });
      // handle the rest
      } else {
        const newValues = Array.from(values);
        keys.splice(0, 0, ...newValues.map(() => uuid()));

        newValues.forEach((value, index) => {
          const key = keys[index];
          keyedValues[key] = value;
        });
      }

      return this.values;
    },
  },
});

export const arrayAccessHandler = {
  get: function(target, prop) {
//     if (Number.isInteger(+prop?.toString()) && prop >= 0 && prop <= Number.MAX_SAFE_INTEGER) {
//         return Reflect.get(target, 'values', target)[prop];
//     }
//
//     return Reflect.get(target, prop, target);
     switch (true) {
       // without bind, functions were being called with the proxy as `this`
       case typeof target[prop] === 'function':
         return target[prop].bind(target);
       // String or Number ('10' or 10) that's 0 or greater
       case Number.isInteger(+prop?.toString()) && prop >= 0 && prop <= Number.MAX_SAFE_INTEGER:
         return target.values[prop];
       default:
         return target[prop];
     }
  },
  set: (target, prop, value) => {
    if (Number.isInteger(+prop?.toString()) && prop >= 0 && prop <= Number.MAX_SAFE_INTEGER) {
      const keys = getKeys(target);
      const keyedValues = getKeyedValues(target);

      if (keys.hasOwnProperty(prop)) {
        keyedValues[keys[prop]] = value;
      } else {
        const key = uniqueKey(keys);
        keys[prop] = key;
        keyedValues[key] = value;
      }

      return true;
    }
    return false;
  }
};


/**
 * Factory
 */
export const createList = (...values) => {
  const instance = Object.create(ListPrototype);
  instance.init(values);

  return instance;
};

/**
 * Factory for Proxy's that allow array access
 */
export const createArrayAccessList = (...values) => {
  const instance = Object.create(ListPrototype);
  instance.init(values);

  return new Proxy(instance, arrayAccessHandler);
};

/**
 * Constructor
 */
const List = function(...values) {
  if (!new.target) {
    return new List(...values);
  }
  this.init(values);
};

List.prototype = ListPrototype;
window.List = List;
window.createList = createList;
window.createArrayAccessList = createArrayAccessList;
export default List;
