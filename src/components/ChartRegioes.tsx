import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { DataRow } from '../types'
import { normalizarRegiaoIgreja } from '../utils/churchStats'
import styles from './ChartRegioes.module.css'

const CORES = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--chart-6)',
  'var(--chart-7)',
  'var(--chart-8)',
]

type Props = {
  data: DataRow[]
  igrejaKey: string
}

export function ChartRegioes({ data, igrejaKey }: Props) {
  const chartData = useMemo(() => {
    const byRegiao: Record<string, number> = {}
    for (const row of data) {
      const raw = String(row[igrejaKey] ?? '').trim()
      const regiao = normalizarRegiaoIgreja(raw)
      byRegiao[regiao] = (byRegiao[regiao] ?? 0) + 1
    }
    const entries = Object.entries(byRegiao)
      .map(([regiao, count]) => ({ name: regiao, count }))
      .sort((a, b) => b.count - a.count)

    const TOP_N = 11
    const top = entries.slice(0, TOP_N)
    const rest = entries.slice(TOP_N)
    const outrosTotal = rest.reduce((acc, x) => acc + x.count, 0)

    const base = [...top]
    if (outrosTotal > 0) {
      base.push({ name: 'Outras regiões', count: outrosTotal })
    }

    return base.map((item, i) => ({
      ...item,
      fill: CORES[i % CORES.length],
    }))
  }, [data, igrejaKey])

  if (chartData.length === 0) return null

  return (
    <div className={styles.wrapper}>
      <div className={styles.chartWrap}>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
          >
            <XAxis
              type="number"
              stroke="var(--text-muted)"
              tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
              tickFormatter={(v) => (v >= 10 ? v : String(v))}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={120}
              stroke="var(--text-muted)"
              tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
              tickFormatter={(v) => (v.length > 18 ? v.slice(0, 17) + '…' : v)}
            />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              contentStyle={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                boxShadow: 'var(--shadow)',
                color: '#fff',
                fontSize: '14px',
                padding: '10px 14px',
              }}
              labelStyle={{ color: '#fff', fontWeight: 600, marginBottom: 4 }}
              itemStyle={{ color: '#fff' }}
              labelFormatter={(label) => normalizarRegiaoIgreja(String(label ?? ''))}
              formatter={(
                value: number,
                _name: string,
                props: { payload?: { name?: string } },
              ) => [
                `⛪ ${value.toLocaleString('pt-BR')} inscrições`,
                `🙏 ${normalizarRegiaoIgreja(props.payload?.name ?? '')}`,
              ]}
            />
            <Bar
              dataKey="count"
              radius={[0, 6, 6, 0]}
              maxBarSize={28}
              background={false}
              activeBar={{
                stroke: 'rgba(255,255,255,0.4)',
                strokeWidth: 2,
                filter: 'drop-shadow(0 0 6px rgba(99, 102, 241, 0.5))',
              }}
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
