import { setupServer } from 'msw/node';
import {handlers} from './endpoints';

export const server = setupServer(...handlers);
