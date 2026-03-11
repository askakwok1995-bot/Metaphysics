import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  ChevronLeft,
  Coins,
  Heart,
  Lock,
  Sparkles,
  Stars,
  type LucideIcon,
  Users,
} from 'lucide-react'

type View = 'home' | 'input' | 'quiz' | 'processing' | 'result'
type Step = 1 | 2 | 3
type Gender = '' | '乾' | '坤'
type CalendarMode = 'solar' | 'lunar'
type LunarMonthType = 'regular' | 'leap'
type SelectOption = { value: string; label: string }
type UserAnswers = Record<string, string>
type BasicInfo = {
  name: string
  gender: Gender
  calendarMode: CalendarMode
  lunarMonthType: LunarMonthType | null
  birthDate: string
  birthTime: string
}

type QuizQuestion = {
  id: string
  title: string
  options: string[]
  type?: 'default' | 'energy-card'
}

type InsightCard = {
  icon: LucideIcon
  title: string
  subtitle: string
  highlighted?: boolean
  clickable?: boolean
}

type EnergyCardTheme = {
  orb: string
  core: string
  borderHover: string
  borderSelected: string
}

const cards: InsightCard[] = [
  {
    icon: Coins,
    title: '搞钱搞事业',
    subtitle: '财富格局与职场破局',
    highlighted: true,
    clickable: true,
  },
  {
    icon: Heart,
    title: '看桃花正缘',
    subtitle: '情感走向与正缘指引',
  },
  {
    icon: Users,
    title: '看人际社交',
    subtitle: '贵人方位与小人规避',
  },
  {
    icon: Sparkles,
    title: '看身心健康',
    subtitle: '能量场清理与疗愈',
  },
]

const questions: QuizQuestion[] = [
  {
    id: 'q1',
    title: '目前的职场状态，你更偏向哪一种？',
    options: ['处于瓶颈渴望突破', '准备转换跑道', '创业独立搞钱', '随遇而安'],
  },
  {
    id: 'q2',
    title: '凭借直觉，选一张最吸引你的能量场。',
    type: 'energy-card',
    options: ['赤炎冲劲 (突破)', '深海静谧 (深思)', '磐石沉稳 (积累)', '流风空灵 (灵活)'],
  },
  {
    id: 'q3',
    title: '面对业务目标或搞钱机会，你的行动风格是？',
    options: ['单打独斗，冲在最前线', '擅长借力，整合资源做局', '稳扎稳打，死磕细节', '灵活应变，敏锐察觉风向'],
  },
  {
    id: 'q4',
    title: '你觉得目前阻碍你财富进阶的最大瓶颈是？',
    options: ['平台或行业的天花板', '个人能力亟待突破', '万事俱备，只欠东风(贵人)', '精力分散，回报不成正比'],
  },
]

const processingSteps = [
  '正在排布先天命局与四柱八字...',
  '正在感应您当下的职场能量场...',
  '正在解析2026事业宫位与财运流转...',
  'AI 命理师正在生成您的专属破局锦囊...',
]

const energyCardThemes: EnergyCardTheme[] = [
  {
    orb: 'radial-gradient(circle, rgba(225,29,72,0.45) 0%, rgba(225,29,72,0) 70%)',
    core: 'rgba(251,113,133,0.8)',
    borderHover: 'group-hover:border-rose-400/30',
    borderSelected: 'border-rose-400/40 shadow-[0_0_30px_rgba(225,29,72,0.15)]',
  },
  {
    orb: 'radial-gradient(circle, rgba(37,99,235,0.45) 0%, rgba(37,99,235,0) 70%)',
    core: 'rgba(96,165,250,0.8)',
    borderHover: 'group-hover:border-blue-400/30',
    borderSelected: 'border-blue-400/40 shadow-[0_0_30px_rgba(37,99,235,0.15)]',
  },
  {
    orb: 'radial-gradient(circle, rgba(217,119,6,0.45) 0%, rgba(217,119,6,0) 70%)',
    core: 'rgba(251,191,36,0.8)',
    borderHover: 'group-hover:border-amber-400/30',
    borderSelected: 'border-amber-400/40 shadow-[0_0_30px_rgba(217,119,6,0.15)]',
  },
  {
    orb: 'radial-gradient(circle, rgba(13,148,136,0.45) 0%, rgba(13,148,136,0) 70%)',
    core: 'rgba(45,212,191,0.8)',
    borderHover: 'group-hover:border-teal-400/30',
    borderSelected: 'border-teal-400/40 shadow-[0_0_30px_rgba(13,148,136,0.15)]',
  },
]

const backgroundBlobs = [
  {
    className:
      'left-[-22%] top-[-8%] h-[18rem] w-[18rem] bg-[radial-gradient(circle,rgba(109,40,217,0.11)_0%,rgba(109,40,217,0.04)_35%,rgba(0,0,0,0)_72%)] sm:h-[26rem] sm:w-[26rem]',
    animate: { x: [0, 38, -16, 0], y: [0, 26, 42, 0], scale: [1, 1.12, 0.96, 1] },
    duration: 38,
  },
  {
    className:
      'right-[-24%] top-[10%] h-[16rem] w-[16rem] bg-[radial-gradient(circle,rgba(217,119,6,0.12)_0%,rgba(217,119,6,0.04)_34%,rgba(0,0,0,0)_72%)] sm:h-[24rem] sm:w-[24rem]',
    animate: { x: [0, -34, -12, 0], y: [0, 24, -20, 0], scale: [1, 1.08, 0.94, 1] },
    duration: 34,
  },
  {
    className:
      'left-[12%] bottom-[-10%] h-[17rem] w-[17rem] bg-[radial-gradient(circle,rgba(30,64,175,0.1)_0%,rgba(30,64,175,0.04)_38%,rgba(0,0,0,0)_72%)] sm:h-[23rem] sm:w-[23rem]',
    animate: { x: [0, 20, -10, 0], y: [0, -28, -10, 0], scale: [1, 0.94, 1.08, 1] },
    duration: 36,
  },
  {
    className:
      'right-[6%] bottom-[-14%] h-[14rem] w-[14rem] bg-[radial-gradient(circle,rgba(192,132,252,0.08)_0%,rgba(192,132,252,0.03)_40%,rgba(0,0,0,0)_74%)] sm:h-[19rem] sm:w-[19rem]',
    animate: { x: [0, -18, 14, 0], y: [0, -18, 22, 0], scale: [1, 1.1, 0.97, 1] },
    duration: 40,
  },
]

const transitionMotes = [
  { left: '12%', top: '16%', size: 6, duration: 10, delay: 0.2 },
  { left: '28%', top: '48%', size: 4, duration: 12, delay: 1.8 },
  { left: '49%', top: '22%', size: 5, duration: 11, delay: 0.9 },
  { left: '66%', top: '54%', size: 3, duration: 9.5, delay: 2.4 },
  { left: '82%', top: '28%', size: 5, duration: 13, delay: 1.1 },
]

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.12,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
}

const viewTransition = {
  duration: 0.55,
  ease: [0.22, 1, 0.36, 1] as const,
}

const currentYear = new Date().getFullYear()
const yearOptions: SelectOption[] = Array.from({ length: 90 }, (_, index) => {
  const year = String(currentYear - index)
  return { value: year, label: `${year} 年` }
})

const monthOptions: SelectOption[] = Array.from({ length: 12 }, (_, index) => {
  const month = String(index + 1).padStart(2, '0')
  return { value: month, label: `${month} 月` }
})

const hourOptions: SelectOption[] = Array.from({ length: 24 }, (_, index) => {
  const hour = String(index).padStart(2, '0')
  return { value: hour, label: `${hour} 时` }
})

const minuteOptions: SelectOption[] = Array.from({ length: 60 }, (_, index) => {
  const minute = String(index).padStart(2, '0')
  return { value: minute, label: `${minute} 分` }
})

function buildReportPrompt(basicInfo: BasicInfo, userAnswers: UserAnswers) {
  return `【系统提示】你是一位精通东方命理与现代商业心理学的顾问，擅长将命局结构、流年变化与商业决策结合，输出兼具神秘感与可执行性的洞察。
【用户数据】姓名:${basicInfo.name || '未命名'}, 状态:${userAnswers.q1 || '未知'}, 能量:${userAnswers.q2 || '未知'}, 行动风格:${userAnswers.q3 || '未知'}, 瓶颈:${userAnswers.q4 || '未知'}, 性别:${basicInfo.gender || '未知'}, 历法:${basicInfo.calendarMode}, 出生日期:${basicInfo.birthDate}, 出生时刻:${basicInfo.birthTime}。
请按 ## 先天气局、## 当下破局、## 2026锦囊 输出。`
}

