import { render, screen } from '@testing-library/react';
import Hero from './Hero';

describe('Hero component', () => {
  test('renders the hero component with expected text', () => {
    render(<Hero />);
    // Example: check if a heading or some text is present
    const heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
  });
});
