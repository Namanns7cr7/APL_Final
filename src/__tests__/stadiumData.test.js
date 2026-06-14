import stadiumData from '../data/stadiumData';

describe('stadiumData module', () => {
  test('stadiumData is an array and has expected properties', () => {
    expect(Array.isArray(stadiumData)).toBe(true);
    if (stadiumData.length > 0) {
      const stadium = stadiumData[0];
      expect(stadium).toHaveProperty('name');
      expect(stadium).toHaveProperty('location');
      expect(stadium).toHaveProperty('capacity');
    }
  });
});
