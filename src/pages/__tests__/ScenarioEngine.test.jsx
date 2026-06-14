import React from 'react';
import { render, screen } from '@testing-library/react';
import ScenarioEngine from '../ScenarioEngine';

describe('ScenarioEngine', () => {
  it('renders without crashing', () => {
    render(<ScenarioEngine />);
    expect(screen.getByTestId('scenario-engine')).toBeInTheDocument();
  });
});
