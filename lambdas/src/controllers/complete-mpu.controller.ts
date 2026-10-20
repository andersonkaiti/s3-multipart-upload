import type { IHttpRequest } from '@app-types/http.ts'
import { CompleteMultipartUploadCommand } from '@aws-sdk/client-s3'
import { s3Client } from '@clients/s3.client.ts'
import { env } from '@config/env.ts'
import { response } from '@utils/response.ts'
import { z } from 'zod'

const completeMPUSchema = z.object({
  fileKey: z.string(),
  uploadId: z.string(),
  parts: z.array(
    z.object({
      partNumber: z.number(),
      entityTag: z.string(),
    }),
  ),
})

export class CompleteMPUController {
  static async execute({ body }: IHttpRequest) {
    const { success, error, data } = completeMPUSchema.safeParse(body)

    if (!success) {
      return response({
        statusCode: 400,
        body: {
          error: z.prettifyError(error),
        },
      })
    }

    const { fileKey, uploadId, parts } = data

    const command = new CompleteMultipartUploadCommand({
      Bucket: env.BUCKET_NAME,
      Key: fileKey,
      UploadId: uploadId,
      MultipartUpload: {
        Parts: parts.map((part) => ({
          PartNumber: part.partNumber,
          ETag: part.entityTag,
        })),
      },
    })

    await s3Client.send(command)

    return response({
      statusCode: 200,
    })
  }
}
