import React from 'react';
import { render, screen } from '@testing-library/react';
import Navbar from '../components/Navbar';

test('renders Navbar component with navigation links', () => {
  render(<Navbar />);
  // Assuming Navbar has a link or text with 'home' or similar
  const link = screen.getByText(/home/i);
  expect(link).toBeInTheDocument();
});