function buildMockReport(basicInfo: BasicInfo, userAnswers: UserAnswers) {
  return `## 先天气局
${basicInfo.name || '旅人'}，你的命局中潜藏着极强的能量。你在潜意识中被“${userAnswers.q2 || '某种神秘能量'}”吸引，这暗示了你天生具备打破常规的直觉力。
## 当下破局
你目前正处于“${userAnswers.q1 || '探索期'}”的状态，并且你察觉到最大的卡点在于“${userAnswers.q4 || '目前的局限'}”。不要焦虑，这并非你能力不足，而是流年能量的正常蛰伏。
## 2026 锦囊
面对未来的财富机会，请继续保持你“${userAnswers.q3 || '独特'}”的行动风格。今年你的财帛宫有异动，建议顺势而为，积蓄力量，属于你的旷野即将展开。`
}

function parseReportSections(report: string) {
  return report
    .split('## ')
    .map((section) => section.trim())
    .filter(Boolean)
    .map((section) => {
      const [title, ...contentLines] = section.split('\n')
      return {
        title: title.trim(),
        content: contentLines.join('\n').trim(),
      }
    })
}

function getDayOptions(year: string, month: string, calendarMode: CalendarMode): SelectOption[] {
  if (!year || !month) return []

  const daysInMonth =
    calendarMode === 'lunar' ? 30 : new Date(Number(year), Number(month), 0).getDate()

  return Array.from({ length: daysInMonth }, (_, index) => {
    const day = String(index + 1).padStart(2, '0')
    return { value: day, label: `${day} 日` }
  })
}

function RitualSelect({
  value,
  onChange,
  placeholder,
  options,
  className = '',
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
  options: SelectOption[]
  className?: string
}) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full appearance-none rounded-2xl border border-white/[0.08] bg-black/20 px-4 py-3.5 text-sm tracking-[0.06em] text-zinc-200 outline-none transition focus:border-amber-400/40 focus:bg-white/[0.04]"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
    </div>
  )
}

function BackgroundLayer() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#050505_0%,#070709_45%,#040404_100%)]" />
      {backgroundBlobs.map((blob) => (
        <motion.div
          key={blob.className}
          className={`absolute rounded-full blur-3xl ${blob.className}`}
          animate={blob.animate}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
          }}
        />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.025),transparent_28%),radial-gradient(circle_at_50%_120%,rgba(251,191,36,0.04),transparent_32%)]" />
    </div>
  )
}

