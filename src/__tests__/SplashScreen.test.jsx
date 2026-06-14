import React from 'react';
import { render, screen } from '@testing-library/react';
import SplashScreen from '../components/SplashScreen';

test('renders SplashScreen component', () => {
  render(<SplashScreen />);
  // Assuming SplashScreen renders some identifiable text or element
  const element = screen.getByText(/loading/i);
  expect(element).toBeInTheDocument();
});
