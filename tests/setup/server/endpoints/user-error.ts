import { http, HttpResponse } from 'msw';
import {data} from "../../data";
import {config} from "../../config";

const BASE_URL = config.BASE_URL;
const errorMessage = data.HTTP_ERRORS.SERVER_ERROR.message
const statusCode = data.HTTP_ERRORS.SERVER_ERROR.statusCode;

export const userErrorHandlers = [
  http.get(`${BASE_URL}/user-error`, () => {
    return HttpResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }),

  http.post(`${BASE_URL}/user-error`, async () => {
    return HttpResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }),

  http.patch(`${BASE_URL}/user-error`, async () => {
    return HttpResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }),

  http.put(`${BASE_URL}/user-error`, async () => {
    return HttpResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }),

  http.delete(`${BASE_URL}/user-error`, async () => {
    return HttpResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }),

  http.options(`${BASE_URL}/user-error`, async () => {
    return HttpResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }),

  http.head(`${BASE_URL}/user-error`, () => {
    return HttpResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  })
]
