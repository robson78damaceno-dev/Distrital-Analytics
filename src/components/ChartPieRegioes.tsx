import { useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { DataRow } from '../types'
import { normalizarRegiaoIgreja } from '../utils/churchStats'
import styles from './ChartPieRegioes.module.css'

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

const MAX_SLICES = 12

export function ChartPieRegioes({ data, igrejaKey }: Props) {
  const chartData = useMemo(() => {
    const byRegiao: Record<string, number> = {}
    for (const row of data) {
      const raw = String(row[igrejaKey] ?? '').trim()
      const regiao = normalizarRegiaoIgreja(raw)
      byRegiao[regiao] = (byRegiao[regiao] ?? 0) + 1
    }
    const total = data.length
    const sorted = Object.entries(byRegiao)
      .map(([name, value]) => ({
        name,
        value,
        pct: total > 0 ? ((100 * value) / total).toFixed(0) : '0',
      }))
      .sort((a, b) => b.value - a.value)
    const top = sorted.slice(0, MAX_SLICES)
    const rest = sorted.slice(MAX_SLICES)
    const outrosCount = rest.reduce((acc, x) => acc + x.value, 0)
    if (outrosCount > 0) {
      top.push({
        name: 'Outras regiões',
        value: outrosCount,
        pct: total > 0 ? ((100 * outrosCount) / total).toFixed(0) : '0',
      })
    }
    return top.map((item, i) => ({
      ...item,
      fill: CORES[i % CORES.length],
    }))
  }, [data, igrejaKey])

  if (chartData.length === 0) return null

  return (
    <div className={styles.wrapper}>
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius="45%"
            outerRadius="80%"
            paddingAngle={1}
            stroke="var(--bg-card)"
            strokeWidth={1.5}
          >
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
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
            formatter={(value: number, name: string, props: { payload?: { pct?: string } }) => [
              `⛪ ${value} inscrições (${props.payload?.pct ?? '0'}%)`,
              `🙏 ${normalizarRegiaoIgreja(name)}`,
            ]}
          />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            formatter={(value) => `🙏 ⛪ ${normalizarRegiaoIgreja(value)}`}
            wrapperStyle={{ fontSize: '13px', color: '#fff' }}
            iconType="circle"
            iconSize={10}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
