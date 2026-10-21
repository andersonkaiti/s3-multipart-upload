# S3 Multipart Upload

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![AWS Lambda](https://img.shields.io/badge/AWS_Lambda-Node.js_24-FF9900?logo=awslambda&logoColor=white)
![Serverless](https://img.shields.io/badge/Serverless-Framework-FD5750?logo=serverless&logoColor=white)
![Amazon S3](https://img.shields.io/badge/Amazon_S3-569A31?logo=amazons3&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-workspaces-F69220?logo=pnpm&logoColor=white)
![Biome](https://img.shields.io/badge/Biome-lint_%26_format-60A5FA?logo=biome&logoColor=white)

Aplicação de demonstração para upload de arquivos grandes no AWS S3 usando **multipart upload** com **URLs pré-assinadas** (presigned URLs). O frontend (React + Vite) fatia o arquivo em partes e envia cada uma diretamente para o S3, enquanto o backend (AWS Lambda via Serverless Framework) orquestra o ciclo de vida do upload.

## Como funciona

| Etapa          | O que acontece                                                                                                   |
| -------------- | --------------------------------------------------------------------------------------------------------------- |
| **Iniciar**    | O cliente fatia o arquivo em chunks de 5 MB e pede ao backend para iniciar o upload. O S3 devolve uma URL pré-assinada por parte. |
| **Enviar**     | Cada chunk é enviado direto ao S3 (`PUT`) via URL pré-assinada, em paralelo e com retry automático. Cada parte retorna um `ETag`. |
| **Concluir**   | Com todos os `ETag`s coletados, o cliente pede ao backend para concluir, juntando as partes no objeto final.     |
| **Abortar**    | Se uma parte falhar após as tentativas, o upload é abortado para não deixar partes órfãs. Uploads incompletos esquecidos são abortados após 1 dia por uma regra de lifecycle. |

```mermaid
sequenceDiagram
    participant C as Cliente (React)
    participant B as Backend (Lambda)
    participant S as Amazon S3

    C->>B: POST /initiate-mpu
    B->>S: CreateMultipartUpload
    S-->>B: uploadId
    B-->>C: key, uploadId, presigned URLs

    loop Para cada parte (em paralelo + retry)
        C->>S: PUT chunk (presigned URL)
        S-->>C: ETag
    end

    C->>B: POST /complete-mpu
    B->>S: CompleteMultipartUpload
    S-->>B: OK
    B-->>C: 200 OK

    Note over C,S: Em caso de falha, o cliente chama<br/>DELETE /abort-mpu para limpar as partes
```

## Stack

| Camada       | Tecnologias                                                                              |
| ------------ | --------------------------------------------------------------------------------------- |
| **Frontend** | React 19, Vite, TypeScript, Tailwind CSS, shadcn/ui, Base UI, Axios, Zod                 |
| **Backend**  | AWS Lambda (Node.js 24, arm64), Serverless Framework, AWS SDK v3, Zod                    |
| **Tooling**  | pnpm workspaces, Biome, Husky, lint-staged, commitlint (gitmoji)                         |

## Setup

### Pré-requisitos

- Node.js 24+
- pnpm 11+
- Conta AWS com credenciais configuradas (`aws configure`)

### 1. Instalar dependências

Na raiz do projeto (monorepo pnpm):

```bash
pnpm install
```

### 2. Deploy do backend

```bash
cd lambdas
pnpm serverless deploy
```

Ao final, o Serverless Framework exibe a **URL base da API** — guarde-a para o próximo passo.

### 3. Configurar e rodar o frontend

Crie o arquivo `front/.env` com a URL da API:

```env
VITE_API_URL=https://sua-api.execute-api.regiao.amazonaws.com
```

Inicie o servidor de desenvolvimento:

```bash
cd front
pnpm dev
```
