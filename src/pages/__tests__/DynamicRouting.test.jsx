import React from 'react';
import { render, screen } from '@testing-library/react';
import DynamicRouting from '../DynamicRouting';

describe('DynamicRouting', () => {
  it('renders without crashing', () => {
    render(<DynamicRouting />);
    expect(screen.getByTestId('dynamic-routing')).toBeInTheDocument();
  });
});
