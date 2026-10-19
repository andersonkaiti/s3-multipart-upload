export interface IHttpRequest {
  body: Record<string, unknown>
  params?: Record<string, unknown>
}

export interface IHttpResponse {
  statusCode?: number
  headers?: Record<string, unknown>
  body?: Record<string, unknown>
}
