import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the main tabs', () => {
  render(<App />);
  expect(screen.getByRole('tab', { name: /gear score/i })).toBeInTheDocument();
  expect(screen.getByRole('tab', { name: /guild war/i })).toBeInTheDocument();
  expect(screen.getByRole('tab', { name: /guild war scout/i })).toBeInTheDocument();
});
