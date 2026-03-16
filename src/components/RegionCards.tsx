import { useMemo } from 'react'
import type { DataRow } from '../types'
import { normalizarRegiaoIgreja } from '../utils/churchStats'
import styles from './RegionCards.module.css'

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

export function RegionCards({ data, igrejaKey }: Props) {
  const list = useMemo(() => {
    const byRegiao: Record<string, number> = {}
    for (const row of data) {
      const raw = String(row[igrejaKey] ?? '').trim()
      const regiao = normalizarRegiaoIgreja(raw)
      byRegiao[regiao] = (byRegiao[regiao] ?? 0) + 1
    }
    const total = data.length
    return Object.entries(byRegiao)
      .map(([regiao, count]) => ({
        regiao,
        count,
        pct: total > 0 ? (100 * count) / total : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .map((item, i) => ({ ...item, color: CORES[i % CORES.length] }))
  }, [data, igrejaKey])

  if (list.length === 0) return null

  return (
    <div className={styles.grid}>
      {list.map(({ regiao, count, pct, color }, i) => (
        <div
          key={regiao}
          className={styles.card}
          style={{ ['--card-color' as string]: color }}
        >
          <div className={styles.cardHeader}>
            <span className={styles.rank}>#{i + 1}</span>
            <span className={styles.icon} aria-hidden>⛪</span>
          </div>
          <p className={styles.name}>🙏 {regiao}</p>
          <p className={styles.count}>
            <strong>{count.toLocaleString('pt-BR')}</strong> inscrições
          </p>
          <div className={styles.barWrap}>
            <div
              className={styles.bar}
              style={{ width: `${Math.min(100, pct)}%` }}
            />
          </div>
          <span className={styles.pct}>{pct.toFixed(0)}%</span>
        </div>
      ))}
    </div>
  )
}
