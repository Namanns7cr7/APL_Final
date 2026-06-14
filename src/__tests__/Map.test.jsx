import React from 'react';
import { render, screen } from '@testing-library/react';
import Map from '../components/Map';

test('renders Map component', () => {
  render(<Map />);
  // Assuming Map renders some identifiable text or element
  const element = screen.getByText(/map/i);
  expect(element).toBeInTheDocument();
});
