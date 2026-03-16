import { useMemo } from 'react'
import type { DataRow } from '../types'
import { normalizarRegiaoIgreja } from '../utils/churchStats'
import styles from './ChurchList.module.css'

type Props = {
  data: DataRow[]
  igrejaKey: string
}

export function ChurchList({ data, igrejaKey }: Props) {
  const list = useMemo(() => {
    const byRegiao: Record<string, number> = {}
    for (const row of data) {
      const raw = String(row[igrejaKey] ?? '').trim()
      const regiao = normalizarRegiaoIgreja(raw)
      byRegiao[regiao] = (byRegiao[regiao] ?? 0) + 1
    }
    return Object.entries(byRegiao)
      .map(([regiao, count]) => ({ regiao, count }))
      .sort((a, b) => b.count - a.count)
  }, [data, igrejaKey])

  if (list.length === 0) return null

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>
        <span className={styles.titleIcon}>🙏</span>
        Lista por região (igreja metodista)
      </h2>
      <p className={styles.legend}>
        ⛪ Agrupado por região: <strong>Taguatinga Norte</strong>, <strong>Fazenda Velha</strong>, <strong>Sol Nascente</strong>, Ceilândia Norte, Ceilândia Sul, Alphaville, Samambaia, Setor O, etc.
      </p>
      <div className={styles.grid}>
        {list.map(({ regiao, count }, i) => (
          <div key={regiao} className={styles.card}>
            <div className={styles.cardHead}>
              <p className={styles.name}>{regiao}</p>
            </div>
            <div className={styles.cardBody}>
              <span className={styles.icon} aria-hidden>⛪</span>
              <span className={styles.badge}>#{i + 1} · Região</span>
            </div>
            <div className={styles.cardFoot}>
              <span className={styles.countLabel}>Inscrições</span>
              <p className={styles.count}>
                <strong>{count.toLocaleString('pt-BR')}</strong>
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
