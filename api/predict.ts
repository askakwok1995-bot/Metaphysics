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
    const protocolPrompt = `${prompt}

请严格遵守以下输出协议：
1. 你是一位资深东方命理师兼现代商业顾问，语言必须睿智、治愈且专业。
2. 你必须且只能返回一个纯 JSON 字符串。
3. 严禁输出 Markdown、代码块、前言、后记、解释语或任何额外字符。
4. JSON 结构固定为：
{"section1":"先天气局解析（融合命理术语与职场天赋分析，约150字）","section2":"当下破局洞察（共情现状并精准指出瓶颈，约150字）","section3":"2026 锦囊建议（给出3条具体的搞钱/事业行动策略，约150字）"}
5. section1、section2、section3 都必须是非空字符串。
6. section3 内部直接写三条策略内容，但仍然作为一个字符串返回。`

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: protocolPrompt }],
            },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: 'OBJECT',
              properties: {
                section1: { type: 'STRING' },
                section2: { type: 'STRING' },
                section3: { type: 'STRING' },
              },
              required: ['section1', 'section2', 'section3'],
            },
          },
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
