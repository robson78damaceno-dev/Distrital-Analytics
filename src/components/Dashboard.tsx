import { useMemo } from 'react'
import { ChurchList } from './ChurchList'
import { ChartRegioes } from './ChartRegioes'
import { ChartPieRegioes } from './ChartPieRegioes'
import { DataChart } from './DataChart'
import {
  DATE_COLUMN_KEY,
  NUMERIC_COLUMN_KEYS,
  IGREJA_COLUMN_KEY,
} from '../config/columns'
import type { DataRow } from '../types'
import styles from './Dashboard.module.css'

type Props = {
  data: DataRow[]
  columnNames: string[]
}

export function Dashboard({ data, columnNames }: Props) {
  const numericColumns = useMemo(
    () => NUMERIC_COLUMN_KEYS.filter((k) => columnNames.includes(k)),
    [columnNames],
  )
  const dateColumn = DATE_COLUMN_KEY && columnNames.includes(DATE_COLUMN_KEY) ? DATE_COLUMN_KEY : null
  const hasChurchData = columnNames.includes(IGREJA_COLUMN_KEY)

  return (
    <div className={styles.dashboard}>
      <div className={styles.toolbar}>
        <span className={styles.count}>📋 Total de inscrições: {data.length.toLocaleString('pt-BR')}</span>
        <span className={styles.eventName}>Nome do evento: Next Level</span>
      </div>

      {hasChurchData && (
        <>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>📊</span>
              Por região
            </h2>
            <div className={styles.chartsRow}>
              <div className={styles.chartHalf}>
                <ChartRegioes data={data} igrejaKey={IGREJA_COLUMN_KEY} />
              </div>
              <div className={styles.chartHalf}>
                <ChartPieRegioes data={data} igrejaKey={IGREJA_COLUMN_KEY} />
              </div>
            </div>
          </section>
          {dateColumn && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>📅</span>
                Inscrições por dia
              </h2>
              <DataChart data={data} dateKey={dateColumn} valueKeys={numericColumns} />
            </section>
          )}
          <ChurchList data={data} igrejaKey={IGREJA_COLUMN_KEY} />
        </>
      )}

      {!hasChurchData && dateColumn && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>📅</span>
            Inscrições por dia
          </h2>
          <DataChart data={data} dateKey={dateColumn} valueKeys={numericColumns} />
        </section>
      )}
    </div>
  )
}
