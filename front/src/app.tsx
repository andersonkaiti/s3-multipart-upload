import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { useMultipartUpload } from '@hooks/use-multipart-upload'
import { Loader2 } from 'lucide-react'

export function App() {
  const { file, setFile, handleSubmit, isLoading } = useMultipartUpload()

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-8 p-5">
      <h1 className="font-bold text-3xl tracking-tighter">
        Selecione um arquivo
      </h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          type="file"
          onChange={(event) => setFile(event.target.files?.[0])}
        />

        <Button className="w-full" type="submit" disabled={!file || isLoading}>
          {isLoading && <Loader2 className="size-4 animate-spin" />}
          Enviar
        </Button>
      </form>
    </div>
  )
}
