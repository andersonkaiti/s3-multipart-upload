import axios from 'axios'

interface IUploadChunkParams {
  url: string
  fileChunk: Blob
}

export async function uploadChunk({ url, fileChunk }: IUploadChunkParams) {
  const { headers } = await axios.put<null, { headers: { etag: string } }>(
    url,
    fileChunk,
  )

  const entityTag = headers.etag.replace(/"/g, '')

  return {
    entityTag,
  }
}
