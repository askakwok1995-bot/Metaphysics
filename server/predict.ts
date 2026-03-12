export type PredictHandlerResult = {
  status: number
  headers?: Record<string, string>
  body: unknown
}

type PredictHandlerOptions = {
  method?: string
  body?: unknown
  apiKey?: string
  fetchImpl?: typeof fetch
}

export function getPromptFromBody(body: unknown) {
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

function buildProtocolPrompt(prompt: string) {
  return `你是一位深谙东方命理底层逻辑与现代商业战略的顶尖顾问。你的语言风格：客观、睿智、专业、不卑不亢。既有咨询师的严密逻辑，又有命理师的深邃洞察，不要过度套近乎，用词要精炼有力。

【核心推理逻辑（极其重要）】：
绝对不要像“填空题”一样直接复述或引用用户在测试题（q1-q4）中的选项！
用户的测试题答案仅仅是你大脑中用于诊断的“表象症状”。你必须将用户的“出生年月日时”作为核心算法，为其推导出一个极具个性化的“核心命局/商业天赋模型”（例如：谋局者、破阵将、守藏史等），然后将测试题的现状“无痕”地揉碎在这个核心模型中进行深度解释。要让用户觉得结论是基于他们独特的生辰推演出来的，而不是因为他们选了某个选项。

【绝对禁忌】：
1. 严禁出现“因为你选了xxx”、“你目前处于xxx状态”这种暴露测试题痕迹的句式。
2. 严禁堆砌晦涩难懂的古文术语（如乾造、偏印夺食等），你可以借用意象（如“金水相生”、“木火通明”），但必须立刻转化为商业管理或职场心理学的精准定义。
3. 必须且只能输出纯 JSON 字符串，绝不能包含任何 Markdown 标签（严禁出现 \`\`\`json ）。

【输出JSON结构与内容要求】：
请严格结合用户的以下信息进行推演：
${prompt}

返回的 JSON 必须严格包含以下三个 key，每个 value 约 150-200 字：
{
  "section1": "(先天气局) 结合其生辰，提炼一个专属的【商业命格/天赋原型】。以客观专业的视角，剖析其性格底色、资源禀赋以及天生的能力长板与暗礁。展现出极强的定制感与不可替代性。",
  "section2": "(当下破局) 隐去测试题痕迹，直接点出其当下面临的核心周期或困局本质。不要安慰，要用一针见血的商业或心理学视角，指出其思维盲区或资源错配的地方，给出清醒的诊断。",
  "section3": "(2026锦囊) 给出 3 条极具战略高度且可落地的破局建议。不仅要告诉ta怎么做，还要指出背后的逻辑。语言要干脆利落，像顶级咨询师给 CEO 的备忘录。"
}

【输出底线】：
1. 必须且只能输出一个可被 JSON.parse 直接解析的纯 JSON 字符串。
2. 严禁输出任何前言、后记、解释、标题或额外字符。
3. section1、section2、section3 必须全部为非空字符串。`
}

export async function handlePredictRequest({
  method,
  body,
  apiKey,
  fetchImpl = fetch,
}: PredictHandlerOptions): Promise<PredictHandlerResult> {
  if (method !== 'POST') {
    return {
      status: 405,
      headers: { Allow: 'POST' },
      body: { error: { message: 'Method Not Allowed' } },
    }
  }

  if (!apiKey) {
    return {
      status: 500,
      body: { error: { message: 'Missing GEMINI_API_KEY' } },
    }
  }

  const prompt = getPromptFromBody(body)

  if (!prompt) {
    return {
      status: 400,
      body: { error: { message: 'Prompt is required' } },
    }
  }

  try {
    const geminiResponse = await fetchImpl(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: buildProtocolPrompt(prompt) }],
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

    const data = (await geminiResponse.json()) as unknown

    return {
      status: geminiResponse.status,
      body: data,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to reach Gemini API'

    return {
      status: 500,
      body: { error: { message } },
    }
  }
}
