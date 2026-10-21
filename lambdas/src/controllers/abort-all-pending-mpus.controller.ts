import {
  AbortMultipartUploadCommand,
  ListMultipartUploadsCommand,
} from '@aws-sdk/client-s3'
import { s3Client } from '@clients/s3.client.ts'
import { env } from '@config/env.ts'
import { response } from '@utils/response.ts'

export class AbortAllPendingMPUsController {
  static async execute() {
    const listMPUsCommand = new ListMultipartUploadsCommand({
      Bucket: env.BUCKET_NAME,
    })

    const { Uploads: uploads } = await s3Client.send(listMPUsCommand)

    if (!uploads) {
      return response({
        statusCode: 404,
        body: {
          message: 'There are no pending MPUs',
        },
      })
    }

    await Promise.all(
      uploads.map(({ UploadId, Key }) => {
        const abortCommand = new AbortMultipartUploadCommand({
          Bucket: env.BUCKET_NAME,
          UploadId,
          Key,
        })

        return s3Client.send(abortCommand)
      }),
    )

    return response({
      statusCode: 204,
    })
  }
}
