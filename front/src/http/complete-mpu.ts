import { httpClient } from '@http/http-client'

interface ICompleteMPUParams {
  fileKey: string
  uploadId: string
  parts: {
    partNumber: number
    entityTag: string
  }[]
}

export async function completeMPU({
  fileKey,
  uploadId,
  parts,
}: ICompleteMPUParams) {
  return await httpClient.post('/complete-mpu', {
    fileKey,
    uploadId,
    parts,
  })
}
