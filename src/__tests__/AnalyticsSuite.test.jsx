import React from 'react';
import { render, screen } from '@testing-library/react';
import AnalyticsSuite from '../components/AnalyticsSuite';

describe('AnalyticsSuite Component', () => {
  test('renders without crashing and contains expected text', () => {
    render(<AnalyticsSuite />);
    // Assuming AnalyticsSuite has a heading or identifiable text
    const heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
  });
});
