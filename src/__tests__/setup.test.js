import React from 'react';
import { render, screen } from '@testing-library/react';

// Simple placeholder test to verify Jest setup

test('renders a placeholder text', () => {
  render(<div>Hello Jest Setup</div>);
  expect(screen.getByText('Hello Jest Setup')).toBeInTheDocument();
});
