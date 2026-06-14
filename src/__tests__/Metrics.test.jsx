import React from 'react';
import { render, screen } from '@testing-library/react';
import Metrics from '../components/Metrics';

describe('Metrics Component', () => {
  test('renders Metrics component with expected text or heading', () => {
    render(<Metrics />);
    // Assuming Metrics has a heading or key text
    const heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
  });
});
