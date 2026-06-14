import React from 'react';
import { render, screen } from '@testing-library/react';
import GeminiCommand from '../components/GeminiCommand';

test('renders GeminiCommand component', () => {
  render(<GeminiCommand />);
  // Assuming GeminiCommand renders some identifiable text or element
  const element = screen.getByText(/gemini/i);
  expect(element).toBeInTheDocument();
});
