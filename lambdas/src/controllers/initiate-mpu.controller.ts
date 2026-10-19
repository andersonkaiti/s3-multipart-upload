import { randomUUID } from 'node:crypto'
import { extname } from 'node:path'
import type { IHttpRequest } from '@app-types/http.ts'
import { CreateMultipartUploadCommand } from '@aws-sdk/client-s3'
import { s3Client } from '@clients/s3.client.ts'
import { env } from '@config/env.ts'
import { response } from '@utils/response.ts'
import { z } from 'zod'

const initiateMPUSchema = z.object({
  filename: z
    .string()
    .refine(
      (value) => extname(value).length > 0,
      'The filename must have an extension',
    ),
})

export class InitiateMPUController {
  static async execute({ body }: IHttpRequest) {
    const { success, error, data } = initiateMPUSchema.safeParse(body)

    if (!success) {
      return response({
        statusCode: 400,
        body: {
          error: z.prettifyError(error),
        },
      })
    }

    const { filename } = data

    const createMPUCommand = new CreateMultipartUploadCommand({
      Bucket: env.BUCKET_NAME,
      Key: `${randomUUID()}${filename}`,
    })

    const { UploadId: uploadId } = await s3Client.send(createMPUCommand)

    if (!uploadId) {
      return response({
        statusCode: 500,
        body: {
          error: 'Failed creating multipart upload',
        },
      })
    }

    return response({
      statusCode: 200,
      body: {
        uploadId,
      },
    })
  }
}
