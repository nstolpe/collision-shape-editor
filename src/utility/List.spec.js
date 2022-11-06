import List, {
  uniqueKey,
  getKeys,
  getKeyedValues,
  createList,
  createArrayAccessList,
  arrayAccessHandler,
} from 'Utility/List';
import { v4 as uuid } from 'uuid';


jest.mock('uuid', () => {
  const mod = jest.requireActual('uuid');
  return {
    ...mod,
    v4: jest.fn(),
  };
});

const mockSet = jest.fn();
const mockGet = jest.fn();
const MockWeakMap = function() {
  this.keys = [];
  this.values = [];
};

MockWeakMap.prototype.set = function(key, value) {
  this.keys.push(key);
  this.values.push(values);
  return this;
};

MockWeakMap.prototype.get = function(key) {
  return this.values[keys.indexOf(key)];
};

const mockUuid = () => {
  uuid.mockImplementation(() => `${Math.random() * Date.now()}`)
};

describe('List.js --', () => {
  describe('`uniqueKey()`', () => {
    it('retrieves a new key until one is found that isn\'t in `keys`', () => {
      const keys = ['11111', '22222', '33333', '44444', '55555'];
      keys.forEach(key => uuid.mockReturnValueOnce(key));
      uuid.mockReturnValueOnce('XXXXX');
      const key = uniqueKey(keys);
      expect(key).toEqual('XXXXX');
      expect(uuid).toHaveBeenCalledTimes(keys.length + 1);
    });
  });

  describe('`getKeys()`', () => {
    // jest.spyOn(window, 'WeakMap').mockImplementation(MockWeakMap)
    const context = {};
  });

  describe('`List()`', () => {
    beforeEach(mockUuid);

    it('`concat()` will return a new list comprised the original list entries and the new entries', () => {
      const values1 = [1, 2, 3];
      const values2 = [4, 5, 6];
      const list1 = new List(...values1);
      const list2 = list1.concat(...values2);
      expect(list2.length).toEqual(values1.length + values2.length);
      expect(list2.values).toEqual([...list1.values, ...values2]);
    });


    it(
      '`every()` will return `true` if all of the List\'s values pass the test and `false` if' +
      ' any of the `List`\'s values don\'t pass the test.',
      () => {
        const values = [1, 2, 3, 4, 5];
        const list = List(...values);
        const callbackTrue = jest.fn(val => val <= 5);
        const callbackFalse = jest.fn(val => val <= 2);
        expect(list.every(callbackTrue)).toBe(true);
        expect(list.every(callbackFalse)).toBe(false);
      }
    );

    describe('`fill()`', () => {
      it('will replace a `List`\'s values from `start` to `end` with `value`.', () => {
        const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const list = List(...values);
        const start = 2;
        const end = 5;

        list.fill(null, start, end)

        expect(list.values).toEqual(values.fill(null, start, end))
      });

      it('will replace all of a `List`\'s values with `value` if `start` and `end` are not passed', () => {
        const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const list = List(...values);

        list.fill(null)

        expect(list.values).toEqual(values.fill(null))
      });
    });

    it('`filter()` will return a new `List` that contain only the original `List`\'s values that passed the test.', () => {
      const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      const list = List(...values);
      const filter = value => value % 2 === 0;

      expect(list.filter(filter).values).toEqual(values.filter(filter));
    });

    it('`find()` will return the first value, if any, from a `List` that passes the test.', () => {
      const values = [{ foo: 'boo' },{ foo: 'bar' }, { foo: 'baz' }];
      const list = List(...values);
      const value = 'bar';
      const filter = ({ foo }) => foo === value;

      expect(list.find(filter)).toEqual(values.find(filter));
    });

    it('`findIndex()` will return the first index of a `List` that stores a value', () => {
      const values = [{ foo: 'boo' },{ foo: 'bar' }, { foo: 'baz' }];
      const list = List(...values);
      const index = 1;
      const value = values[index].foo;
      const filter = ({ foo }) => foo === value;

      expect(list.findIndex(filter)).toEqual(values.findIndex(filter));
    });

    it('`forEach()` will call `callback` on each value of a `List`', () => {
        const values = [1, 2, 3, 4, 5];
        const list = List(...values);
        let total = 0;
        const callback = jest.fn(val => total += val);
        list.forEach(callback);
        expect(callback).toHaveBeenCalledTimes(5);
        expect(callback).toHaveBeenNthCalledWith(1, 1, 0, list.keys[0], values);
        expect(callback).toHaveBeenNthCalledWith(2, 2, 1, list.keys[1], values);
        expect(callback).toHaveBeenNthCalledWith(3, 3, 2, list.keys[2], values);
        expect(callback).toHaveBeenNthCalledWith(4, 4, 3, list.keys[3], values);
        expect(callback).toHaveBeenNthCalledWith(5, 5, 4, list.keys[4], values);
        expect(total).toEqual(values.reduce((acc, curr) => acc + curr, 0));
    });

    it('`includes()` will return `true` if a `List` contains `value` and `false` if it doesn\'t contain `value`.', () => {
        const values = [1, 2, 3, 4, 5];
        const list = List(...values);

        expect(list.includes(1)).toEqual(values.includes(1));
        expect(list.includes(23)).toEqual(values.includes(23));
    });

    it('`indexOf()` returns the first index of `value` if a `List` contains `value` and -1 if not.', () => {
        const values = [1, 2, 3, 4, 5];
        const list = List(...values);

        expect(list.indexOf(1)).toEqual(values.indexOf(1));
        expect(list.indexOf(23)).toEqual(values.indexOf(23));
    });

    it('`lastIndexOf()` returns the last index of `value` if a `List` contains `value` and -1 if not.', () => {
        const values = [1, 2, 3, 4, 5, 1, 2];
        const list = List(...values);

        expect(list.lastIndexOf(1)).toEqual(values.lastIndexOf(1));
        expect(list.lastIndexOf(23)).toEqual(values.lastIndexOf(23));
    });

    it('`length` will return the length of a `List`\'s values', () => {
        const values = [1, 2, 3, 4, 5, 1];
        const list = List(...values);

        expect(list.length).toEqual(values.length);
        list.pop();
        expect(list.length).toEqual(values.length - 1);
    });

    it('`map()` will return a new list with values derived from the original', () => {
      const values = [1, 2, 3, 4, 5];
      const list = List(...values);
      const callback = jest.fn(val => val + 1);
      const list2 = list.map(callback);
      expect(list2.values).toEqual(values.map(val => val + 1));
    });

    it('`pop()` will remove the last value from a `List` and return the value', () => {
      const values = [1, 2, 3, 4, 5];
      const list = List(...values);
      const val = list.pop();
      expect(val).toEqual(values.pop());
      expect(list.values).toEqual(values);
    });

    it('`push()` will append a new value to a `List`', () => {
      const value = 1;
      const list = List();
      list.push(value);
      expect(list.values).toEqual([value]);
    });

    it('`reduce()` will reduce a `List` to a new value', () => {
      const values = [1, 2, 3, 4, 5];
      const list = List(...values);
      expect(
        list.reduce((acc, value) => acc + value, 0)
      ).toEqual(
        values.reduce((acc, value) => acc + value, 0)
      );
    });

    it('`reduceRight()` will reduce a `List` to a new value starting from the right hand side', () => {
      const values = [1, 2, 3, 4, 5];
      const list = List(...values);
      expect(
        list.reduceRight((acc, value) => acc + value, 0)
      ).toEqual(
        values.reduceRight((acc, value) => acc + value, 0)
      );
    });

    it('`reverse()` will return a `List`s `values` in reverse order', () => {
      const values = [1, 2, 3, 4, 5];
      const list = List(...values);
      expect(list.reverse()).toEqual(values.reverse());
    });

    it('`shift()` will remove the first value from a `List` and return the value', () => {
      const values = [1, 2, 3, 4, 5];
      const list = List(...values);
      const val = list.shift();
      expect(val).toEqual(values.shift());
      expect(list.values).toEqual(values);
    });

    it('`slice()` will return a new `List` populated with values from `start` to `end`', () => {
      const values = [1, 2, 3, 4, 5];
      const list = List(...values);
      const list2 = list.slice(1, 4);
      expect(list2.values).toEqual(values.slice(1, 4));
    });

    describe('`some()`', () => {
      it('will return `true` if at least one value of `List` passes the test', () => {
        const values = [1, 2, 3, 4, 5];
        const list = List(...values);
        const callback = val => val >= 2;
        expect(list.some(callback)).toBe(true);
      });

      it('will return `false` if at none of `List`s values pass the test', () => {
        const values = [1, 2, 3, 4, 5];
        const list = List(...values);
        const callback = val => val > 5;
        expect(list.some(callback)).toBe(false);
      });
    });

    it('`sort()` will return a sorted `Array` of `List` values', () => {
      const values = [2, 1, 4, 5, 3];
      const list = List(...values);
      const comparator = (a, b) => a - b;
      expect(list.sort(comparator)).toEqual(values.sort(comparator))
    });

    it('`splice()` will add and remove values a `List`s values and return those that were removed', () => {
      const values = [1, 2, 3, 4, 5, 6];
      const newValues = ['a', 'b'];
      const list = List(...values);
      expect(list.splice(2, 2, ...newValues)).toEqual(values.splice(2, 2, ...newValues));
      expect(list.values).toEqual(values);
    });

    it('`ushift()` will prepend a value to a `List`', () => {
      const values = [1, 2, 3];
      const list = List(...values);
      const value = 0;
      expect(list.values).toEqual(values);
      list.unshift(value);
      values.unshift(value);
      expect(list.values).toEqual(values);
    });

    it('`deleteByIndex()` will remove a value by index and return the value', () => {
      const values = [1, 2, 3];
      const index = 1;
      const list = List(...values);

      expect(list.deleteByIndex(index)).toEqual(values[index]);
      values.splice(index, 1);
      expect(list.values).toEqual(values);
    });

    it('`deleteByKey()` will remove a value by it\'s key.', () => {
      const values = [1, 2, 3];
      const index = 1;
      const list = List(...values);
      const key = list.keys[index]

      expect(list.deleteByKey(key)).toEqual(values[index]);
      values.splice(index, 1);
      expect(list.values).toEqual(values);
    });

    it('`deleteByValue()` will remove a value by the value.', () => {
      const values = [{ a: 'a' }, { b: 'b' }, { c: 'c' }];
      const index = 1;
      const value = values[index];
      const list = List(...values);
      expect(list.deleteByValue(value)).toEqual(value);
    });

    it('`entries()` will return a function that iterates over all of a `List`\s values.', () => {
      const values = [{ a: 'a' }, { b: 'b' }, { c: 'c' }];
      const list = List(...values);

      for (const [idx, key, value] of list.entries()) {
        expect(key).toEqual(list.keys[idx]);
        expect(value).toEqual(values[idx]);
      }
    });

    it('`keys` will return a sequential array of a `List`\'s keys.', () => {
      const values = [1, 2, 3];
      const list = List(...values);

      list.keys.forEach((key, idx) => expect(list.key(key)).toEqual(values[idx]));
    });

    it('`values` will return a sqeuential set of a `List`\'s values.', () => {
      const values = [1, 2, 3];
      const list = List(...values);

      expect(list.values).toEqual(values);
    });

    it('`toString()` will return a `List`\'s values array as a string.', () => {
      const values = [1, 2, 3];
      const list = List(...values);

      expect(list.toString()).toEqual(values.toString());
    });

    it('`index()` will return a `List` value by index.', () => {
      const values = [1, 2, 3];
      const list = List(...values);
      const index = 1;

      expect(list.index(index)).toEqual(values[index]);
    });

    it('`key()` will return a `List` value by key.', () => {
      const values = [1, 2, 3, 4, 5, 6];
      const list = List(...values);
      const index = 2;
      const value = values[index];
      const key = list.keys[index];

      expect(list.key(key)).toEqual(value);
    });

    it('`insert()` will insert `value` into `List` at `index`.', () => {
      const values = [1, 2, 3, 4, 5, 6];
      const list = List(...values);
      const value = null;
      const index = 3;

      list.insert(value, index);
      values.splice(index, 0, value);

      expect(list.values).toEqual(values);
    });

    it('`init()` will repopulate a `List` with new `values` as multiple arguments or a single array-like or iterable value.', () => {
      const values1 = [1, 2, 3, 4, 5, 6];
      const values2 = ['a', 'b', 'c', 'd', 'e', 'f'];
      const values3 = 'string';
      const values4 = new Set(values1);
      const list = List();

      list.init(...values1)
      expect(list.values).toEqual(values1);
      list.init(values2);
      expect(list.values).toEqual(values2);
      list.init(values3);
      expect(list.values).toEqual([values3]);
      list.init(values4);
      expect(list.values).toEqual(values1);
      list.init(null);
      expect(list.values).toEqual([null]);
    });

    it('will return a new instance of List if called without `new`', () => {
      const list = List();
      expect(Object.getPrototypeOf(list)).toBe(List.prototype);
    });
  });

  describe('`createList()`', () => {
    beforeEach(mockUuid);

    it('will return a new instance of `List` populated with `values`', () => {
      const values = [1, 2, 3, 4, 5, 6];
      const list = createList(...values);
      expect(Object.getPrototypeOf(list)).toBe(List.prototype);
      expect(list.values).toEqual(values);
    });
  });

  describe('`createArrayAccessList()`', () => {
    beforeEach(mockUuid);

    it('does', () => {
      const values = [1, 2, 3, 4, 5, 6];
      const list = createArrayAccessList(...values);

      expect(list.values).toEqual(values);
    });
  });

  describe('`arrayAccessHandler`', () => {
    describe('`get()`', () => {
      it('will return a function that is bound to `target` if `target[prop]` is a function', () => {
        const target = {
          foo: jest.fn(),
        };
        const prop = 'foo';

        expect(arrayAccessHandler.get(target, prop).prototype).toEqual(target[prop].bind(target).prototype);
      });

      it('will return `target.values[prop]` if `prop` is an integer (or string representation of an integer) > 0.', () => {
        const target = {
          values: [1, 2, 3],
        };
        const prop = 1;

        expect(arrayAccessHandler.get(target, prop)).toEqual(target.values[prop]);
        expect(arrayAccessHandler.get(target, `${prop}`)).toEqual(target.values[`${prop}`]);
      });

      it('will return `target[prop]` if `prop` has any other value.', () => {
        const target = {
          foo: 'bar',
        };
        const prop = 'foo';

        expect(arrayAccessHandler.get(target, prop)).toEqual(target[prop]);
      });
    });

    describe('`set()`', () => {
      it('will set `target[prop]` to `value` if `prop` is a postive integer (or string representation of a positive integer) and has not already been set.', () => {
        const target = { values: [] };
        const prop = 10;
        const value = 12;
        const result = arrayAccessHandler.set(target, prop, value);
        expect(getKeyedValues(target)[getKeys(target)[prop]]).toEqual(value);
        expect(result).toBe(true);
      });

      it('will set `target[prop]` to `value` if `prop` is a postive integer (or string representation of a positive integer) and is already set.', () => {
        const target = { values: [] };
        const prop = 10;
        const value1 = 12;
        const value2 = 21;
        let result = arrayAccessHandler.set(target, prop, value1);
        expect(getKeyedValues(target)[getKeys(target)[prop]]).toEqual(value1);
        expect(result).toBe(true);
        result = arrayAccessHandler.set(target, prop, value2);
        expect(getKeyedValues(target)[getKeys(target)[prop]]).toEqual(value2);
        expect(result).toBe(true);
      });

      it('will not set `target[prop]` to `value` if `prop` is not a postive integer (or string representation of a positive integer).', () => {
        const target = { values: [] };
        const prop = 'foobar';
        const value = 12;
        let result = arrayAccessHandler.set(target, prop, value);
        expect(result).toBe(false);
      });
    });
  });
});

