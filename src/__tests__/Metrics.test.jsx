import React from 'react';
import { render, screen } from '@testing-library/react';
import Metrics from '../components/Metrics';

test('renders Metrics component', () => {
  render(<Metrics />);
  // Assuming Metrics renders some identifiable text or element
  const element = screen.getByText(/metrics/i);
  expect(element).toBeInTheDocument();
});
