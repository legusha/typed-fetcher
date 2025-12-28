import { httpClient } from '../src';

test('httpClient is object', () => {
  expect(typeof httpClient).toBe('object');
});
