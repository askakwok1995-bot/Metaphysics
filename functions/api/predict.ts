import { handlePredictRequest } from '../../server/predict'

type Env = {
  GEMINI_API_KEY?: string
}

type PagesContext = {
  request: Request
  env: Env
}

export async function onRequest(context: PagesContext) {
  const body = await context.request.text()
  const result = await handlePredictRequest({
    method: context.request.method,
    body,
    apiKey: context.env.GEMINI_API_KEY,
  })

  return Response.json(result.body, {
    status: result.status,
    headers: result.headers,
  })
}
