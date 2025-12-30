export interface User {
  name: string
  id: number
}

export const data = {
  USER: {
    name: 'John',
    id: 369,
  },
  EXTERNAL_USER: {
    name: 'John Smith',
    id: 99,
  },
  HEADERS: {
    'X-Custom-Header': 'test-value',
  }
}