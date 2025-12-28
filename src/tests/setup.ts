import { server } from './server';

// Start server before all tests
beforeAll(() => server.listen());

// Reset handlers after each tests (important for tests isolation)
beforeEach(() => server.resetHandlers());

// Stop server after all tests
afterAll(() => server.close());
