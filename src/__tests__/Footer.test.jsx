import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../components/Footer';

test('renders Footer component with copyright text', () => {
  render(<Footer />);
  const copyright = screen.getByText(/copyright/i);
  expect(copyright).toBeInTheDocument();
});
