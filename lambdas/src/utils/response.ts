import type { IHttpResponse } from '@app-types/http.ts'

export function response({
  statusCode = 200,
  headers = {},
  body = {},
}: IHttpResponse) {
  return {
    statusCode,
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }
}
