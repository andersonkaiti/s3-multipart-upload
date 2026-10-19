import { InitiateMPUController } from '@controllers/initiate-mpu.controller.ts'
import { parseEvent } from '@utils/parse-event.ts'
import type { APIGatewayProxyEventV2 } from 'aws-lambda'

export async function handler(event: APIGatewayProxyEventV2) {
  const request = parseEvent(event)

  return await InitiateMPUController.execute(request)
}
