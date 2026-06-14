import { stadiums } from '../data/stadiumData';

test('stadiumData exports an array with expected properties', () => {
  expect(Array.isArray(stadiums)).toBe(true);
  if (stadiums.length > 0) {
    const stadium = stadiums[0];
    expect(stadium).toHaveProperty('name');
    expect(stadium).toHaveProperty('location');
    expect(stadium).toHaveProperty('capacity');
  }
});
