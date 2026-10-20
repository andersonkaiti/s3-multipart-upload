import type { IHttpRequest } from '@app-types/http.ts'
import { AbortMultipartUploadCommand } from '@aws-sdk/client-s3'
import { s3Client } from '@clients/s3.client.ts'
import { env } from '@config/env.ts'
import { response } from '@utils/response.ts'
import { z } from 'zod'

const abortMPUSchema = z.object({
  uploadId: z.string(),
  key: z.string(),
})

export class AbortMPUController {
  static async execute(request: IHttpRequest) {
    const { success, error, data } = abortMPUSchema.safeParse(request.body)

    if (!success) {
      return response({
        statusCode: 400,
        body: {
          error: z.prettifyError(error),
        },
      })
    }

    const { uploadId, key } = data

    const command = new AbortMultipartUploadCommand({
      Bucket: env.BUCKET_NAME,
      UploadId: uploadId,
      Key: key,
    })

    await s3Client.send(command)

    return response({
      statusCode: 200,
    })
  }
}
