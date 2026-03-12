import { handlePredictRequest } from '../server/predict'

type ApiRequest = {
  method?: string
  body?: unknown
}

type ApiResponse = {
  setHeader: (name: string, value: string | string[]) => void
  status: (statusCode: number) => ApiResponse
  json: (body: unknown) => void
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  const result = await handlePredictRequest({
    method: req.method,
    body: req.body,
    apiKey: process.env.GEMINI_API_KEY,
  })

  if (result.headers) {
    for (const [name, value] of Object.entries(result.headers)) {
      res.setHeader(name, value)
    }
  }

  return res.status(result.status).json(result.body)
}
