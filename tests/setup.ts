import { afterEach, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { mockWindowMatchMedia } from './mocks/windowMocks';

beforeEach(() => {
  mockWindowMatchMedia();
});

afterEach(() => {
  cleanup();
});
