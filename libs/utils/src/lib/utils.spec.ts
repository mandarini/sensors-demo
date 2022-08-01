import { mapNumber } from './utils';

describe('utils', () => {
  describe('mapNumber', () => {
    it('should map a number to a range', () => {
      expect(mapNumber(50, 20, 500, 80, 200)).toEqual(87.5);
    });
  });
});
