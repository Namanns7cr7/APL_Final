import React from 'react';
import { render, screen } from '@testing-library/react';
import Navbar from '../components/Navbar';

describe('Navbar Component', () => {
  test('renders Navbar with navigation links', () => {
    render(<Navbar />);
    // Assuming Navbar has navigation links
    const navLinks = screen.getAllByRole('link');
    expect(navLinks.length).toBeGreaterThan(0);
  });
});
