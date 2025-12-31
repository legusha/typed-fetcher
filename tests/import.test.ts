import { httpClient, HttpClient, HttpErrorManager, HttpErrorJSON, HttpErrorBase, XmlHttpProvider, FetchProvider } from '../src';

test('HttpClient is object', () => {
  expect(typeof HttpClient).toBe('function');
})

test('ErrorManager is object', () => {
  expect(typeof HttpErrorManager).toBe('function');
})

test('ErrorJSON is object', () => {
  expect(typeof HttpErrorJSON).toBe('function');
})

test('ErrorBase is object', () => {
  expect(typeof HttpErrorBase).toBe('function');
})

test('XmlHttpProvider is object', () => {
  expect(typeof XmlHttpProvider).toBe('function');
})

test('FetchProvider is object', () => {
  expect(typeof FetchProvider).toBe('function');
})

test('httpClient is object', () => {
  expect(typeof httpClient).toBe('object');
});
