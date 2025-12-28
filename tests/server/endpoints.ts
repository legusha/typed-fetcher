import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('https://api.example.com/users', () => {
    return HttpResponse.json([
      { id: 1, name: 'John' },
    ]);
  }),

  // http.post('https://api.example.com/login', async ({ request }) => {
  //   const body = await request.json();
  //
  //   if (body.email === 'tests@tests.com') {
  //     return HttpResponse.json({ token: 'jwt-token' });
  //   }
  //
  //   return new HttpResponse(null, { status: 401 });
  // }),
];
