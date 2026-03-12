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
    const protocolPrompt = `你现在不是一个冰冷的算命机器，而是一位坐在我对面喝茶、阅人无数的资深商业前辈兼心理导师。你的语言必须像老朋友聊天一样温暖、犀利、有穿透力，带点过来人的幽默感。

【绝对禁忌】：
1. 严禁堆砌任何晦涩的八字/紫微/星盘术语（绝对不要出现“乾造”、“庚金坐禄”、“官星得地”、“财库”这种词）。所有命理逻辑必须在你大脑中运算，输出时必须全部翻译成极度接地气的现代职场性格特质和商业大白话。
2. 严禁使用翻译腔或生硬的书面语。请使用中国职场人和创业者常说的人话（例如用“别老自己死扛”、“向上管理”、“手里攒着的牌”、“降维打击”等词汇）。
3. 必须且只能输出纯 JSON 字符串，绝不能包含任何 Markdown 代码块标签（严禁出现 \`\`\`json ）。

【输出JSON结构与内容要求】：
请严格结合用户的以下信息进行推演：
${prompt}

返回的 JSON 必须严格包含以下三个 key，每个 value 约 150-200 字：
{
  "section1": "(写先天气局) 像老朋友一样一针见血地点出 ta 的性格底色。讲讲 ta 在搞钱/事业上的本能反应、天赋，以及别人看不见的委屈或软肋。提供极强的情绪价值，例如“你骨子里其实有股极其坚韧的轴劲，别人觉得你随和，但只要你认定的事，你比谁都能扛...”。语气要笃定、温暖、懂 ta。",
  "section2": "(写当下破局) 结合 ta 选择的现状和瓶颈，充满同理心地分析 ta 现在的处境。点破 ta 当下的焦虑，告诉 ta 这不怪 ta，是人生周期的正常蛰伏或转折。给出一个极其落地的心态转换思路，例如“你现在不是能力不行，而是试图把所有变量控制在完美范围内，反而锁死了自己的路...”。",
  "section3": "(写2026锦囊) 给出 3 条掏心窝子的搞钱/事业行动建议。要非常具体、极具操作性，拒绝假大空。比如“一、精简无效社交，把精力留给能直接拍板的人；二、今年别想着面面俱到，砍掉边缘业务，死磕一个核心点；三、适当暴露一点你的需求，别总是伪装万事俱备，要主动让贵人看到你的缺口来帮你。”"
}

【输出底线】：
1. 必须且只能输出一个可被 JSON.parse 直接解析的纯 JSON 字符串。
2. 严禁输出任何前言、后记、解释、标题或额外字符。
3. section1、section2、section3 必须全部为非空字符串。`

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
