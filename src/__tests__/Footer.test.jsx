import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../components/Footer';

describe('Footer Component', () => {
  test('renders footer text or copyright', () => {
    render(<Footer />);
    // Assuming Footer has some copyright or footer text
    const footerElement = screen.getByText(/copyright/i);
    expect(footerElement).toBeInTheDocument();
  });
});
