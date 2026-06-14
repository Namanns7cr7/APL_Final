import React from 'react';
import { render, screen } from '@testing-library/react';
import DispatchHub from '../DispatchHub';

describe('DispatchHub', () => {
  it('renders without crashing', () => {
    render(<DispatchHub />);
    expect(screen.getByTestId('dispatch-hub')).toBeInTheDocument();
  });
});
