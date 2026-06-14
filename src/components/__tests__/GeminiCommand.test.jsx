import React from 'react';
import { render, screen } from '@testing-library/react';
import GeminiCommand from '../GeminiCommand';

describe('GeminiCommand', () => {
  it('renders without crashing', () => {
    render(<GeminiCommand />);
    expect(screen.getByTestId('gemini-command')).toBeInTheDocument();
  });
});
