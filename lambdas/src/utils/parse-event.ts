import type { IHttpRequest } from '@app-types/http.ts'
import type { APIGatewayProxyEventV2 } from 'aws-lambda'

export function parseEvent(event: APIGatewayProxyEventV2): IHttpRequest {
  const body = JSON.parse(event.body ?? '{}')
  const params = event.pathParameters

  return {
    body,
    params,
  }
}
