import React from 'react';
import { render, screen } from '@testing-library/react';
import Map from '../components/Map';

describe('Map Component', () => {
  test('renders Map component and contains map container', () => {
    render(<Map />);
    // Assuming Map has a container with role or test id
    const mapContainer = screen.getByTestId('map-container');
    expect(mapContainer).toBeInTheDocument();
  });
});
