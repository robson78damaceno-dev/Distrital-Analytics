import { useState, useMemo } from 'react'
import type { DataRow } from '../types'
import styles from './DataTable.module.css'

type Props = {
  data: DataRow[]
  columns: string[]
}

const PAGE_SIZE = 10

export function DataTable({ data, columns }: Props) {
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return data
    const lower = search.toLowerCase()
    return data.filter((row) =>
      columns.some((col) => String(row[col] ?? '').toLowerCase().includes(lower)),
    )
  }, [data, columns, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages - 1)
  const slice = filtered.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE)

  return (
    <div className={styles.wrap}>
      <div className={styles.controls}>
        <input
          type="search"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(0)
          }}
          className={styles.search}
        />
      </div>
      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slice.map((row, i) => (
              <tr key={currentPage * PAGE_SIZE + i}>
                {columns.map((col) => (
                  <td key={col}>{String(row[col] ?? '—')}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            type="button"
            className={styles.pageBtn}
            disabled={currentPage === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            Anterior
          </button>
          <span className={styles.pageInfo}>
            Página {currentPage + 1} de {totalPages}
          </span>
          <button
            type="button"
            className={styles.pageBtn}
            disabled={currentPage >= totalPages - 1}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  )
}
