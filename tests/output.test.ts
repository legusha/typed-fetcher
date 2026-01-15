import { httpClient, HttpClient, HttpErrorManager, HttpErrorJSON, HttpErrorBase, XmlHttpProvider, FetchProvider } from '../src';

describe('Output API', () => {
  test('HttpClient is function', () => {
    expect(typeof HttpClient).toBe('function');
  })

  test('ErrorManager is function', () => {
    expect(typeof HttpErrorManager).toBe('function');
  })

  test('ErrorJSON is function', () => {
    expect(typeof HttpErrorJSON).toBe('function');
  })

  test('ErrorBase is function', () => {
    expect(typeof HttpErrorBase).toBe('function');
  })

  test('XmlHttpProvider is function', () => {
    expect(typeof XmlHttpProvider).toBe('function');
  })

  test('FetchProvider is function', () => {
    expect(typeof FetchProvider).toBe('function');
  })

  test('httpClient is object', () => {
    expect(typeof httpClient).toBe('object');
  });
})
