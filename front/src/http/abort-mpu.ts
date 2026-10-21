import { httpClient } from '@http/http-client'

interface IAbortMPUParams {
  fileKey: string
  uploadId: string
}

export async function abortMPU({ fileKey, uploadId }: IAbortMPUParams) {
  return await httpClient.delete('/abort-mpu', {
    data: {
      fileKey,
      uploadId,
    },
  })
}
