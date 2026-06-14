import React from 'react';
import { render, screen } from '@testing-library/react';
import SplashScreen from '../components/SplashScreen';

describe('SplashScreen Component', () => {
  test('renders SplashScreen with loading text or spinner', () => {
    render(<SplashScreen />);
    // Assuming SplashScreen has loading text or spinner
    const loadingText = screen.getByText(/loading/i);
    expect(loadingText).toBeInTheDocument();
  });
});
