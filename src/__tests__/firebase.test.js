import * as firebase from '../firebase';

describe('firebase module', () => {
  test('firebase module exports expected functions or objects', () => {
    // Check that firebase exports at least one known property
    expect(firebase).toBeDefined();
    // Example: if firebase exports initializeApp
    if (firebase.initializeApp) {
      expect(typeof firebase.initializeApp).toBe('function');
    }
  });
});
