import { httpClient } from '@http/http-client'

interface IInitiateMPUParams {
  filename: string
  totalChunks: number
}

interface IInitiateMPUResponse {
  key: string
  uploadId: string
  parts: {
    url: string
    partNumber: number
  }[]
}

export async function initiateMPU({
  filename,
  totalChunks,
}: IInitiateMPUParams) {
  return await httpClient.post<IInitiateMPUResponse>('/initiate-mpu', {
    filename,
    totalChunks,
  })
}
