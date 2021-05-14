import { properties, property, propertyMap } from 'tools/property';

describe('property.js --', () => {
  describe('`propertyMap()`', () => {
    const nonStandardMaps = [1, {}, null, undefined, NaN, () => {}];

    it('returns `map` when `map` is an array', () => {
      const map = ['a', 'b', 'c', 'd'];
      const result = propertyMap(map);
      expect(result).toEqual(map);
    });

    it('returns an array containing `map` when `map` is not an array or string', () => {
      nonStandardMaps.forEach(map => expect(propertyMap(map)).toEqual([map]));
    });

    it('returns an array of `map` split by `delimiter` when `map` is a string', () => {
      const map = 'a.b.c.d';
      expect(propertyMap(map)).toEqual(['a', 'b', 'c', 'd']);
    });

    it('returns a string when `options.asString` is true', () => {
      const asString = true;
      expect(typeof propertyMap('', { asString })).toEqual('string');
    });

    it('returns `map` cast to a string when `map` is not a string or an array and `options.asString` is true', () => {
      const asString = true;
      nonStandardMaps.forEach(map => expect(propertyMap(map, { asString })).toEqual(String(map)));
    });

    it('it returns the result of `map.implode(delimiter)` when `map` is an array and `options.asString` is true', () => {
     const asString = true;
     const map = ['a', 'b', 'c', 'd'];
     expect(propertyMap(map, { asString })).toEqual('a.b.c.d');
    });
  });

  describe('`property()`', () => {
    it('will return `fallback` when `map` is empty', () => {
      const source = {};
      const map = [];
      const fallback = 'FALLBACK';
      expect(property(source, map, fallback)).toEqual(fallback);
    });

    it('will return the sub-value keyed to the highest index of `map` if the key can be found nested in `source`', () => {
      const c = { d: 'd', e: 'e', f: 'f' };
      const source = { a: { b: { c: c } } };
      const map = ['a', 'b', 'c'];
      const fallback = 'FALLBACK';
      expect(property(source, map, fallback)).toEqual(c);
    });

    it('will return `fallback` if the sub-value keyed to the highest index of `map` can not be found nested under `source`', () => {
      const source = { a: { b: {} } };
      const map = ['a', 'b', 'c'];
      const fallback = 'FALLBACK';
      expect(property(source, map, fallback)).toEqual(fallback);
    });
  });

  describe('`properties()`', () => {
    it('returns an object of properties from `source` based on `maps`', () => {
      const source = {
        a: {
          i: 'b',
          ii: 'c',
        },
        b: {
          iii: 'd'
        }
      };
      const maps = [
        // string, valid
        'a.i',
        // array, valid
        ['b', 'iii'],
        // object, map and delimiter, valid
        { map: 'a&ii', delimiter: '&' },
        // string, invalid
        'x.y',
        // object, invalid with fallback
        { map: 'cd', fallback: 'foobar' },
        // number, not string, array or object
        1,
        // object without map or delimiter
        {},
      ];
      const fallback = 'FALLBACK';

      expect(properties(source, maps, fallback)).toEqual({
        i: 'b',
        iii: 'd',
        ii: 'c',
        y: fallback,
        cd: 'foobar',
        1: fallback,
      });
    });
  });
});
