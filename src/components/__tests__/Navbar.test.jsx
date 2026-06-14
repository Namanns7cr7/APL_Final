import React from 'react';
import { render, screen } from '@testing-library/react';
import Navbar from '../Navbar';

describe('Navbar', () => {
  it('renders without crashing', () => {
    render(<Navbar />);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });
});
