import { useCallback, useRef } from 'react'
import * as XLSX from 'xlsx'
import type { DataRow } from '../types'
import { NUMERIC_COLUMN_KEYS } from '../config/columns'
import styles from './UploadZone.module.css'

type Props = {
  onFileLoaded: (rows: DataRow[], columns: string[]) => void
}

function parseValue(val: unknown): string | number {
  if (val == null || val === '') return ''
  if (typeof val === 'number' && !Number.isNaN(val)) return val
  if (typeof val === 'string') {
    const trimmed = val.trim()
    const num = Number(trimmed.replace(/\./g, '').replace(',', '.'))
    if (trimmed !== '' && !Number.isNaN(num)) return num
    return trimmed
  }
  return String(val)
}

export function UploadZone({ onFileLoaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    (file: File) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = e.target?.result
        if (!data || (typeof data !== 'string' && !(data instanceof ArrayBuffer))) return
        const wb = XLSX.read(data, { type: data instanceof ArrayBuffer ? 'array' : 'binary' })
        const firstSheet = wb.SheetNames[0]
        if (!firstSheet) return
        const sheet = wb.Sheets[firstSheet]
        const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as unknown[][]
        if (json.length < 2) return
        const headers = (json[0] as unknown[]).map((h) => String(h ?? ''))
        const rows: DataRow[] = []
        for (let i = 1; i < json.length; i++) {
          const row = json[i] as unknown[]
          const obj: DataRow = {}
          headers.forEach((h, j) => {
            const key = h || `Col${j}`
            obj[key] = parseValue(row[j])
          })
          rows.push(obj)
        }
        onFileLoaded(rows, headers.filter(Boolean))
      }
      reader.readAsArrayBuffer(file)
    },
    [onFileLoaded],
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv'))) {
        handleFile(file)
      }
    },
    [handleFile],
  )

  const onDragOver = useCallback((e: React.DragEvent) => e.preventDefault(), [])

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
      e.target.value = ''
    },
    [handleFile],
  )

  return (
    <section className={styles.section}>
      <div
        className={styles.zone}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={onInputChange}
          className={styles.input}
        />
        <div className={styles.content}>
          <span className={styles.icon}>📊</span>
          <h2 className={styles.heading}>Envie sua planilha</h2>
          <p className={styles.hint}>Arraste um arquivo .xlsx, .xls ou .csv ou clique para selecionar</p>
        </div>
      </div>
      {NUMERIC_COLUMN_KEYS.length > 0 && (
        <p className={styles.configHint}>
          Colunas numéricas configuradas: {NUMERIC_COLUMN_KEYS.join(', ')}. Edite <code>src/config/columns.ts</code> para alterar.
        </p>
      )}
    </section>
  )
}
