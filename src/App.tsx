import { useState, useEffect, useCallback } from 'react'
import { Dashboard } from './components/Dashboard'
import { Header } from './components/Header'
import { RotateScreen } from './components/RotateScreen'
import { UploadModal } from './components/UploadModal'
import type { DataRow } from './types'
import { fixedRows, fixedColumns } from './data/fixedData'
import { IGREJA_COLUMN_KEY } from './config/columns'
import { normalizarRegiaoIgreja } from './utils/churchStats'
import { parseSpreadsheetFromString } from './utils/parseSpreadsheet'
import './App.css'

const PLANILHA_FIXA_URL = '/planilha.csv'

const STORAGE_ROWS_KEY = 'distrital-analytics:rows'
const STORAGE_COLS_KEY = 'distrital-analytics:columns'

function normalizeRows(rows: DataRow[]): DataRow[] {
  return rows.map((row) => {
    const igrejaRaw = row[IGREJA_COLUMN_KEY]
    return {
      ...row,
      [IGREJA_COLUMN_KEY]: normalizarRegiaoIgreja(String(igrejaRaw ?? '')),
    }
  })
}

function App() {
  const [data, setData] = useState<DataRow[]>(normalizeRows(fixedRows))
  const [columnNames, setColumnNames] = useState<string[]>(fixedColumns)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)

  useEffect(() => {
    try {
      const storedRows = window.localStorage.getItem(STORAGE_ROWS_KEY)
      const storedCols = window.localStorage.getItem(STORAGE_COLS_KEY)
      if (storedRows && storedCols) {
        const parsedRows = normalizeRows(JSON.parse(storedRows))
        setData(parsedRows)
        setColumnNames(JSON.parse(storedCols))
        window.localStorage.setItem(STORAGE_ROWS_KEY, JSON.stringify(parsedRows))
        return
      }
      // Sem dados salvos: carrega planilha fixa do servidor (public/planilha.csv)
      fetch(PLANILHA_FIXA_URL)
        .then((res) => (res.ok ? res.text() : Promise.reject(new Error('Planilha não encontrada'))))
        .then((csv) => {
          const parsed = parseSpreadsheetFromString(csv)
          if (parsed && parsed.rows.length > 0) {
            setData(normalizeRows(parsed.rows))
            setColumnNames(parsed.columns)
          } else {
            setData(normalizeRows(fixedRows))
            setColumnNames(fixedColumns)
          }
        })
        .catch(() => {
          setData(normalizeRows(fixedRows))
          setColumnNames(fixedColumns)
        })
    } catch {
      setData(normalizeRows(fixedRows))
      setColumnNames(fixedColumns)
    }
  }, [])

  const handleFileLoaded = useCallback((rows: DataRow[], columns: string[]) => {
    const normalized = normalizeRows(rows)
    setData(normalized)
    setColumnNames(columns)
    try {
      window.localStorage.setItem(STORAGE_ROWS_KEY, JSON.stringify(normalized))
      window.localStorage.setItem(STORAGE_COLS_KEY, JSON.stringify(columns))
    } catch {
      /* ignore */
    }
  }, [])

  return (
    <div className="app">
      <RotateScreen />
      <Header onUploadClick={() => setUploadModalOpen(true)} />
      <main className="main">
        <Dashboard data={data} columnNames={columnNames} />
      </main>
      <UploadModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onFileLoaded={handleFileLoaded}
      />
    </div>
  )
}

export default App
