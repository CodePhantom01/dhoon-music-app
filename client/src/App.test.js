import { render, screen } from '@testing-library/react';
import App from './App';

test('renders music player as home', async () => {
  render(<App />);
  expect(await screen.findByPlaceholderText(/Search songs or artists/i)).toBeInTheDocument();
  expect(screen.getByText(/Trending Tracks/i)).toBeInTheDocument();
});
