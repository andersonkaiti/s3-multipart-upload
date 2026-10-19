import { randomUUID } from 'node:crypto'
import { extname } from 'node:path'
import type { IHttpRequest } from '@app-types/http.ts'
import {
  CreateMultipartUploadCommand,
  UploadPartCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
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
  totalChunks: z.number(),
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

    const { filename, totalChunks } = data

    const key = `${randomUUID()}${filename}`

    const createMPUCommand = new CreateMultipartUploadCommand({
      Bucket: env.BUCKET_NAME,
      Key: key,
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

    const signedURLPromises = []

    for (let partNumber = 1; partNumber <= totalChunks; partNumber++) {
      const uploadPartCommand = new UploadPartCommand({
        Bucket: env.BUCKET_NAME,
        Key: key,
        UploadId: uploadId,
        PartNumber: 1,
      })

      const ONE_MINUTE = 60
      const ONE_HOUR = 60 * ONE_MINUTE

      signedURLPromises.push(
        getSignedUrl(s3Client, uploadPartCommand, {
          expiresIn: ONE_HOUR,
        }),
      )
    }

    const urls = await Promise.all(signedURLPromises)

    return response({
      statusCode: 201,
      body: {
        key,
        uploadId,
        urls: urls.map((url, index) => ({
          url,
          partNumber: index + 1,
        })),
      },
    })
  }
}
