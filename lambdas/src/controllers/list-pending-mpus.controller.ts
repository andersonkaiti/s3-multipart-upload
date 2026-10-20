import { ListMultipartUploadsCommand } from '@aws-sdk/client-s3'
import { s3Client } from '@clients/s3.client.ts'
import { env } from '@config/env.ts'
import { response } from '@utils/response.ts'

export class ListPendingMPUsController {
  static async execute() {
    const command = new ListMultipartUploadsCommand({
      Bucket: env.BUCKET_NAME,
    })

    const { Uploads: uploads } = await s3Client.send(command)

    return response({
      statusCode: 200,
      body: {
        uploads,
      },
    })
  }
}
