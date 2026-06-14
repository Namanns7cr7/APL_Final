import React from 'react';
import { render, screen } from '@testing-library/react';
import Hero from '../components/Hero';

describe('Hero Component', () => {
  test('renders Hero component with main heading', () => {
    render(<Hero />);
    // Assuming Hero has a main heading
    const heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
  });
});
