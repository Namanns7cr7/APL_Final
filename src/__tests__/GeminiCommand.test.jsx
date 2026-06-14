import React from 'react';
import { render, screen } from '@testing-library/react';
import GeminiCommand from '../components/GeminiCommand';

describe('GeminiCommand Component', () => {
  test('renders GeminiCommand and contains expected button or text', () => {
    render(<GeminiCommand />);
    // Assuming GeminiCommand has a button or key text
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });
});
