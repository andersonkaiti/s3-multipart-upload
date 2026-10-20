import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { toast } from '@components/ui/toast'
import { type ChangeEvent, useState } from 'react'

export function App() {
  const [file, setFile] = useState<File>()

  function handleSubmit(event: ChangeEvent) {
    event.preventDefault()

    if (!file) {
      return
    }

    toast.add({
      title: 'Upload!',
    })
  }

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

        <Button className="w-full" type="submit" disabled={!file}>
          Enviar
        </Button>
      </form>
    </div>
  )
}