function SectionBridge() {
  return (
    <motion.div className="relative mt-8 h-14 w-full sm:mt-10" variants={itemVariants} aria-hidden="true">
      <motion.div
        className="absolute left-1/2 top-1/2 h-16 w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.08)_0%,rgba(124,58,237,0.05)_34%,rgba(0,0,0,0)_74%)] blur-3xl"
        animate={{
          opacity: [0.28, 0.42, 0.28],
          scale: [0.96, 1.04, 0.96],
        }}
        transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-px w-[58%] -translate-x-1/2 -translate-y-1/2 bg-[linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,0.16),rgba(255,255,255,0))]"
        animate={{ opacity: [0.12, 0.24, 0.12], scaleX: [0.94, 1.02, 0.94] }}
        transition={{ duration: 7.2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {transitionMotes.map((mote, index) => (
        <motion.span
          key={`${mote.left}-${mote.top}`}
          className="absolute rounded-full bg-[radial-gradient(circle,rgba(255,243,214,0.9)_0%,rgba(255,243,214,0.24)_38%,rgba(255,243,214,0)_78%)] blur-[1px]"
          style={{
            left: mote.left,
            top: mote.top,
            width: mote.size,
            height: mote.size,
          }}
          animate={{
            y: [0, -8 - index * 2, 0],
            x: [0, index % 2 === 0 ? 5 : -5, 0],
            opacity: [0, 0.45, 0],
            scale: [0.85, 1.15, 0.9],
          }}
          transition={{
            duration: mote.duration,
            delay: mote.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </motion.div>
  )
}

function HomeView({ onOpenInput }: { onOpenInput: () => void }) {
  return (
    <motion.section
      key="home"
      className="safe-shell relative z-10 mx-auto flex min-h-[100svh] w-full max-w-2xl flex-col justify-center px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={viewTransition}
    >
      <motion.div className="mx-auto w-full" initial="hidden" animate="show" variants={containerVariants}>
        <motion.div
          className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-[10px] uppercase tracking-[0.28em] text-zinc-400/90 backdrop-blur-md"
          variants={itemVariants}
        >
          <Stars className="h-3.5 w-3.5 text-amber-200/75" />
          AI 命理与疗愈
        </motion.div>

        <motion.div className="mt-7" variants={itemVariants}>
          <motion.h1
            className="text-[2.25rem] font-semibold leading-[1.08] tracking-[0.12em] text-transparent sm:text-[3.25rem]"
            style={{
              fontFamily:
                "'Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', 'Songti SC', 'STSong', serif",
              backgroundImage:
                'linear-gradient(110deg, rgba(247,233,198,0.94) 0%, rgba(245,196,118,0.86) 24%, rgba(255,245,224,0.96) 42%, rgba(163,114,35,0.85) 67%, rgba(246,225,178,0.92) 100%)',
              backgroundSize: '220% 100%',
              WebkitBackgroundClip: 'text',
            }}
          >
            <motion.span
              className="inline-block"
              animate={{
                opacity: [0.88, 1, 0.88],
                y: [0, -4, 0],
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                textShadow: [
                  '0 0 12px rgba(245, 196, 118, 0.08)',
                  '0 0 20px rgba(245, 196, 118, 0.16)',
                  '0 0 12px rgba(245, 196, 118, 0.08)',
                ],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                backgroundImage:
                  'linear-gradient(110deg, rgba(247,233,198,0.94) 0%, rgba(245,196,118,0.86) 24%, rgba(255,245,224,0.96) 42%, rgba(163,114,35,0.85) 67%, rgba(246,225,178,0.92) 100%)',
                backgroundSize: '220% 100%',
                WebkitBackgroundClip: 'text',
              }}
            >
              解开你的命运齿轮
            </motion.span>
          </motion.h1>
        </motion.div>

        <motion.p
          className="mt-5 max-w-[18.5rem] text-[12.5px] font-light leading-6 tracking-[0.12em] text-zinc-500/88 sm:max-w-[28rem] sm:text-[14px]"
          variants={itemVariants}
          animate={{
            opacity: [0.7, 0.88, 0.7],
            y: [0, -1.5, 0],
          }}
          transition={{
            duration: 9.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          万物皆有裂痕，那是光照进来的地方。今天，你想解开什么心结？
        </motion.p>

        <SectionBridge />

        <motion.div className="relative mt-2 flex flex-col gap-3 sm:gap-4" variants={containerVariants}>
          <motion.div
            className="pointer-events-none absolute left-1/2 top-0 h-28 w-[88%] -translate-x-1/2 -translate-y-8 rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.11)_0%,rgba(251,191,36,0.04)_36%,rgba(0,0,0,0)_76%)] blur-3xl"
            animate={{
              opacity: [0.24, 0.38, 0.24],
              scale: [0.98, 1.03, 0.98],
            }}
            transition={{ duration: 8.8, repeat: Infinity, ease: 'easeInOut' }}
          />

          {cards.map((card) => {
            const Icon = card.icon
            const commonClassName =
              'group relative w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-4 text-left backdrop-blur-[22px] transition-all sm:px-5 sm:py-5'

            const stateClassName = card.highlighted
              ? 'shadow-[0_0_0_1px_rgba(253,230,138,0.05),0_18px_40px_rgba(120,86,35,0.16),0_0_36px_rgba(251,191,36,0.12)]'
              : 'opacity-20 saturate-[0.7]'

            const content = (
              <>
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.018)_34%,rgba(255,255,255,0.01)_100%)]" />
                <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />
                <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]" />

                {card.highlighted ? (
                  <>
                    <motion.div
                      className="absolute -inset-[1px] rounded-2xl"
                      animate={{
                        boxShadow: [
                          '0 0 0 1px rgba(251,191,36,0.08), 0 0 20px rgba(251,191,36,0.08)',
                          '0 0 0 1px rgba(251,191,36,0.14), 0 0 30px rgba(251,191,36,0.14)',
                          '0 0 0 1px rgba(251,191,36,0.08), 0 0 20px rgba(251,191,36,0.08)',
                        ],
                      }}
                      transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.div
                      className="absolute inset-y-2 left-0 w-20 bg-[linear-gradient(90deg,rgba(251,191,36,0.18),rgba(251,191,36,0))] blur-xl"
                      animate={{ x: ['-40%', '130%'] }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  </>
                ) : null}

                <div className="relative flex items-center gap-4">
                  <motion.div
                    className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                      card.highlighted
                        ? 'border-amber-200/16 bg-amber-100/[0.04] text-amber-200'
                        : 'border-white/8 bg-white/[0.02] text-zinc-300'
                    }`}
                    animate={
                      card.highlighted
                        ? {
                            boxShadow: [
                              '0 0 14px rgba(251,191,36,0.10)',
                              '0 0 24px rgba(251,191,36,0.18)',
                              '0 0 14px rgba(251,191,36,0.10)',
                            ],
                          }
                        : {
                            boxShadow: [
                              '0 0 10px rgba(148,163,184,0.04)',
                              '0 0 16px rgba(148,163,184,0.07)',
                              '0 0 10px rgba(148,163,184,0.04)',
                            ],
                          }
                    }
                    transition={{
                      duration: card.highlighted ? 4.8 : 7,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <motion.span
                      className={`pointer-events-none absolute inset-0 rounded-[inherit] ${
                        card.highlighted
                          ? 'bg-[radial-gradient(circle_at_50%_36%,rgba(251,191,36,0.18),rgba(251,191,36,0.05)_36%,rgba(251,191,36,0)_76%)]'
                          : 'bg-[radial-gradient(circle_at_50%_36%,rgba(226,232,240,0.10),rgba(226,232,240,0.03)_36%,rgba(226,232,240,0)_76%)]'
                      }`}
                      animate={
                        card.highlighted
                          ? {
                              opacity: [0.48, 0.82, 0.48],
                              scale: [0.92, 1.06, 0.92],
                            }
                          : {
                              opacity: [0.18, 0.3, 0.18],
                              scale: [0.96, 1.02, 0.96],
                            }
                      }
                      transition={{
                        duration: card.highlighted ? 5.2 : 8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                    <motion.span
                      className={`pointer-events-none absolute left-1/2 top-1/2 h-7 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full blur-md ${
                        card.highlighted ? 'bg-amber-200/20' : 'bg-slate-200/8'
                      }`}
                      animate={
                        card.highlighted
                          ? {
                              opacity: [0.2, 0.44, 0.2],
                              scaleY: [0.9, 1.18, 0.9],
                            }
                          : {
                              opacity: [0.08, 0.16, 0.08],
                              scaleY: [0.95, 1.06, 0.95],
                            }
                      }
                      transition={{
                        duration: card.highlighted ? 4.6 : 7.6,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                    <Icon className="h-5 w-5" strokeWidth={1.7} />
                  </motion.div>

                  <div className="min-w-0 flex-1">
                    <div
                      className={`text-[17px] font-medium tracking-[0.04em] ${
                        card.highlighted ? 'text-amber-200' : 'text-zinc-100'
                      }`}
                    >
                      {card.title}
                    </div>
                    <p className="mt-1 text-[12px] leading-5 tracking-[0.04em] text-zinc-400">{card.subtitle}</p>
                  </div>

                  {card.clickable ? (
                    <motion.div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-amber-200/12 bg-amber-100/[0.04]"
                      animate={{
                        boxShadow: [
                          '0 0 12px rgba(251,191,36,0.08)',
                          '0 0 18px rgba(251,191,36,0.16)',
                          '0 0 12px rgba(251,191,36,0.08)',
                        ],
                      }}
                      transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-amber-200/90 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </motion.div>
                  ) : (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/6 bg-white/[0.015]">
                      <Lock className="h-3.5 w-3.5 text-zinc-400/45" strokeWidth={1.7} />
                    </div>
                  )}
                </div>
              </>
            )

            if (card.clickable) {
              return (
                <motion.button
                  key={card.title}
                  type="button"
                  className={`${commonClassName} ${stateClassName}`}
                  variants={itemVariants}
                  whileHover={{
                    y: -2,
                    scale: 1.01,
                  }}
                  whileTap={{ scale: 0.985 }}
                  onClick={onOpenInput}
                >
                  {content}
                </motion.button>
              )
            }

            return (
              <motion.div key={card.title} className={`${commonClassName} ${stateClassName}`} variants={itemVariants}>
                {content}
              </motion.div>
            )
          })}
        </motion.div>
      </motion.div>
    </motion.section>
  )
}

type InputViewProps = {
  step: Step
  name: string
  nameError: string
  gender: Gender
  calendarMode: CalendarMode
  lunarMonthType: LunarMonthType
  birthYear: string
  birthMonth: string
  birthDay: string
  birthHour: string
  birthMinute: string
  birthError: string
  onBackHome: () => void
  onBackStep: () => void
  onNameChange: (value: string) => void
  onNextFromName: () => void
  onGenderSelect: (value: Gender) => void
  onCalendarModeChange: (value: CalendarMode) => void
  onLunarMonthTypeChange: (value: LunarMonthType) => void
  onBirthYearChange: (value: string) => void
  onBirthMonthChange: (value: string) => void
  onBirthDayChange: (value: string) => void
  onBirthHourChange: (value: string) => void
  onBirthMinuteChange: (value: string) => void
  onSubmit: () => void
}

function InputView({
  step,
  name,
  nameError,
  gender,
  calendarMode,
  lunarMonthType,
  birthYear,
  birthMonth,
  birthDay,
  birthHour,
  birthMinute,
  birthError,
  onBackHome,
  onBackStep,
  onNameChange,
  onNextFromName,
  onGenderSelect,
  onCalendarModeChange,
  onLunarMonthTypeChange,
  onBirthYearChange,
  onBirthMonthChange,
  onBirthDayChange,
  onBirthHourChange,
  onBirthMinuteChange,
  onSubmit,
}: InputViewProps) {
  const isNameReady = name.trim().length > 0
  const dayOptions = getDayOptions(birthYear, birthMonth, calendarMode)
  const isBirthReady =
    birthYear !== '' &&
    birthMonth !== '' &&
    birthDay !== '' &&
    birthHour !== '' &&
    birthMinute !== ''

  return (
    <motion.section
      key="input"
      className="safe-shell relative z-10 mx-auto flex min-h-[100svh] w-full max-w-xl flex-col justify-center px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={viewTransition}
    >
      <motion.div
        className="mx-auto w-full"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={viewTransition}
      >
        <div className="mb-6 flex items-center justify-between">
          <motion.button
            type="button"
            onClick={onBackHome}
            whileTap={{ scale: 0.95 }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/8 bg-white/[0.03] text-zinc-300 backdrop-blur-md"
          >
            <ArrowLeft className="h-4 w-4" />
          </motion.button>

          <div className="text-[10px] uppercase tracking-[0.32em] text-zinc-500">
            Step {step} / 3
          </div>
        </div>

        <motion.div
          className="overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.03] px-5 py-6 backdrop-blur-[26px] shadow-[0_14px_40px_rgba(0,0,0,0.24),inset_0_1px_0_rgba(255,255,255,0.05)]"
          initial="hidden"
          animate="show"
          variants={containerVariants}
        >
          <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/14 to-transparent" />

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={viewTransition}
                className="space-y-8"
              >
                <div className="space-y-3">
                  <div className="text-[10px] uppercase tracking-[0.34em] text-zinc-500">命理根基采集</div>
                  <h2
                    className="text-[1.7rem] font-semibold leading-tight text-zinc-100"
                    style={{
                      fontFamily:
                        "'Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', 'Songti SC', 'STSong', serif",
                    }}
                  >
                    如何称呼您？
                  </h2>
                  <p className="text-[12.5px] leading-6 tracking-[0.08em] text-zinc-500">
                    一个名字，足以让能量开始辨认您的频率。
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="mx-auto w-full max-w-[13.5rem]">
                    <input
                      value={name}
                      onChange={(event) => onNameChange(event.target.value)}
                      placeholder="请输入您的姓名"
                      className="w-full border-b border-white/12 bg-transparent pb-4 text-center text-[1.45rem] tracking-[0.12em] text-zinc-100 placeholder:text-zinc-600 focus:border-amber-200/55 focus:outline-none caret-amber-200"
                    />
                  </div>
                  <div className="min-h-[1.25rem] text-center text-[11px] tracking-[0.08em] text-amber-200/70">
                    {nameError}
                  </div>

                  <motion.button
                    type="button"
                    onClick={onNextFromName}
                    disabled={!isNameReady}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3.5 text-sm tracking-[0.16em] text-amber-200 transition disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    下一步
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </div>
              </motion.div>
            ) : null}

            {step === 2 ? (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={viewTransition}
                className="space-y-8"
              >
                <div className="space-y-3">
                  <div className="text-[10px] uppercase tracking-[0.34em] text-zinc-500">命理根基采集</div>
                  <h2
                    className="text-[1.7rem] font-semibold leading-tight text-zinc-100"
                    style={{
                      fontFamily:
                        "'Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', 'Songti SC', 'STSong', serif",
                    }}
                  >
                    您的命理阴阳属性？
                  </h2>
                  <p className="text-[12.5px] leading-6 tracking-[0.08em] text-zinc-500">
                    轻触其一，命盘会自动切换到对应的解析轨迹。
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {([
                    ['乾', '男'],
                    ['坤', '女'],
                  ] as const).map(([value, label]) => {
                    const selected = gender === value

                    return (
                      <motion.button
                        key={value}
                        type="button"
                        onClick={() => onGenderSelect(value)}
                        whileTap={{ scale: 0.95 }}
                        className={`relative overflow-hidden rounded-2xl border px-4 py-5 text-left backdrop-blur-xl transition ${
                          selected
                            ? 'border-amber-300/40 bg-amber-500/10 shadow-[0_0_0_1px_rgba(251,191,36,0.10),0_0_30px_rgba(251,191,36,0.12)]'
                            : 'border-white/[0.08] bg-white/[0.03]'
                        }`}
                      >
                        {selected ? (
                          <motion.div
                            className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.12),rgba(251,191,36,0)_70%)]"
                            animate={{ opacity: [0.35, 0.7, 0.35] }}
                            transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
                          />
                        ) : null}
                        <div className="relative">
                          <div className="text-[1.4rem] font-semibold tracking-[0.12em] text-zinc-100">{value}</div>
                          <div className="mt-2 text-[12px] tracking-[0.16em] text-zinc-400">{label}</div>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>
            ) : null}

            {step === 3 ? (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={viewTransition}
                className="space-y-8"
              >
                <div className="space-y-3">
                  <div className="text-[10px] uppercase tracking-[0.34em] text-zinc-500">命理根基采集</div>
                  <h2
                    className="text-[1.7rem] font-semibold leading-tight text-zinc-100"
                    style={{
                      fontFamily:
                        "'Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', 'Songti SC', 'STSong', serif",
                    }}
                  >
                    您降临世间的时刻？
                  </h2>
                  <p className="text-[12.5px] leading-6 tracking-[0.08em] text-zinc-500">
                    时间越准确，能量感应就越清晰。
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.28em] text-zinc-500">历法方式</label>
                    <div className="grid grid-cols-2 gap-2">
                      {([
                        ['solar', '公历'],
                        ['lunar', '农历'],
                      ] as const).map(([value, label]) => {
                        const selected = calendarMode === value

                        return (
                          <motion.button
                            key={value}
                            type="button"
                            onClick={() => onCalendarModeChange(value)}
                            whileTap={{ scale: 0.95 }}
                            className={`rounded-2xl border px-4 py-3 text-sm tracking-[0.12em] transition ${
                              selected
                                ? 'border-amber-300/30 bg-amber-500/10 text-amber-200 shadow-[0_0_0_1px_rgba(251,191,36,0.08)]'
                                : 'border-white/[0.08] bg-white/[0.03] text-zinc-300'
                            }`}
                          >
                            {label}
                          </motion.button>
                        )
                      })}
                    </div>
                  </div>

                  {calendarMode === 'lunar' ? (
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.28em] text-zinc-500">农历月别</label>
                      <div className="grid grid-cols-2 gap-2">
                        {([
                          ['regular', '平月'],
                          ['leap', '闰月'],
                        ] as const).map(([value, label]) => {
                          const selected = lunarMonthType === value

                          return (
                            <motion.button
                              key={value}
                              type="button"
                              onClick={() => onLunarMonthTypeChange(value)}
                              whileTap={{ scale: 0.95 }}
                              className={`rounded-2xl border px-4 py-3 text-sm tracking-[0.12em] transition ${
                                selected
                                  ? 'border-amber-300/30 bg-amber-500/10 text-amber-200 shadow-[0_0_0_1px_rgba(251,191,36,0.08)]'
                                  : 'border-white/[0.08] bg-white/[0.03] text-zinc-300'
                              }`}
                            >
                              {label}
                            </motion.button>
                          )
                        })}
                      </div>
                    </div>
                  ) : null}

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.28em] text-zinc-500">
                      {calendarMode === 'solar' ? '出生日期' : '农历日期'}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <RitualSelect
                        value={birthYear}
                        onChange={onBirthYearChange}
                        placeholder="年份"
                        options={yearOptions}
                      />
                      <RitualSelect
                        value={birthMonth}
                        onChange={onBirthMonthChange}
                        placeholder="月份"
                        options={monthOptions}
                      />
                      <RitualSelect
                        value={birthDay}
                        onChange={onBirthDayChange}
                        placeholder="日期"
                        options={dayOptions}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.28em] text-zinc-500">出生时刻</label>
                    <div className="grid grid-cols-2 gap-2">
                      <RitualSelect
                        value={birthHour}
                        onChange={onBirthHourChange}
                        placeholder="时辰"
                        options={hourOptions}
                      />
                      <RitualSelect
                        value={birthMinute}
                        onChange={onBirthMinuteChange}
                        placeholder="分钟"
                        options={minuteOptions}
                      />
                    </div>
                  </div>
                </div>

                <div className="min-h-[1.25rem] text-[11px] tracking-[0.08em] text-amber-200/70">
                  {birthError}
                </div>

                <motion.button
                  type="button"
                  onClick={onSubmit}
                  disabled={!isBirthReady}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    boxShadow: isBirthReady
                      ? [
                          '0 0 0 rgba(251,191,36,0)',
                          '0 0 24px rgba(251,191,36,0.12)',
                          '0 0 0 rgba(251,191,36,0)',
                        ]
                      : '0 0 0 rgba(251,191,36,0)',
                  }}
                  transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3.5 text-sm tracking-[0.16em] text-amber-200 transition disabled:cursor-not-allowed disabled:opacity-35"
                >
                  开启能量感应
                  <Sparkles className="h-4 w-4" />
                </motion.button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>

        {step > 1 ? (
          <motion.button
            type="button"
            onClick={onBackStep}
            whileTap={{ scale: 0.95 }}
            className="mt-4 inline-flex items-center gap-1 text-[12px] tracking-[0.12em] text-zinc-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            上一步
          </motion.button>
        ) : null}
      </motion.div>
    </motion.section>
  )
}

function EnergyCardAura({
  index,
  selected,
  theme,
}: {
  index: number
  selected: boolean
  theme: EnergyCardTheme
}) {
  if (index === 0) {
    return (
      <>
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 68%, rgba(225,29,72,0.16) 0%, rgba(225,29,72,0.07) 34%, rgba(225,29,72,0) 74%), linear-gradient(180deg, rgba(249,115,22,0) 0%, rgba(249,115,22,0.04) 48%, rgba(225,29,72,0.08) 100%)',
          }}
          animate={{
            opacity: selected ? [0.24, 0.48, 0.32, 0.24] : [0.1, 0.24, 0.14, 0.1],
            scale: selected ? [0.98, 1.03, 1, 0.98] : [0.98, 1.01, 0.99, 0.98],
          }}
          transition={{ duration: 5.8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute inset-x-[-18%] bottom-[-8%] top-[6%] rounded-[44%] blur-[40px]"
          style={{
            background:
              'radial-gradient(ellipse at 50% 62%, rgba(225,29,72,0.52) 0%, rgba(251,113,133,0.28) 24%, rgba(249,115,22,0.12) 44%, rgba(0,0,0,0) 76%)',
          }}
          animate={{
            scale: selected ? [0.98, 1.08, 1.02, 0.98] : [0.94, 1.02, 0.96, 0.94],
            opacity: selected ? [0.42, 0.8, 0.62, 0.42] : [0.18, 0.42, 0.28, 0.18],
            y: selected ? [6, -12, -2, 6] : [3, -5, -1, 3],
            x: selected ? [0, -5, 2, 0] : [0, -2, 1, 0],
          }}
          transition={{ duration: 6.1, repeat: Infinity, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.div
          className="absolute left-1/2 top-[21%] h-34 w-24 -translate-x-1/2 -translate-y-1/2 rotate-[-8deg] rounded-full blur-[18px]"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,241,242,0.18) 0%, rgba(251,113,133,0.18) 34%, rgba(251,113,133,0) 100%)',
          }}
          animate={{
            opacity: selected ? [0.1, 0.34, 0.18, 0.1] : [0.04, 0.18, 0.08, 0.04],
            y: selected ? [0, -12, -4, 0] : [0, -6, -2, 0],
            scaleY: selected ? [0.9, 1.18, 0.98, 0.9] : [0.94, 1.04, 0.96, 0.94],
          }}
          transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute inset-x-[2%] top-[34%] h-32 rounded-full blur-[30px]"
          style={{ background: theme.orb }}
          animate={{
            opacity: selected ? [0.18, 0.42, 0.18] : [0.08, 0.22, 0.08],
            scaleX: selected ? [0.9, 1.18, 0.9] : [0.84, 1.04, 0.84],
            y: selected ? [3, -4, 3] : [1, -1, 1],
            x: selected ? [0, -4, 2, 0] : [0, -2, 1, 0],
          }}
          transition={{ duration: 4.9, repeat: Infinity, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.div
          className="absolute left-1/2 top-[34%] h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[15px]"
          style={{ backgroundColor: theme.core }}
          animate={{
            scale: selected ? [0.86, 1.5, 0.9] : [0.72, 1.08, 0.74],
            opacity: selected ? [0.72, 1, 0.78] : [0.3, 0.62, 0.34],
          }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        />
        {[
          { left: '55%', top: '20%', delay: 0.2 },
          { left: '38%', top: '30%', delay: 1 },
          { left: '62%', top: '28%', delay: 1.6 },
        ].map((spark) => (
          <motion.span
            key={`${spark.left}-${spark.top}`}
            className="absolute h-1.5 w-1.5 rounded-full bg-rose-50/80 blur-[1px]"
            style={{ left: spark.left, top: spark.top }}
            animate={{
              opacity: selected ? [0.05, 0.36, 0.05] : [0.02, 0.16, 0.02],
              y: selected ? [6, -8, 6] : [4, -4, 4],
              x: selected ? [0, -4, 0] : [0, -2, 0],
              scale: selected ? [0.8, 1.4, 0.8] : [0.72, 1.04, 0.72],
            }}
            transition={{
              duration: 2.6,
              delay: spark.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </>
    )
  }

  if (index === 1) {
    return (
      <>
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 40%, rgba(37,99,235,0.14) 0%, rgba(37,99,235,0.08) 30%, rgba(37,99,235,0.03) 50%, rgba(0,0,0,0) 74%), linear-gradient(180deg, rgba(59,130,246,0.02) 0%, rgba(59,130,246,0.05) 42%, rgba(15,23,42,0) 100%)',
          }}
          animate={{
            opacity: selected ? [0.16, 0.34, 0.2, 0.16] : [0.08, 0.18, 0.1, 0.08],
            y: selected ? [0, 6, 2, 0] : [0, 3, 1, 0],
          }}
          transition={{ duration: 6.8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute inset-[-12%] rounded-[46%] blur-[42px]"
          style={{
            background:
              'radial-gradient(circle at 50% 48%, rgba(37,99,235,0.34) 0%, rgba(59,130,246,0.18) 28%, rgba(37,99,235,0.08) 48%, rgba(0,0,0,0) 78%)',
          }}
          animate={{
            scale: selected ? [0.98, 1.08, 1, 0.98] : [0.94, 1.02, 0.96, 0.94],
            opacity: selected ? [0.28, 0.62, 0.4, 0.28] : [0.12, 0.3, 0.18, 0.12],
            y: selected ? [0, 8, 2, 0] : [0, 4, 1, 0],
            x: selected ? [0, -3, 2, 0] : [0, -1, 1, 0],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.div
          className="absolute inset-[18%] rounded-full border border-blue-200/10"
          animate={{
            scale: selected ? [0.76, 1.1, 0.82] : [0.72, 0.98, 0.76],
            opacity: selected ? [0.04, 0.2, 0.06] : [0.02, 0.1, 0.03],
          }}
          transition={{ duration: 5.4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute inset-[26%] rounded-full border border-blue-100/10"
          animate={{
            scale: selected ? [0.82, 1.12, 0.82] : [0.8, 1, 0.8],
            opacity: selected ? [0.05, 0.24, 0.05] : [0.02, 0.1, 0.02],
          }}
          transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute inset-x-[14%] top-[40%] h-px bg-gradient-to-r from-transparent via-blue-200/26 to-transparent blur-[1px]"
          animate={{
            opacity: selected ? [0.04, 0.18, 0.04] : [0.02, 0.09, 0.02],
            scaleX: selected ? [0.86, 1.08, 0.86] : [0.92, 1.02, 0.92],
            x: selected ? [0, -3, 1, 0] : [0, -1, 0, 0],
          }}
          transition={{ duration: 5.3, repeat: Infinity, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.div
          className="absolute left-1/2 top-[34%] h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[15px]"
          style={{ backgroundColor: theme.core }}
          animate={{
            scale: selected ? [0.86, 1.22, 0.86] : [0.74, 0.98, 0.74],
            opacity: selected ? [0.62, 0.96, 0.62] : [0.28, 0.56, 0.28],
          }}
          transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </>
    )
  }

  if (index === 2) {
    return (
      <>
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 62%, rgba(217,119,6,0.14) 0%, rgba(251,191,36,0.06) 28%, rgba(217,119,6,0.02) 50%, rgba(0,0,0,0) 76%), linear-gradient(180deg, rgba(245,158,11,0.02) 0%, rgba(245,158,11,0.04) 46%, rgba(245,158,11,0.06) 100%)',
          }}
          animate={{
            opacity: selected ? [0.14, 0.3, 0.18, 0.14] : [0.06, 0.16, 0.1, 0.06],
            scale: selected ? [0.99, 1.02, 1, 0.99] : [0.99, 1.01, 1, 0.99],
          }}
          transition={{ duration: 7.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute inset-x-[-18%] bottom-[-2%] top-[10%] rounded-[42%] blur-[36px]"
          style={{
            background:
              'radial-gradient(ellipse at 50% 58%, rgba(217,119,6,0.34) 0%, rgba(251,191,36,0.14) 32%, rgba(217,119,6,0.06) 50%, rgba(0,0,0,0) 76%)',
          }}
          animate={{
            scale: selected ? [0.98, 1.04, 1, 0.98] : [0.94, 1, 0.96, 0.94],
            opacity: selected ? [0.22, 0.52, 0.34, 0.22] : [0.1, 0.24, 0.16, 0.1],
            x: selected ? [0, -4, 2, 0] : [0, -2, 1, 0],
          }}
          transition={{ duration: 7.1, repeat: Infinity, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.div
          className="absolute left-1/2 top-[35%] h-[3.5rem] w-[3.5rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[15px]"
          style={{ backgroundColor: theme.core }}
          animate={{
            scale: selected ? [0.9, 1.22, 0.92] : [0.76, 1.02, 0.78],
            opacity: selected ? [0.66, 0.98, 0.72] : [0.32, 0.58, 0.36],
          }}
          transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute left-1/2 top-[36%] h-28 w-28 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[30px] border border-amber-200/10"
          style={{
            background:
              'linear-gradient(150deg, rgba(255,251,235,0.16) 0%, rgba(251,191,36,0.08) 38%, rgba(255,255,255,0) 76%)',
          }}
          animate={{
            scale: selected ? [0.92, 1.06, 0.94] : [0.9, 1.02, 0.92],
            rotate: selected ? [45, 48, 45] : [45, 46, 45],
            opacity: selected ? [0.08, 0.22, 0.08] : [0.04, 0.12, 0.04],
            x: selected ? [0, -3, 1, 0] : [0, -1, 0, 0],
          }}
          transition={{ duration: 6.2, repeat: Infinity, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.div
          className="absolute inset-x-[8%] top-[42%] h-px bg-gradient-to-r from-transparent via-amber-100/18 to-transparent"
          animate={{
            opacity: selected ? [0.04, 0.16, 0.04] : [0.02, 0.08, 0.02],
            scaleX: selected ? [0.88, 1.06, 0.88] : [0.92, 1.02, 0.92],
          }}
          transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </>
    )
  }

  return (
    <>
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, rgba(13,148,136,0.02) 6%, rgba(45,212,191,0.09) 34%, rgba(13,148,136,0.05) 54%, rgba(0,0,0,0) 82%), radial-gradient(circle at 50% 34%, rgba(45,212,191,0.12) 0%, rgba(45,212,191,0.04) 26%, rgba(0,0,0,0) 70%)',
          }}
          animate={{
          opacity: selected ? [0.16, 0.34, 0.2, 0.16] : [0.08, 0.18, 0.1, 0.08],
          x: selected ? [0, -5, 2, 0] : [0, -2, 1, 0],
        }}
        transition={{ duration: 5.8, repeat: Infinity, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="absolute inset-x-[-18%] inset-y-[8%] rounded-[46%] blur-[38px]"
        style={{
          background:
            'linear-gradient(135deg, rgba(13,148,136,0.06) 6%, rgba(45,212,191,0.22) 34%, rgba(15,118,110,0.10) 60%, rgba(0,0,0,0) 84%)',
        }}
        animate={{
          scale: selected ? [0.96, 1.08, 0.96] : [0.9, 1.02, 0.9],
          opacity: selected ? [0.26, 0.62, 0.26] : [0.12, 0.28, 0.12],
          x: selected ? [0, -10, 4, 0] : [0, -4, 2, 0],
        }}
        transition={{ duration: 5.6, repeat: Infinity, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="absolute left-1/2 top-[33%] h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[15px]"
        style={{ backgroundColor: theme.core }}
        animate={{
          scale: selected ? [0.88, 1.22, 0.88] : [0.72, 0.98, 0.72],
          opacity: selected ? [0.68, 0.98, 0.68] : [0.3, 0.58, 0.3],
          x: selected ? [0, -4, 2, 0] : [0, -2, 1, 0],
        }}
        transition={{ duration: 3.9, repeat: Infinity, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="absolute inset-x-[2%] top-[30%] h-12 -rotate-[16deg] rounded-full blur-[18px]"
        style={{ background: theme.orb }}
        animate={{
          opacity: selected ? [0.12, 0.32, 0.12] : [0.04, 0.14, 0.04],
          x: selected ? [0, -10, 4, 0] : [0, -4, 2, 0],
        }}
        transition={{ duration: 4.5, repeat: Infinity, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="absolute inset-x-[8%] top-[38%] h-px rotate-[12deg] bg-gradient-to-r from-transparent via-teal-100/24 to-transparent"
        animate={{
          opacity: selected ? [0.04, 0.18, 0.04] : [0.02, 0.08, 0.02],
          x: selected ? [0, -8, 3, 0] : [0, -3, 1, 0],
        }}
        transition={{ duration: 4.1, repeat: Infinity, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="absolute left-[52%] top-[26%] h-2.5 w-2.5 rounded-full bg-teal-100/70 blur-[1px]"
        animate={{
          opacity: selected ? [0.06, 0.26, 0.06] : [0.02, 0.12, 0.02],
          x: selected ? [0, -3, 0] : [0, -1, 0],
          y: selected ? [0, -6, 0] : [0, -3, 0],
        }}
        transition={{ duration: 3.8, repeat: Infinity, ease: [0.22, 1, 0.36, 1] }}
      />
    </>
  )
}

type QuizViewProps = {
  currentQuestionIndex: number
  userAnswers: UserAnswers
  activeAnswer: string | null
  onAnswerSelect: (questionId: string, answer: string) => void
}

function QuizView({
  currentQuestionIndex,
  userAnswers,
  activeAnswer,
  onAnswerSelect,
}: QuizViewProps) {
  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <motion.section
      key="quiz"
      className="safe-shell relative z-10 mx-auto flex min-h-[100svh] w-full max-w-xl flex-col justify-center px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={viewTransition}
    >
      <motion.div
        className="mx-auto w-full"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={viewTransition}
      >
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="h-px flex-1 overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              className="h-full rounded-full bg-[linear-gradient(90deg,rgba(245,196,118,0.16),rgba(245,196,118,0.82),rgba(245,196,118,0.16))]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          <div className="shrink-0 text-[10px] uppercase tracking-[0.32em] text-zinc-500">
            {String(Math.min(currentQuestionIndex + 1, questions.length)).padStart(2, '0')} /{' '}
            {String(questions.length).padStart(2, '0')}
          </div>
        </div>

        <motion.div
          className="overflow-hidden rounded-[30px] border border-white/[0.08] bg-white/[0.03] px-5 py-6 backdrop-blur-[26px] shadow-[0_14px_40px_rgba(0,0,0,0.24),inset_0_1px_0_rgba(255,255,255,0.05)]"
          initial="hidden"
          animate="show"
          variants={containerVariants}
        >
          <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/14 to-transparent" />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 36 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -36 }}
              transition={viewTransition}
              className="space-y-8"
            >
              <div className="space-y-4 text-center">
                <div className="text-[10px] uppercase tracking-[0.32em] text-zinc-500">能量场互动</div>
                <motion.h2
                  className="mx-auto max-w-[17rem] text-[1.7rem] font-semibold leading-tight text-transparent sm:max-w-[24rem]"
                  style={{
                    fontFamily:
                      "'Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', 'Songti SC', 'STSong', serif",
                    backgroundImage:
                      'linear-gradient(110deg, rgba(247,233,198,0.94) 0%, rgba(245,196,118,0.84) 38%, rgba(255,245,224,0.96) 100%)',
                    WebkitBackgroundClip: 'text',
                  }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  {currentQuestion.title}
                </motion.h2>
              </div>

              {currentQuestion.type === 'energy-card' ? (
                <div className="grid grid-cols-2 gap-3">
                  {currentQuestion.options.map((option, index) => {
                    const selected = activeAnswer === option || userAnswers[currentQuestion.id] === option
                    const theme = energyCardThemes[index]

                    return (
                      <motion.button
                        key={option}
                        type="button"
                        aria-label={option}
                        onClick={() => onAnswerSelect(currentQuestion.id, option)}
                        whileTap={{ scale: 0.96 }}
                        className={`group relative flex aspect-[4/5] flex-col items-center justify-end overflow-hidden rounded-[24px] border pb-5 text-center backdrop-blur-2xl transition-all duration-500 ${
                          selected
                            ? `bg-white/[0.03] ${theme.borderSelected}`
                            : `border-white/[0.06] bg-white/[0.012] opacity-85 saturate-[0.92] ${theme.borderHover}`
                        }`}
                      >
                        {selected ? (
                          <motion.div
                            className="absolute -inset-6 rounded-[30px] blur-2xl"
                            style={{ background: theme.orb }}
                            animate={{ opacity: [0.16, 0.34, 0.16], scale: [0.96, 1.04, 0.96] }}
                            transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
                          />
                        ) : null}
                        {selected ? (
                          <motion.div
                            className="absolute inset-[6%] rounded-[22px] border border-white/10"
                            animate={{
                              scale: [0.84, 1.18, 1.28],
                              opacity: [0.26, 0.14, 0],
                            }}
                            transition={{ duration: 0.9, repeat: Infinity, ease: [0.22, 1, 0.36, 1] }}
                          />
                        ) : null}
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.01)_42%,rgba(255,255,255,0.015)_100%)]" />
                        <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                        {selected ? (
                          <motion.div
                            className="absolute inset-y-0 left-[-32%] w-2/3 bg-[linear-gradient(115deg,rgba(255,255,255,0),rgba(255,255,255,0.07),rgba(255,255,255,0))] blur-xl"
                            animate={{ x: ['0%', '190%'] }}
                            transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
                          />
                        ) : null}
                        <EnergyCardAura index={index} selected={selected} theme={theme} />

                        <div
                          className={`relative z-10 text-[13.5px] font-light tracking-[0.1em] ${
                            selected ? 'text-zinc-100' : 'text-zinc-300/82'
                          }`}
                        >
                          {option}
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {currentQuestion.options.map((option) => {
                    const selected = activeAnswer === option || userAnswers[currentQuestion.id] === option

                    return (
                      <motion.button
                        key={option}
                        type="button"
                        onClick={() => onAnswerSelect(currentQuestion.id, option)}
                        whileTap={{ scale: 0.98 }}
                        className={`group relative overflow-hidden rounded-2xl border bg-white/[0.05] px-4 py-4 text-left backdrop-blur-xl transition ${
                          selected
                            ? 'border-amber-300/35 shadow-[0_0_0_1px_rgba(251,191,36,0.08),0_0_26px_rgba(251,191,36,0.10)]'
                            : 'border-white/[0.08] hover:border-amber-200/18'
                        }`}
                      >
                        <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />
                        <div className="absolute inset-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]" />
                        {selected ? (
                          <motion.div
                            className="absolute inset-0 bg-[linear-gradient(90deg,rgba(245,196,118,0.08),rgba(245,196,118,0),rgba(245,196,118,0.04))]"
                            animate={{ opacity: [0.35, 0.65, 0.35] }}
                            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                          />
                        ) : null}
                        <div className="relative text-[15px] leading-6 tracking-[0.06em] text-zinc-100">{option}</div>
                      </motion.button>
                    )
                  })}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.section>
  )
}

function ProcessingView({ onProcessComplete }: { onProcessComplete: () => void }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  useEffect(() => {
    const stepInterval = window.setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % processingSteps.length)
    }, 2500)

    return () => window.clearInterval(stepInterval)
  }, [])

  useEffect(() => {
    const processTimer = window.setTimeout(() => {
      onProcessComplete()
    }, 9200)

    return () => window.clearTimeout(processTimer)
  }, [onProcessComplete])

  return (
    <motion.section
      key="processing"
      className="safe-shell relative z-10 mx-auto flex min-h-[100svh] w-full max-w-xl flex-col justify-center px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={viewTransition}
    >
      <motion.div
        className="mx-auto flex w-full flex-col items-center text-center"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={viewTransition}
      >
        <div className="text-[10px] uppercase tracking-[0.34em] text-zinc-500">推演加载中</div>

        <div className="relative mt-8 flex h-[18rem] w-[18rem] items-center justify-center sm:h-[20rem] sm:w-[20rem]">
          <motion.div
            className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(245,196,118,0.10)_0%,rgba(245,196,118,0.04)_24%,rgba(0,0,0,0)_70%)] blur-3xl"
            animate={{
              scale: [0.94, 1.04, 0.94],
              opacity: [0.32, 0.54, 0.32],
            }}
            transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.div
            className="absolute h-[15.5rem] w-[15.5rem] rounded-full opacity-80"
            style={{
              background:
                'conic-gradient(from 0deg, rgba(245,196,118,0) 0deg, rgba(245,196,118,0) 24deg, rgba(245,196,118,0.75) 40deg, rgba(245,196,118,0.08) 72deg, rgba(245,196,118,0) 108deg, rgba(245,196,118,0) 156deg, rgba(245,196,118,0.58) 182deg, rgba(245,196,118,0.08) 214deg, rgba(245,196,118,0) 248deg, rgba(245,196,118,0) 292deg, rgba(245,196,118,0.7) 326deg, rgba(245,196,118,0) 360deg)',
              WebkitMaskImage:
                'radial-gradient(circle, transparent 65%, black 66%, black 69%, transparent 70%)',
              maskImage:
                'radial-gradient(circle, transparent 65%, black 66%, black 69%, transparent 70%)',
              filter: 'drop-shadow(0 0 14px rgba(245, 196, 118, 0.18))',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />

          <motion.div
            className="absolute h-[12.25rem] w-[12.25rem] rounded-full border border-white/[0.08]"
            style={{
              background:
                'radial-gradient(circle, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.01) 30%, rgba(0,0,0,0) 70%)',
              boxShadow:
                'inset 0 0 0 1px rgba(255,255,255,0.02), 0 0 28px rgba(59,130,246,0.05)',
            }}
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          >
            {[
              { top: '11%', left: '50%', delay: 0 },
              { top: '28%', left: '82%', delay: 1.1 },
              { top: '72%', left: '74%', delay: 0.6 },
              { top: '84%', left: '38%', delay: 1.6 },
              { top: '34%', left: '18%', delay: 0.3 },
            ].map((dot) => (
              <motion.span
                key={`${dot.top}-${dot.left}`}
                className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-100/80 shadow-[0_0_10px_rgba(245,196,118,0.55)]"
                style={{ top: dot.top, left: dot.left }}
                animate={{
                  opacity: [0.24, 0.92, 0.24],
                  scale: [0.7, 1.18, 0.7],
                }}
                transition={{
                  duration: 3.2,
                  delay: dot.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.div>

          <motion.div
            className="absolute h-[8.5rem] w-[8.5rem] rounded-full border border-white/[0.06] bg-[radial-gradient(circle,rgba(255,255,255,0.02)_0%,rgba(0,0,0,0)_70%)]"
            animate={{ rotate: 360, scale: [1, 1.03, 1] }}
            transition={{
              rotate: { duration: 12, repeat: Infinity, ease: 'linear' },
              scale: { duration: 6.5, repeat: Infinity, ease: 'easeInOut' },
            }}
          />

          <motion.div
            className="absolute flex h-20 w-20 items-center justify-center rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.52)_0%,rgba(251,191,36,0.16)_36%,rgba(251,191,36,0.03)_62%,rgba(0,0,0,0)_78%)]"
            animate={{
              scale: [0.94, 1.08, 0.94],
              opacity: [0.68, 1, 0.68],
            }}
            transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <motion.div
              className="h-10 w-10 rounded-full bg-[radial-gradient(circle,rgba(255,244,215,0.98)_0%,rgba(245,196,118,0.78)_45%,rgba(179,120,21,0.08)_78%,rgba(0,0,0,0)_100%)] shadow-[0_0_30px_rgba(245,196,118,0.3)]"
              animate={{
                scale: [0.92, 1.12, 0.92],
                opacity: [0.84, 1, 0.84],
              }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </div>

        <div className="mt-6 h-16 w-full max-w-[18rem]">
          <AnimatePresence mode="wait">
            <motion.p
              key={processingSteps[currentStepIndex]}
              className="text-[13px] leading-7 tracking-[0.12em] text-zinc-300/92"
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: [0.36, 1, 0.7],
                y: [10, 0, -2],
                textShadow: [
                  '0 0 10px rgba(245, 196, 118, 0.06)',
                  '0 0 18px rgba(245, 196, 118, 0.16)',
                  '0 0 10px rgba(245, 196, 118, 0.06)',
                ],
              }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {processingSteps[currentStepIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.section>
  )
}

function ResultView({
  basicInfo,
  userAnswers,
  onRestart,
}: {
  basicInfo: BasicInfo
  userAnswers: UserAnswers
  onRestart: () => void
}) {
  const prompt = buildReportPrompt(basicInfo, userAnswers)
  const report = buildMockReport(basicInfo, userAnswers)
  const sections = parseReportSections(report)

  useEffect(() => {
    console.log(prompt)
  }, [prompt])

  return (
    <motion.section
      key="result"
      className="safe-shell relative z-10 mx-auto flex min-h-[100svh] w-full max-w-xl flex-col justify-center px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={viewTransition}
    >
      <motion.div
        className="mx-auto w-full"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={viewTransition}
      >
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-[0.34em] text-zinc-500">专属洞察已显化</div>
          <h2
            className="mt-5 text-[2rem] font-semibold leading-tight text-transparent"
            style={{
              fontFamily:
                "'Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', 'Songti SC', 'STSong', serif",
              backgroundImage:
                'linear-gradient(110deg, rgba(247,233,198,0.94) 0%, rgba(245,196,118,0.84) 38%, rgba(255,245,224,0.96) 100%)',
              WebkitBackgroundClip: 'text',
              textShadow: '0 0 18px rgba(245, 196, 118, 0.12)',
            }}
          >
            致 {basicInfo.name || '你'} 的专属洞察
          </h2>
          <p className="mx-auto mt-4 max-w-[18rem] text-[12.5px] leading-7 tracking-[0.12em] text-zinc-500">
            命局已落纸，接下来请在静默中阅读这份只属于你的回响。
          </p>
        </div>

        <div className="mt-10">
          {sections.map((section, index) => (
            <motion.article
              key={section.title}
              className="mb-5 rounded-[24px] border border-white/10 bg-white/[0.02] p-6 backdrop-blur-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * index, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <h3
                className="text-[1.15rem] font-semibold text-amber-200"
                style={{
                  fontFamily:
                    "'Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', 'Songti SC', 'STSong', serif",
                }}
              >
                {section.title}
              </h3>
              <p className="mt-4 whitespace-pre-line text-[14px] leading-8 tracking-[0.04em] text-zinc-300">
                {section.content}
              </p>
            </motion.article>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <motion.button
            type="button"
            onClick={onRestart}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3.5 text-sm tracking-[0.16em] text-amber-200 transition"
          >
            重新感应
            <Sparkles className="h-4 w-4" />
          </motion.button>
          <motion.button
            type="button"
            onClick={() => console.log('保存专属海报')}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3.5 text-sm tracking-[0.12em] text-zinc-200 transition"
          >
            保存专属海报
          </motion.button>
        </div>
      </motion.div>
    </motion.section>
  )
}

function App() {
  const [currentView, setCurrentView] = useState<View>('home')
  const [step, setStep] = useState<Step>(1)
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')
  const [gender, setGender] = useState<Gender>('')
  const [calendarMode, setCalendarMode] = useState<CalendarMode>('solar')
  const [lunarMonthType, setLunarMonthType] = useState<LunarMonthType>('regular')
  const [birthYear, setBirthYear] = useState('')
  const [birthMonth, setBirthMonth] = useState('')
  const [birthDay, setBirthDay] = useState('')
  const [birthHour, setBirthHour] = useState('')
  const [birthMinute, setBirthMinute] = useState('')
  const [birthError, setBirthError] = useState('')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({})
  const [activeAnswer, setActiveAnswer] = useState<string | null>(null)
  const [isAnswerTransitioning, setIsAnswerTransitioning] = useState(false)

  const basicInfo = {
    name,
    gender,
    calendarMode,
    lunarMonthType: calendarMode === 'lunar' ? lunarMonthType : null,
    birthDate: `${birthYear}-${birthMonth}-${birthDay}`,
    birthTime: `${birthHour}:${birthMinute}`,
  } satisfies BasicInfo

  const openInputView = () => {
    setStep(1)
    setNameError('')
    setBirthError('')
    setCurrentView('input')
  }

  const backHome = () => {
    setCurrentView('home')
  }

  const resetApp = () => {
    setCurrentView('home')
    setStep(1)
    setName('')
    setNameError('')
    setGender('')
    setCalendarMode('solar')
    setLunarMonthType('regular')
    setBirthYear('')
    setBirthMonth('')
    setBirthDay('')
    setBirthHour('')
    setBirthMinute('')
    setBirthError('')
    setCurrentQuestionIndex(0)
    setUserAnswers({})
    setActiveAnswer(null)
    setIsAnswerTransitioning(false)
  }

  const nextFromName = () => {
    const normalizedName = name.trim()

    if (!normalizedName) {
      setNameError('请输入您的姓名')
      return
    }

    setName(normalizedName)
    setNameError('')
    setStep(2)
  }

  const backStep = () => {
    setStep((prev) => (prev === 3 ? 2 : 1))
  }

  const selectGender = (value: Gender) => {
    setGender(value)
    setBirthError('')
    setStep(3)
  }

  const handleNameChange = (value: string) => {
    const normalizedValue = value.replace(/\s+/g, ' ').trimStart()
    setName(normalizedValue)

    if (nameError && normalizedValue.trim()) {
      setNameError('')
    }
  }

  const resetBirthDateParts = () => {
    setBirthYear('')
    setBirthMonth('')
    setBirthDay('')
    setBirthError('')
  }

  const handleBirthYearChange = (value: string) => {
    setBirthYear(value)
    setBirthError('')

    if (birthMonth && birthDay) {
      const nextDayOptions = getDayOptions(value, birthMonth, calendarMode)
      const dayStillValid = nextDayOptions.some((option) => option.value === birthDay)
      if (!dayStillValid) {
        setBirthDay('')
      }
    }
  }

  const handleBirthMonthChange = (value: string) => {
    setBirthMonth(value)
    setBirthError('')

    if (birthYear && birthDay) {
      const nextDayOptions = getDayOptions(birthYear, value, calendarMode)
      const dayStillValid = nextDayOptions.some((option) => option.value === birthDay)
      if (!dayStillValid) {
        setBirthDay('')
      }
    }
  }

  const submitInput = () => {
    if (!birthYear || !birthMonth || !birthDay || !birthHour || !birthMinute) {
      setBirthError('请完整选择出生日期与时刻')
      return
    }

    setBirthError('')
    setCurrentQuestionIndex(0)
    setUserAnswers({})
    setActiveAnswer(null)
    setIsAnswerTransitioning(false)
    setCurrentView('quiz')
  }

  const handleQuizAnswer = (questionId: string, answer: string) => {
    if (isAnswerTransitioning) return

    setIsAnswerTransitioning(true)
    setActiveAnswer(answer)

    const nextAnswers = {
      ...userAnswers,
      [questionId]: answer,
    }

    setUserAnswers(nextAnswers)

    window.setTimeout(() => {
      const isLastQuestion = currentQuestionIndex === questions.length - 1

      if (isLastQuestion) {
        console.log('收集到的所有数据:', {
          基础信息: basicInfo,
          userAnswers: nextAnswers,
        })
        setCurrentView('processing')
      } else {
        setCurrentQuestionIndex((prev) => prev + 1)
      }

      setActiveAnswer(null)
      setIsAnswerTransitioning(false)
    }, 900)
  }

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-black text-zinc-100">
      <BackgroundLayer />

      <AnimatePresence mode="wait">
        {currentView === 'home' ? (
          <HomeView onOpenInput={openInputView} />
        ) : currentView === 'input' ? (
          <InputView
            step={step}
            name={name}
            nameError={nameError}
            gender={gender}
            calendarMode={calendarMode}
            lunarMonthType={lunarMonthType}
            birthYear={birthYear}
            birthMonth={birthMonth}
            birthDay={birthDay}
            birthHour={birthHour}
            birthMinute={birthMinute}
            birthError={birthError}
            onBackHome={backHome}
            onBackStep={backStep}
            onNameChange={handleNameChange}
            onNextFromName={nextFromName}
            onGenderSelect={selectGender}
            onCalendarModeChange={(value) => {
              setCalendarMode(value)
              if (value === 'solar') {
                setLunarMonthType('regular')
              }
              resetBirthDateParts()
            }}
            onLunarMonthTypeChange={(value) => {
              setLunarMonthType(value)
              setBirthError('')
            }}
            onBirthYearChange={handleBirthYearChange}
            onBirthMonthChange={handleBirthMonthChange}
            onBirthDayChange={(value) => {
              setBirthDay(value)
              setBirthError('')
            }}
            onBirthHourChange={(value) => {
              setBirthHour(value)
              setBirthError('')
            }}
            onBirthMinuteChange={(value) => {
              setBirthMinute(value)
              setBirthError('')
            }}
            onSubmit={submitInput}
          />
        ) : currentView === 'quiz' ? (
          <QuizView
            currentQuestionIndex={currentQuestionIndex}
            userAnswers={userAnswers}
            activeAnswer={activeAnswer}
            onAnswerSelect={handleQuizAnswer}
          />
        ) : currentView === 'processing' ? (
          <ProcessingView onProcessComplete={() => setCurrentView('result')} />
        ) : (
          <ResultView basicInfo={basicInfo} userAnswers={userAnswers} onRestart={resetApp} />
        )}
      </AnimatePresence>
    </main>
  )
}

export default App
