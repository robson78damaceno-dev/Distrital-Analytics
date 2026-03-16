import { useMemo } from 'react'
import type { DataRow } from '../types'
import { isMetodista, inferirGeneroPeloNome, getPeakDay } from '../utils/churchStats'

type Props = {
  data: DataRow[]
  igrejaKey: string
  nomeKey: string
  dateKey: string
}

export function ChurchStats({ data, igrejaKey, nomeKey, dateKey }: Props) {
  const stats = useMemo(() => {
    let metodistas = 0
    let homens = 0
    let mulheres = 0
    let naoIdentificado = 0

    for (const row of data) {
      const igreja = String(row[igrejaKey] ?? '')
      if (isMetodista(igreja)) metodistas += 1

      const genero = inferirGeneroPeloNome(row[nomeKey])
      if (genero === 'M') homens += 1
      else if (genero === 'F') mulheres += 1
      else naoIdentificado += 1
    }

    const outras = data.length - metodistas
    const peak = getPeakDay(data, dateKey)

    return {
      total: data.length,
      metodistas,
      outras,
      homens,
      mulheres,
      naoIdentificado,
      peak,
    }
  }, [data, igrejaKey, nomeKey, dateKey])

  const peakLabel =
    stats.peak &&
    (() => {
      const iso = String(stats.peak.date).slice(0, 10)
      const d = new Date(iso)
      if (Number.isNaN(d.getTime())) return ''
      const weekday = d.toLocaleDateString('pt-BR', { weekday: 'long' })
      const day = d.toLocaleDateString('pt-BR', { day: '2-digit' })
      const month = d.toLocaleDateString('pt-BR', { month: 'long' })
      return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)}, ${day} de ${month}`
    })()

  const metodistaPct = stats.total > 0 ? (100 * stats.metodistas) / stats.total : 0
  const outrasPct = stats.total > 0 ? (100 * stats.outras) / stats.total : 0

  const peakDayNumber =
    stats.peak &&
    (() => {
      const iso = String(stats.peak.date).slice(0, 10)
      const d = new Date(iso)
      return Number.isNaN(d.getTime()) ? null : d.getDate()
    })()

  return (
    <section className="mb-6 text-white">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-[0_0_18px_rgba(0,209,255,0.7)]">
          <span className="text-base leading-none">✝</span>
        </div>
        <h2 className="text-sm font-semibold tracking-wide text-slate-100 md:text-base">
          Indicadores da igreja
        </h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_1.4fr_1fr]">
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[rgba(30,41,59,0.40)] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.55)] backdrop-blur-[16px] lg:min-h-[320px]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-cyan-300/15 to-transparent" />
          <div className="mx-auto mt-1 flex h-24 w-24 items-center justify-center rounded-3xl bg-slate-900/60 shadow-[0_18px_40px_rgba(0,0,0,0.55)]">
            <span className="text-5xl leading-none">⛪</span>
          </div>
          <div className="mt-3 text-center">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-300">Total de inscrições</p>
            <p className="mt-2 text-5xl font-semibold leading-none text-cyan-300 drop-shadow-[0_0_28px_rgba(0,209,255,0.65)]">
              {stats.total.toLocaleString('pt-BR')}
            </p>
          </div>
          <div className="mt-5 rounded-2xl border border-white/5 bg-white/5 px-2 py-2">
            <svg viewBox="0 0 220 70" className="h-20 w-full">
              <defs>
                <linearGradient id="churchStatsSpark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00D1FF" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#00D1FF" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 58 L16 50 L32 52 L48 48 L64 42 L80 46 L96 38 L112 28 L128 18 L144 24 L160 16 L176 22 L192 14 L208 26 L220 20"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M0 70 L0 58 L16 50 L32 52 L48 48 L64 42 L80 46 L96 38 L112 28 L128 18 L144 24 L160 16 L176 22 L192 14 L208 26 L220 20 L220 70 Z"
                fill="url(#churchStatsSpark)"
              />
              <circle cx="160" cy="16" r="5" fill="#67E8F9" />
              <circle cx="160" cy="16" r="11" fill="#67E8F9" opacity="0.15" />
            </svg>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          <div className="rounded-[24px] border border-white/10 bg-[rgba(30,41,59,0.40)] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.45)] backdrop-blur-[16px]">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900/70">
                <span className="text-2xl leading-none">📖</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-100">Igrejas metodistas</p>
                <div className="mt-1 flex items-end justify-between gap-3">
                  <span className="text-4xl font-semibold leading-none">{stats.metodistas}</span>
                  <span className="text-xs text-slate-400">{metodistaPct.toFixed(0)}% do total</span>
                </div>
              </div>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800/80">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_18px_rgba(0,209,255,0.5)]"
                style={{ width: `${Math.min(100, metodistaPct)}%` }}
              />
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-[rgba(30,41,59,0.40)] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.45)] backdrop-blur-[16px]">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900/70">
                <span className="text-2xl leading-none">🤝</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-100">Outras igrejas / visitantes</p>
                <div className="mt-1 flex items-end justify-between gap-3">
                  <span className="text-4xl font-semibold leading-none">{stats.outras}</span>
                  <span className="text-xs text-slate-400">{outrasPct.toFixed(0)}% do total</span>
                </div>
              </div>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800/80">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_18px_rgba(0,209,255,0.5)]"
                style={{ width: `${Math.min(100, outrasPct)}%` }}
              />
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-[rgba(30,41,59,0.40)] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.45)] backdrop-blur-[16px] sm:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900/70">
                  <span className="text-2xl leading-none">👩</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-100">Mulheres</p>
                  <p className="mt-1 text-4xl font-semibold leading-none">{stats.mulheres}</p>
                  <p className="mt-3 text-xs text-slate-400">
                    {stats.naoIdentificado > 0 ? `${stats.naoIdentificado} não identificado(s)` : '\u00A0'}
                  </p>
                </div>
              </div>

              <div className="flex items-end justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900/70">
                    <span className="text-2xl leading-none">👨</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-100">Homens</p>
                    <p className="mt-1 text-4xl font-semibold leading-none">{stats.homens}</p>
                  </div>
                </div>

                <div className="flex h-16 items-end gap-2">
                  <div className="w-4 rounded-t-md bg-slate-700/80" style={{ height: '38%' }} />
                  <div className="w-4 rounded-t-md bg-gradient-to-t from-cyan-500 to-cyan-300 shadow-[0_0_16px_rgba(0,209,255,0.45)]" style={{ height: '84%' }} />
                  <div className="w-4 rounded-t-md bg-slate-600/80" style={{ height: '28%' }} />
                  <div className="w-4 rounded-t-md bg-gradient-to-t from-blue-600 to-blue-400 shadow-[0_0_16px_rgba(0,119,255,0.45)]" style={{ height: '74%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {stats.peak && (
          <div className="rounded-[28px] border border-cyan-400/20 bg-[rgba(30,41,59,0.40)] p-4 shadow-[0_20px_70px_rgba(0,0,0,0.55)] backdrop-blur-[16px]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900/70">
                <span className="text-2xl leading-none">📅</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-100">Dia com mais inscrições</p>
                <p className="mt-1 text-base font-semibold leading-tight text-white">
                  {peakLabel}
                </p>
                <p className="mt-1 text-xs text-slate-400">{stats.peak.count} inscrições</p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-white/5 bg-slate-900/45 p-3">
              <div className="mb-2 grid grid-cols-7 text-center text-[10px] text-slate-500">
                <span>Lu</span>
                <span>Ma</span>
                <span>Mi</span>
                <span>Ju</span>
                <span>Ve</span>
                <span>Sá</span>
                <span>Do</span>
              </div>
              <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] text-slate-300">
                {Array.from({ length: 31 }).map((_, i) => {
                  const day = i + 1
                  const active = peakDayNumber === day
                  return (
                    <div
                      key={day}
                      className={`flex h-7 items-center justify-center rounded-lg ${
                        active
                          ? 'bg-gradient-to-br from-cyan-400 to-blue-500 font-semibold text-white shadow-[0_0_14px_rgba(0,209,255,0.7)]'
                          : 'bg-white/[0.02] text-slate-400'
                      }`}
                    >
                      {day}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
