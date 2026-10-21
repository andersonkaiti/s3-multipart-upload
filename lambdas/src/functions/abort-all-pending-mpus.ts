import { AbortAllPendingMPUsController } from '@controllers/abort-all-pending-mpus.controller.ts'

export async function handler() {
  return await AbortAllPendingMPUsController.execute()
}
