import { toast } from '@components/ui/toast'
import { completeMPU } from '@http/complete-mpu'
import { initiateMPU } from '@http/initiate-mpu'
import { uploadChunk } from '@http/upload-chunk'
import { type ChangeEvent, useState, useTransition } from 'react'

export function useMultipartUpload() {
  const [file, setFile] = useState<File>()
  const [isLoading, startTransition] = useTransition()

  function handleSubmit(event: ChangeEvent) {
    startTransition(async () => {
      event.preventDefault()

      if (!file) {
        return
      }

      const ONE_KILOBYTE = 1024
      const ONE_MEGABYTE = 1024 * ONE_KILOBYTE

      const chunkSize = 5 * ONE_MEGABYTE
      const totalChunks = Math.ceil(file.size / chunkSize)

      const {
        data: { key: fileKey, uploadId, parts },
      } = await initiateMPU({
        filename: file.name,
        totalChunks,
      })

      const uploadedParts = await Promise.all(
        parts.map(async ({ url, partNumber }, index) => {
          const chunkStart = index * chunkSize
          const chunkEnd = Math.min(chunkStart + chunkSize, file.size)

          const fileChunk = file.slice(chunkStart, chunkEnd)

          const { entityTag } = await uploadChunk({
            url,
            fileChunk,
          })

          return {
            partNumber,
            entityTag,
          }
        }),
      )

      await completeMPU({
        fileKey,
        parts: uploadedParts,
        uploadId,
      })

      toast.add({
        title: 'Upload!',
      })
    })
  }

  return {
    file,
    setFile,
    handleSubmit,
    isLoading,
  }
}
