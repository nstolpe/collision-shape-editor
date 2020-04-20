import { properties, property, propertyMap, __RewireAPI__ } from 'tools/property';

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
    it('will call `propertyMap` with `map` and `delimiter`', () => {
      const source = { a: { b: true } };
      const map = 'a//b';
      const delimiter = '//';
      const spy = jest.fn(propertyMap);

      __RewireAPI__.__Rewire__('propertyMap', spy);

      property(source, map, undefined, delimiter);
      expect(spy).toHaveBeenCalledWith(map, { delimiter });

      __RewireAPI__.__ResetDependency__('propertyMap');
    });

    it('will return `fallback` when `map` is empty', () => {
      const source = {};
      const map = [];
      const fallback = 'FALLBACK';
      expect(property(source, map, fallback)).toEqual(fallback);
    });
  });

  describe('`properties()`', () => {
    describe('calls `propertyMap`', () => {
      const source = { a: { b: true } };
      const map = 'a&b';
      const delimiter = '&';

      const spy = jest.fn(propertyMap);

      beforeAll(() => {
        __RewireAPI__.__Rewire__('propertyMap', spy);
      });

      afterEach(() => {
        spy.mockClear();
      });

      afterAll(() => {
        __RewireAPI__.__ResetDependency__('propertyMap');
      });

      it('will call `propertyMap` with `maps[n].map` and `maps[n].delimiter`', () => {
        properties(source, [{ map, delimiter }]);
        expect(spy).toHaveBeenCalledWith(map, { delimiter });
      });

      it('will call `propertyMap` with `maps[n]` split by `delimiter` if `maps[n].map` and `delimiter` are strings', () => {
        properties(source, [{ map }], undefined, delimiter);
        expect(spy).toHaveBeenCalledWith(map, { delimiter });
      });

      it('will call `propertyMap` with an empty array if `maps[n].map` doesn\'t exist', () => {
        properties(source, [{}], undefined, delimiter);
        expect(spy).toHaveBeenCalledWith([], { delimiter });
      });
    });

    describe('calls `property`', () => {
      const source = { a: { b: true } };
      const sourceEmpty = { a: {} };

      const mapArray = ['a', 'b'];
      const mapString = 'a%b';

      const delimiter = '%';
      const fallback = false;

      const spy = jest.fn(property);

      beforeAll(() => {
        __RewireAPI__.__Rewire__('property', spy);
      });

      afterEach(() => {
        spy.mockClear();
      });

      afterAll(() => {
        __RewireAPI__.__ResetDependency__('property');
      });

      it('will call `property` with `maps[n]` split by `delimiter` if `maps[n].map` and `delimiter` are strings', () => {
        properties(source, [mapString], undefined, delimiter);
        expect(spy).toHaveBeenCalledWith(source, mapString.split(delimiter), undefined);
      });

      it('will call `property` with `maps[n].map` if `maps[n].map` is an array', () => {
        properties(source, [mapArray]);
        expect(spy).toHaveBeenCalledWith(source, mapArray, undefined);
      });

      it('will call `property` with `maps[n]` split by `maps[n].delimiter` if `maps[n].map` and `maps[n].delimiter` are strings', () => {
        properties(source, [{ map: mapString, delimiter }]);
        expect(spy).toHaveBeenCalledWith(source, propertyMap(mapString, { delimiter }), undefined);
      });

      it('will call `property` with `maps[n].fallback` if `maps[n]` is an object and `maps[n].fallback` exists', () => {
        properties(sourceEmpty, [{ map: mapArray, fallback, delimiter }]);
        expect(spy).toHaveBeenCalledWith(sourceEmpty, mapArray, fallback);
      });

      it('will not call `property` when `maps[n]` isn\'t a string, array or object', () => {
        properties(source, [undefined]);
        expect(spy).not.toHaveBeenCalled();
      });
    });
  });
});
