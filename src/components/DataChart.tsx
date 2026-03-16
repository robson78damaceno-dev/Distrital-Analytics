import { useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { DataRow } from '../types'
import { formatarDataExibicao } from '../utils/churchStats'
import styles from './DataChart.module.css'

type Props = {
  data: DataRow[]
  dateKey: string
  valueKeys: string[]
}

function toNum(v: string | number): number {
  if (typeof v === 'number' && !Number.isNaN(v)) return v
  const n = Number(String(v).replace(/\./g, '').replace(',', '.'))
  return Number.isNaN(n) ? 0 : n
}

function parseDate(val: string | number): string {
  const s = String(val)
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10)
  if (/^\d{2}\/\d{2}\/\d{4}/.test(s)) return s
  return s
}

const COUNT_LABEL = 'Inscrições'

type ChartPoint = { date: string; [key: string]: string | number }

export function DataChart({ data, dateKey, valueKeys }: Props) {
  const chartData = useMemo(() => {
    const byDate: Record<string, ChartPoint> = {}
    const keys = valueKeys.length > 0 ? valueKeys : [COUNT_LABEL]
    for (const row of data) {
      const dateStr = parseDate(row[dateKey] ?? '')
      if (!dateStr) continue
      if (!byDate[dateStr]) {
        const pt: ChartPoint = { date: dateStr }
        for (const k of keys) pt[k] = 0
        byDate[dateStr] = pt
      }
      if (valueKeys.length > 0) {
        for (const k of valueKeys) {
          const prev = (byDate[dateStr][k] as number) ?? 0
          byDate[dateStr][k] = prev + toNum(row[k])
        }
      } else {
        const prev = (byDate[dateStr][COUNT_LABEL] as number) ?? 0
        byDate[dateStr][COUNT_LABEL] = prev + 1
      }
    }
    return Object.values(byDate).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )
  }, [data, dateKey, valueKeys])

  const firstKey = valueKeys.length > 0 ? valueKeys[0] : COUNT_LABEL

  if (chartData.length === 0) return null

  return (
    <div className={styles.wrapper}>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.5} />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="date"
            stroke="var(--text-muted)"
            tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
            tickFormatter={(v) => formatarDataExibicao(v)}
          />
          <YAxis
            stroke="var(--text-muted)"
            tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
            tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v))}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow)',
            }}
            labelStyle={{ color: 'var(--text-primary)' }}
            formatter={(value: number) => [`🙏 ${value.toLocaleString('pt-BR')} inscrições`, firstKey]}
            labelFormatter={(label) => `📅 ${formatarDataExibicao(label)}`}
          />
          <Area
            type="monotone"
            dataKey={firstKey}
            stroke="var(--accent)"
            strokeWidth={2}
            fill="url(#fillValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
