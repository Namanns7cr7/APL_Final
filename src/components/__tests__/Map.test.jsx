import React from 'react';
import { render, screen } from '@testing-library/react';
import Map from '../Map';

describe('Map', () => {
  it('renders without crashing', () => {
    render(<Map />);
    expect(screen.getByTestId('map')).toBeInTheDocument();
  });
});
