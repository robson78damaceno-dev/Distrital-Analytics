import type { DataRow } from '../types'
import styles from './SummaryCards.module.css'

type Props = {
  data: DataRow[]
  numericKeys: string[]
  /** Quando não há colunas numéricas, mostra um único card com total (ex: inscrições). */
  totalLabel?: string
}

function toNum(v: string | number): number {
  if (typeof v === 'number' && !Number.isNaN(v)) return v
  const n = Number(String(v).replace(/\./g, '').replace(',', '.'))
  return Number.isNaN(n) ? 0 : n
}

export function SummaryCards({ data, numericKeys, totalLabel }: Props) {
  const stats = numericKeys.length > 0
    ? numericKeys.map((key) => {
        const values = data.map((row) => toNum(row[key]))
        const sum = values.reduce((a, b) => a + b, 0)
        const avg = values.length ? sum / values.length : 0
        const valid = values.filter((v) => v !== 0 && !Number.isNaN(v)).length
        return { key, sum, avg, count: valid }
      })
    : totalLabel
      ? [{ key: totalLabel, sum: data.length, avg: data.length, count: data.length }]
      : []

  if (stats.length === 0) return null

  return (
    <div className={styles.grid}>
      {stats.map((s) => (
        <div key={s.key} className={styles.card}>
          <span className={styles.label}>{s.key}</span>
          <span className={styles.value}>
            {typeof s.sum === 'number' && s.sum % 1 !== 0
              ? s.sum.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
              : s.sum.toLocaleString('pt-BR')}
          </span>
          <span className={styles.meta}>
            {numericKeys.length > 0
              ? `Média: ${s.avg.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} · ${s.count} registros`
              : `${s.count} registro${s.count !== 1 ? 's' : ''}`}
          </span>
        </div>
      ))}
    </div>
  )
}
