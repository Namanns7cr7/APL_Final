import React from 'react';
import { render, screen } from '@testing-library/react';
import Metrics from '../Metrics';

describe('Metrics', () => {
  it('renders without crashing', () => {
    render(<Metrics />);
    expect(screen.getByTestId('metrics')).toBeInTheDocument();
  });
});
