import { setupServer } from 'msw/node';
import {userHandlers} from './endpoints/user';
import {userErrorHandlers} from "./endpoints/user-error";

const allHandlers = [
  ...userHandlers,
  ...userErrorHandlers,
]

export const server = setupServer(...allHandlers);
