import axios from 'axios'

interface IUploadChunkParams {
  url: string
  fileChunk: Blob
  maxRetries?: number
}

export async function uploadChunk({
  url,
  fileChunk,
  maxRetries = 3,
}: IUploadChunkParams) {
  try {
    const { headers } = await axios.put<null, { headers: { etag: string } }>(
      url,
      fileChunk,
    )

    const entityTag = headers.etag.replace(/"/g, '')

    return {
      entityTag,
    }
  } catch (error) {
    if (maxRetries > 0) {
      return await uploadChunk({
        url,
        fileChunk,
        maxRetries: maxRetries - 1,
      })
    }

    throw error
  }
}
