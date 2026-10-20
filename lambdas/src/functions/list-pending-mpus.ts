import { ListPendingMPUsController } from '@controllers/list-pending-mpus.controller.ts'

export async function handler() {
  return ListPendingMPUsController.execute()
}
