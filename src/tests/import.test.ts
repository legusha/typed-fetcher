import { httpClient } from '../index';

test('httpClient is object', () => {
  expect(typeof httpClient).toBe('object');
});
