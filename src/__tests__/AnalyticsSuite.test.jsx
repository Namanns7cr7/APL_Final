import React from 'react';
import { render, screen } from '@testing-library/react';
import AnalyticsSuite from '../components/AnalyticsSuite';

test('renders AnalyticsSuite component', () => {
  render(<AnalyticsSuite />);
  // Assuming AnalyticsSuite renders some identifiable text or element
  const element = screen.getByText(/analytics/i);
  expect(element).toBeInTheDocument();
});
