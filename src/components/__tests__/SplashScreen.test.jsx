import React from 'react';
import { render, screen } from '@testing-library/react';
import SplashScreen from '../SplashScreen';

describe('SplashScreen', () => {
  it('renders without crashing', () => {
    render(<SplashScreen />);
    expect(screen.getByTestId('splash-screen')).toBeInTheDocument();
  });
});
