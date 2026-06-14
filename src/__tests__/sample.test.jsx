import React from 'react';
import { render, screen } from '@testing-library/react';
import Hero from '../components/Hero';

test('renders Hero component text', () => {
  render(<Hero />);
  const element = screen.getByText(/hero/i);
  expect(element).toBeInTheDocument();
});
