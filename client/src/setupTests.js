// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

jest.mock('./db', () => ({
  dbPromise: Promise.resolve({
    put: jest.fn(() => Promise.resolve()),
    get: jest.fn(() => Promise.resolve(undefined)),
    getAll: jest.fn(() => Promise.resolve([])),
    delete: jest.fn(() => Promise.resolve()),
  }),
}));

jest.mock('./api', () => ({
  API_BASE: 'http://localhost:5000',
  api: {
    get: jest.fn(() => Promise.resolve({ data: [] })),
    post: jest.fn(),
    delete: jest.fn(),
  },
}));
