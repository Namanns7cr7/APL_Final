import React from 'react';
import { render, screen } from '@testing-library/react';
import AnalyticsSuite from '../AnalyticsSuite';

describe('AnalyticsSuite', () => {
  it('renders without crashing', () => {
    render(<AnalyticsSuite />);
    // Assuming it has some text or role to check
    expect(screen.getByTestId('analytics-suite')).toBeInTheDocument();
  });
});
