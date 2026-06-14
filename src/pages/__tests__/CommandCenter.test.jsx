import React from 'react';
import { render, screen } from '@testing-library/react';
import CommandCenter from '../CommandCenter';

describe('CommandCenter', () => {
  it('renders without crashing', () => {
    render(<CommandCenter />);
    expect(screen.getByTestId('command-center')).toBeInTheDocument();
  });
});
