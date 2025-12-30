import { setupServer } from 'msw/node';
import {userHandlers} from './endpoints/user';

const allHandlers = [
  ...userHandlers,
]

export const server = setupServer(...allHandlers);
