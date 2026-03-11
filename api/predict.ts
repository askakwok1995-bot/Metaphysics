type ApiRequest = {
  method?: string
  body?: unknown
}

type ApiResponse = {
  setHeader: (name: string, value: string | string[]) => void
  status: (statusCode: number) => ApiResponse
  json: (body: unknown) => void
}

function getPromptFromBody(body: unknown) {
  if (typeof body === 'string') {
    try {
      const parsed = JSON.parse(body) as { prompt?: unknown }
      return typeof parsed.prompt === 'string' ? parsed.prompt.trim() : ''
    } catch {
      return ''
    }
  }

  if (body && typeof body === 'object' && 'prompt' in body) {
    const prompt = (body as { prompt?: unknown }).prompt
    return typeof prompt === 'string' ? prompt.trim() : ''
  }

  return ''
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: { message: 'Method Not Allowed' } })
  }

  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    return res.status(500).json({ error: { message: 'Missing GEMINI_API_KEY' } })
  }

  const prompt = getPromptFromBody(req.body)

  if (!prompt) {
    return res.status(400).json({ error: { message: 'Prompt is required' } })
  }

  try {
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      },
    )

    const data = await geminiResponse.json()
    return res.status(geminiResponse.status).json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to reach Gemini API'
    return res.status(500).json({ error: { message } })
  }
}
