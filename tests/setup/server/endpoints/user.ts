import { http, HttpResponse } from 'msw';
import {data} from "../../data";
import {config} from "../../config";

const BASE_URL = config.BASE_URL;

export const userHandlers = [
  http.get(`${BASE_URL}/user`, ({ request }) => {
    const customHeaders = request.headers.get('X-Custom-Header')

    if (customHeaders && customHeaders === data.HEADERS["X-Custom-Header"]) {
      return HttpResponse.json(data.EXTERNAL_USER)
    }

    return HttpResponse.json(data.USER);
  }),

  http.post(`${BASE_URL}/user`, async ({ request }) => {
    const customHeaders = request.headers.get('X-Custom-Header')
    if (customHeaders && customHeaders === data.HEADERS["X-Custom-Header"]) {
      return HttpResponse.json(data.EXTERNAL_USER)
    }

    const body = await request.json();

    return HttpResponse.json(body)
  }),

  http.patch(`${BASE_URL}/user`, async ({ request }) => {
    const customHeaders = request.headers.get('X-Custom-Header')
    if (customHeaders && customHeaders === data.HEADERS["X-Custom-Header"]) {
      return HttpResponse.json(data.EXTERNAL_USER)
    }
    const body = await request.json();

    return HttpResponse.json(body)
  }),

  http.put(`${BASE_URL}/user`, async ({ request }) => {
    const customHeaders = request.headers.get('X-Custom-Header')
    if (customHeaders && customHeaders === data.HEADERS["X-Custom-Header"]) {
      return HttpResponse.json(data.EXTERNAL_USER)
    }
    const body = await request.json();

    return HttpResponse.json(body)
  }),

  http.delete(`${BASE_URL}/user`, async ({ request }) => {
    const customHeaders = request.headers.get('X-Custom-Header')
    if (customHeaders && customHeaders === data.HEADERS["X-Custom-Header"]) {
      return HttpResponse.json(data.EXTERNAL_USER)
    }
    const body = await request.json();

    return HttpResponse.json(body)
  }),

  http.options(`${BASE_URL}/user`, async ({ request }) => {
    return new HttpResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
        'Access-Control-Allow-Headers':
          request.headers.get('Access-Control-Request-Headers') ?? '*',
        'Access-Control-Max-Age': '86400',
      }
    })
  }),

  http.head(`${BASE_URL}/user`, () => {
    return new HttpResponse(null, {
      headers: {
        'Content-Type': 'application/json',
        ...data.HEADERS
      },
    });
  })
]
